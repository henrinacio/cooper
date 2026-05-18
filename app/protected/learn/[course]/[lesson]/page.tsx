import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Lesson, ModuleWithLessons } from "@/lib/supabase/types"
import Link from "next/link"
import { cn, toEmbedUrl } from "@/lib/utils"
import { CheckCircle, BookOpen, ArrowLeft } from "lucide-react"
import { CompleteButton } from "./complete-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

interface Props {
  params: Promise<{ course: string; lesson: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { course: courseSlug, lesson: lessonId } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const userId = data.claims.sub as string

  const [{ data: course }, { data: profile }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, slug, title, instructor_id, modules(id, title, order, lessons(id, title, type, order))")
      .eq("slug", courseSlug)
      .order("order", { referencedTable: "modules" })
      .order("order", { referencedTable: "modules.lessons" })
      .single(),
    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single(),
  ])

  if (!course) notFound()

  const isPrivileged = profile?.role === "admin" || (profile?.role === "instructor" && course.instructor_id === userId)

  if (!isPrivileged) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", course.id)
      .eq("user_id", userId)
      .maybeSingle()

    if (!enrollment) notFound()
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single<Lesson>()

  if (!lesson) notFound()

  const { data: progressRows } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId)

  const completedIds = new Set(progressRows?.map((p) => p.lesson_id) ?? [])

  const allLessons = (course.modules as ModuleWithLessons[]).flatMap(
    (m) => m.lessons,
  )

  const currentIdx = allLessons.findIndex((l) => l.id === lessonId)

  const nextLesson = allLessons[currentIdx + 1]
  const prevLesson = allLessons[currentIdx - 1]

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex gap-6 min-h-[calc(100vh-4rem)]">
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r pr-4 gap-2 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">
          {course.title}
        </p>
        {(course.modules as ModuleWithLessons[]).map((mod) => (
          <div key={mod.id} className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold text-foreground/70 py-1">
              {mod.title}
            </p>
            {mod.lessons.map((l) => {
              const isActive = l.id === lessonId
              const isDone = completedIds.has(l.id)
              return (
                <Link
                  key={l.id}
                  href={`/protected/learn/${courseSlug}/${l.id}`}
                  className={cn(
                    "flex items-center gap-2 text-sm px-2 py-1 rounded transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  {isDone ? (
                    <CheckCircle size={16} className="shrink-0 text-green-500" />
                  ) : (
                    <BookOpen size={16} className="shrink-0" />
                  )}
                  <span className="line-clamp-1">{l.title}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </aside>

      <div className="flex-1 flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href={`/protected/courses/${courseSlug}`}>
            <ArrowLeft size={16} />
            {t.backToCourse}
          </Link>
        </Button>

        {isPrivileged && (
          <div>
            <Badge variant="outline" className="text-xs">
              {t.previewMode}
            </Badge>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>

        {lesson.type === "video" && lesson.video_url && (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe
              src={toEmbedUrl(lesson.video_url)}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {lesson.content && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{lesson.content}</p>
          </div>
        )}

        <CompleteButton
          lessonId={lessonId}
          userId={userId}
          nextLessonId={nextLesson?.id}
          prevLessonId={prevLesson?.id}
          courseSlug={courseSlug}
          completed={completedIds.has(lessonId)}
          isPrivileged={isPrivileged}
        />
      </div>
    </div>
  )
}
