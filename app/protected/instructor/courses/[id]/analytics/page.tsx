import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CourseWithModules } from "@/lib/supabase/types"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import { LOCALE_LANGUAGE } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CourseAnalyticsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getClaims()

  if (!authData?.claims) {
    redirect("/auth/login")
  }

  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(id, title, order, lessons(id, title, order, type))")
    .eq("id", id)
    .eq("instructor_id", authData.claims.sub as string)
    .order("order", { referencedTable: "modules" })
    .order("order", { referencedTable: "modules.lessons" })
    .single<CourseWithModules>()

  if (!course) {
    notFound()
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id, enrolled_at")
    .eq("course_id", id)

  const totalEnrolled = enrollments?.length ?? 0
  const studentIds = (enrollments ?? []).map((enrollment) => enrollment.user_id)

  const orderedLessons = course.modules
    .slice()
    .sort((moduleA, moduleB) => moduleA.order - moduleB.order)
    .flatMap((module) =>
      module.lessons
        .slice()
        .sort((lessonA, lessonB) => lessonA.order - lessonB.order)
        .map((lesson) => ({ ...lesson, moduleTitle: module.title }))
    )

  const lessonIds = orderedLessons.map((lesson) => lesson.id)
  const totalLessons = lessonIds.length

  let progressRecords: { user_id: string; lesson_id: string; completed_at: string }[] = []

  if (lessonIds.length > 0 && studentIds.length > 0) {
    const { data: progress } = await supabase
      .from("progress")
      .select("user_id, lesson_id, completed_at")
      .in("lesson_id", lessonIds)
      .in("user_id", studentIds)
    progressRecords = progress ?? []
  }

  const completionsByLesson = new Map<string, number>()
  for (const lessonId of lessonIds) {
    const completionCount = progressRecords.filter((record) => record.lesson_id === lessonId).length
    completionsByLesson.set(lessonId, completionCount)
  }

  const completionsByStudent = new Map<string, number>()
  for (const studentId of studentIds) {
    const completionCount = progressRecords.filter((record) => record.user_id === studentId).length
    completionsByStudent.set(studentId, completionCount)
  }

  const totalCompletionsAcrossStudents = Array.from(completionsByStudent.values()).reduce(
    (sum, count) => sum + count,
    0
  )
  const avgLessonsCompleted = totalEnrolled > 0 ? totalCompletionsAcrossStudents / totalEnrolled : 0

  const finisherIds = studentIds.filter((studentId) => {
    const studentCompletionCount = completionsByStudent.get(studentId) ?? 0
    return totalLessons > 0 && studentCompletionCount >= totalLessons
  })

  const completionRate = totalEnrolled > 0 ? (finisherIds.length / totalEnrolled) * 100 : 0

  let avgCompletionDays: number | null = null

  if (finisherIds.length > 0) {
    const enrollmentDateByStudent = new Map<string, string>()
    for (const enrollment of enrollments ?? []) {
      enrollmentDateByStudent.set(enrollment.user_id, enrollment.enrolled_at)
    }

    const completionTimesInDays = finisherIds.map((studentId) => {
      const studentProgress = progressRecords.filter((record) => record.user_id === studentId)
      const lastCompletionTimestamp = Math.max(
        ...studentProgress.map((record) => new Date(record.completed_at).getTime())
      )
      const enrolledAtTimestamp = new Date(enrollmentDateByStudent.get(studentId) ?? "").getTime()
      return (lastCompletionTimestamp - enrolledAtTimestamp) / (1000 * 60 * 60 * 24)
    })

    avgCompletionDays =
      completionTimesInDays.reduce((sum, days) => sum + days, 0) / completionTimesInDays.length
  }

  const dropoffRows = orderedLessons.map((lesson, lessonIndex) => {
    const completions = completionsByLesson.get(lesson.id) ?? 0
    const previousCompletions =
      lessonIndex === 0
        ? totalEnrolled
        : (completionsByLesson.get(orderedLessons[lessonIndex - 1].id) ?? 0)
    const dropped = previousCompletions - completions
    const dropoffRate = previousCompletions > 0 ? (dropped / previousCompletions) * 100 : 0
    const completionPct = totalEnrolled > 0 ? (completions / totalEnrolled) * 100 : 0
    const heatIntensity = totalEnrolled > 0 ? completions / totalEnrolled : 0

    return {
      lesson,
      lessonIndex,
      completions,
      previousCompletions,
      dropped,
      dropoffRate,
      completionPct,
      heatIntensity,
    }
  })

  const locale = await getLocale()
  const t = translations[locale]
  const localeLanguage = LOCALE_LANGUAGE[locale] ?? "en"

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <BackButton href={`/protected/instructor/courses/${id}`} />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-1">{t.heading}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.enrolled}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalEnrolled}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.avgLessonsCompleted}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalEnrolled > 0 ? avgLessonsCompleted.toFixed(1) : "—"}
            </p>
            {totalLessons > 0 && totalEnrolled > 0 && (
              <p className="text-xs text-muted-foreground">
                {t.of} {totalLessons}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.completionRate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalEnrolled > 0 ? `${Math.round(completionRate)}%` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {finisherIds.length} {t.finishers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.avgCompletionTime}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {avgCompletionDays !== null ? Math.round(avgCompletionDays) : "—"}
            </p>
            {avgCompletionDays !== null && (
              <p className="text-xs text-muted-foreground">{t.days}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {totalEnrolled === 0 || totalLessons === 0 ? (
        <p className="text-muted-foreground text-sm">{t.noData}</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.heatmapTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {dropoffRows.map(({ lesson, completions, completionPct, heatIntensity }) => (
                <div key={lesson.id} className="flex items-center gap-3 text-sm">
                  <span className="w-44 truncate text-muted-foreground shrink-0 text-xs">
                    {lesson.title}
                  </span>
                  <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${completionPct}%`,
                        backgroundColor: `hsl(142, 60%, ${55 - heatIntensity * 25}%)`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right shrink-0">
                    {completions}/{totalEnrolled} ({Math.round(completionPct)}%)
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.dropoffTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground text-xs border-b">
                      <th className="pb-2 font-medium pr-4">{t.lessonColumn}</th>
                      <th className="pb-2 font-medium text-right pr-4">{t.completionsColumn}</th>
                      <th className="pb-2 font-medium text-right">{t.dropoffColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dropoffRows.map(
                      ({ lesson, lessonIndex, completions, dropped, dropoffRate }) => (
                        <tr key={lesson.id} className="border-b last:border-0">
                          <td className="py-2 pr-4">
                            <span className="text-muted-foreground text-xs mr-2">
                              {lessonIndex + 1}.
                            </span>
                            {lesson.title}
                          </td>
                          <td className="py-2 text-right pr-4 tabular-nums">
                            {completions}/{totalEnrolled}
                          </td>
                          <td className="py-2 text-right tabular-nums">
                            {dropped > 0 ? (
                              <span className="text-destructive">
                                −{dropped} ({Math.round(dropoffRate)}%)
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
