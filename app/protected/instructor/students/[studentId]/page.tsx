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
      duration_s: number | null;
    }[];
  }[];
}

type EnrollmentRow = {
  course_id: string;
  enrolled_at: string;
}

type ProgressRow = {
  lesson_id: string;
  completed_at: string;
}

type SessionRow = {
  id: string;
  course_id: string;
  title: string;
  scheduled_at: string;
  duration_min: number;
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
    .select("course_id, enrolled_at")
    .eq("user_id", studentId)

  const enrollmentRows = (enrollments ?? []) as EnrollmentRow[]
  const enrolledCourseIds = enrollmentRows.map((enrollment) => enrollment.course_id)
  const enrolledAtByCourseId = Object.fromEntries(
    enrollmentRows.map((enrollment) => [enrollment.course_id, enrollment.enrolled_at])
  )

  let courses: CourseRow[] = []

  if (enrolledCourseIds.length > 0) {
    const { data: coursesData } = await supabase
      .from("courses")
      .select("id, title, modules(id, title, order, lessons(id, title, order, duration_s))")
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
  let progressRows: ProgressRow[] = []

  if (allLessonIds.length > 0) {
    const { data: progressRecords } = await supabase
      .from("progress")
      .select("lesson_id, completed_at")
      .eq("user_id", studentId)
      .in("lesson_id", allLessonIds)

    progressRows = (progressRecords ?? []) as ProgressRow[]
    completedLessonIds = new Set(progressRows.map((record) => record.lesson_id))
  }

  const lessonIdToCourseId = new Map<string, string>(
    courses.flatMap((course) =>
      course.modules.flatMap((courseModule) =>
        courseModule.lessons.map((lesson) => [lesson.id, course.id])
      )
    )
  )

  const lastCompletedAtByCourseId: Record<string, string> = {}
  for (const progressRow of progressRows) {
    const courseId = lessonIdToCourseId.get(progressRow.lesson_id)
    if (!courseId) {
      continue
    }
    const existing = lastCompletedAtByCourseId[courseId]
    if (!existing || progressRow.completed_at > existing) {
      lastCompletedAtByCourseId[courseId] = progressRow.completed_at
    }
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

  const { data: sessionsData } = await supabase
    .from("scheduled_sessions")
    .select("id, course_id, title, scheduled_at, duration_min")
    .eq("instructor_id", instructorId)
    .eq("student_id", studentId)
    .order("scheduled_at", { ascending: true })

  const sessionRows = (sessionsData ?? []) as SessionRow[]

  const sessionsByCourseId = sessionRows.reduce<Record<string, SessionRow[]>>(
    (accumulator, session) => {
      if (!accumulator[session.course_id]) {
        accumulator[session.course_id] = []
      }
      accumulator[session.course_id].push(session)
      return accumulator
    },
    {}
  )

  const totalLessonsAll = allLessonIds.length
  const totalCompletedAll = completedLessonIds.size
  const overallPercentage = totalLessonsAll > 0
    ? Math.round((totalCompletedAll / totalLessonsAll) * 100)
    : 0

  const lastActiveAt = progressRows.length > 0
    ? progressRows.reduce(
        (max, row) => row.completed_at > max ? row.completed_at : max,
        progressRows[0].completed_at
      )
    : null

  const daysInactiveSummary = lastActiveAt
    ? Math.floor((Date.now() - new Date(lastActiveAt).getTime()) / 86400000)
    : null

  const locale = await getLocale()
  const t = translations[locale]

  const lastActiveLabel = (() => {
    if (daysInactiveSummary === null) {
      return t.neverActive
    }
    if (daysInactiveSummary === 0) {
      return t.activeToday
    }
    return `${daysInactiveSummary}${t.daysAgo}`
  })()

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
        <>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm bg-muted/40 rounded-lg px-4 py-3">
            <span>
              <strong className="text-foreground font-semibold">{courses.length}</strong>{" "}
              <span className="text-muted-foreground">{t.courses}</span>
            </span>
            <span>
              <strong className="text-foreground font-semibold">{totalCompletedAll}/{totalLessonsAll}</strong>{" "}
              <span className="text-muted-foreground">{t.lessons}</span>
            </span>
            <span>
              <strong className="text-foreground font-semibold">{overallPercentage}%</strong>{" "}
              <span className="text-muted-foreground">{t.overall}</span>
            </span>
            <span>
              <span className="text-muted-foreground">{t.lastActive}:</span>{" "}
              <strong className="text-foreground font-semibold">{lastActiveLabel}</strong>
            </span>
          </div>

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
                  enrolledAt={enrolledAtByCourseId[course.id] ?? null}
                  lastCompletedAt={lastCompletedAtByCourseId[course.id] ?? null}
                  sessions={sessionsByCourseId[course.id] ?? []}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
