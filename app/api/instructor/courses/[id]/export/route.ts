import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface LessonRow {
  id: string
  title: string
  type: string
  content: string | null
  video_url: string | null
  duration_s: number | null
  order: number
}

interface ModuleRow {
  id: string
  title: string
  order: number
  lessons: LessonRow[]
}

interface CourseRow {
  id: string
  title: string
  description: string | null
  slug: string
  published: boolean
  created_at: string
  modules: ModuleRow[]
}

interface QuizQuestion {
  question: string
  options?: string[]
  answer?: number
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${remainingSeconds}s`
  }

  if (remainingSeconds === 0) {
    return `${minutes} min`
  }

  return `${minutes} min ${remainingSeconds}s`
}

function buildQuizMarkdown(content: string): string {
  let questions: QuizQuestion[] = []

  try {
    questions = JSON.parse(content)
  } catch {
    return content
  }

  return questions
    .map((quizQuestion, questionIndex) => {
      const lines: string[] = [`**Q${questionIndex + 1}:** ${quizQuestion.question}`]

      if (quizQuestion.options && quizQuestion.options.length > 0) {
        const optionLines = quizQuestion.options.map((optionText, optionIndex) => {
          const isCorrect = quizQuestion.answer === optionIndex
          return isCorrect
            ? `- [x] ${optionText} ✓`
            : `- [ ] ${optionText}`
        })
        lines.push(...optionLines)
      }

      return lines.join("\n")
    })
    .join("\n\n")
}

function buildLessonMarkdown(lesson: LessonRow): string {
  const lines: string[] = [`### ${lesson.title}`, `**Type:** ${lesson.type}`]

  if (lesson.type === "video") {
    if (lesson.video_url) {
      lines.push(`**URL:** ${lesson.video_url}`)
    }
    if (lesson.duration_s) {
      lines.push(`**Duration:** ${formatDuration(lesson.duration_s)}`)
    }
  }

  if (lesson.type === "text" && lesson.content) {
    lines.push("", lesson.content)
  }

  if (lesson.type === "quiz" && lesson.content) {
    lines.push("", buildQuizMarkdown(lesson.content))
  }

  return lines.join("\n")
}

function buildCourseMarkdown(course: CourseRow): string {
  const lines: string[] = [`# ${course.title}`]

  if (course.description) {
    lines.push("", `> ${course.description}`)
  }

  const exportedAt = new Date().toISOString().split("T")[0]
  lines.push(
    "",
    `**Slug:** \`${course.slug}\``,
    `**Status:** ${course.published ? "Published" : "Draft"}`,
    `**Exported:** ${exportedAt}`,
  )

  const sortedModules = [...course.modules].sort(
    (moduleA, moduleB) => moduleA.order - moduleB.order
  )

  for (const courseModule of sortedModules) {
    lines.push("", "---", "", `## ${courseModule.title}`)

    const sortedLessons = [...courseModule.lessons].sort(
      (lessonA, lessonB) => lessonA.order - lessonB.order
    )

    for (const lesson of sortedLessons) {
      lines.push("", buildLessonMarkdown(lesson))
    }
  }

  return lines.join("\n")
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getClaims()

  if (!authData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, description, slug, published, created_at, modules(id, title, order, lessons(id, title, type, content, video_url, duration_s, order))")
    .eq("id", id)
    .eq("instructor_id", authData.claims.sub as string)
    .order("order", { referencedTable: "modules" })
    .order("order", { referencedTable: "modules.lessons" })
    .single<CourseRow>()

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  const markdown = buildCourseMarkdown(course)
  const filename = `${course.slug}-backup.md`

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
