import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import { BackButton } from "@/components/back-button"
import { User } from "lucide-react"
import Image from "next/image"
import type { StudentNote } from "@/lib/supabase/types"
import { StudentCourseCard } from "./student-course-card"

interface Props {
  params: Promise<{ studentId: string }>;
}

type CourseRow = {
  id: string;
  title: string;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      order: number;
    }[];
  }[];
}

export default async function StudentProfilePage({ params }: Props) {
  const { studentId } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const instructorId = data.claims.sub as string

  const { data: student } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at")
    .eq("id", studentId)
    .single()

  if (!student) {
    notFound()
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", studentId)

  const enrolledCourseIds = (enrollments ?? []).map((enrollment) => enrollment.course_id)

  let courses: CourseRow[] = []

  if (enrolledCourseIds.length > 0) {
    const { data: coursesData } = await supabase
      .from("courses")
      .select("id, title, modules(id, title, order, lessons(id, title, order))")
      .eq("instructor_id", instructorId)
      .in("id", enrolledCourseIds)
      .order("order", { referencedTable: "modules" })
      .order("order", { referencedTable: "modules.lessons" })

    courses = (coursesData ?? []) as CourseRow[]
  }

  const allLessonIds = courses.flatMap((course) =>
    course.modules.flatMap((courseModule) =>
      courseModule.lessons.map((lesson) => lesson.id)
    )
  )

  let completedLessonIds = new Set<string>()

  if (allLessonIds.length > 0) {
    const { data: progressRecords } = await supabase
      .from("progress")
      .select("lesson_id")
      .eq("user_id", studentId)
      .in("lesson_id", allLessonIds)

    completedLessonIds = new Set((progressRecords ?? []).map((record) => record.lesson_id))
  }

  const { data: notesData } = await supabase
    .from("student_notes")
    .select("*")
    .eq("student_id", studentId)
    .eq("instructor_id", instructorId)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const noteList = (notesData ?? []) as StudentNote[]

  const notesByCourseId = noteList.reduce<Record<string, StudentNote[]>>(
    (accumulator, note) => {
      if (!accumulator[note.course_id]) {
        accumulator[note.course_id] = []
      }
      accumulator[note.course_id].push(note)
      return accumulator
    },
    {}
  )

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <BackButton href="/protected/instructor/courses" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted shrink-0">
          {student.avatar_url ? (
            <Image
              width={56}
              height={56}
              src={student.avatar_url}
              alt={student.full_name ?? ""}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <User size={32} className="text-muted-foreground" />
          )}
        </div>
        <h1 className="text-2xl font-bold">{student.full_name ?? "—"}</h1>
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t.noEnrollments}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {courses.map((course) => {
            const courseModules = course.modules.map((courseModule) => ({
              ...courseModule,
              lessons: courseModule.lessons.map((lesson) => ({
                ...lesson,
                completed: completedLessonIds.has(lesson.id),
              })),
            }))

            const totalLessons = course.modules.reduce(
              (sum, courseModule) => sum + courseModule.lessons.length,
              0
            )
            const completedCount = course.modules.reduce(
              (sum, courseModule) =>
                sum +
                courseModule.lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length,
              0
            )

            return (
              <StudentCourseCard
                key={course.id}
                courseId={course.id}
                courseTitle={course.title}
                modules={courseModules}
                completedCount={completedCount}
                totalLessons={totalLessons}
                studentId={studentId}
                initialNotes={notesByCourseId[course.id] ?? []}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
