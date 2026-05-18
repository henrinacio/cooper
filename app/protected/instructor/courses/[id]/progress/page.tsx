import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CourseWithModules } from "@/lib/supabase/types"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

type EnrollmentProfile = { id: string; full_name: string | null }

interface Props {
  params: Promise<{ id: string }>
}

export default async function CourseProgressPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/auth/login")

  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(id, title, order, lessons(id, title, order))")
    .eq("id", id)
    .eq("instructor_id", data.claims.sub as string)
    .order("order", { referencedTable: "modules" })
    .order("order", { referencedTable: "modules.lessons" })
    .single<CourseWithModules>()

  if (!course) notFound()

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, user_id, enrolled_at, profiles(id, full_name)")
    .eq("course_id", id)
    .order("enrolled_at", { ascending: false })

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id))
  const studentIds = (enrollments ?? []).map((e) => e.user_id)

  let progressRecords: { user_id: string; lesson_id: string; completed_at: string }[] = []
  if (lessonIds.length > 0 && studentIds.length > 0) {
    const { data: progress } = await supabase
      .from("progress")
      .select("user_id, lesson_id, completed_at")
      .in("lesson_id", lessonIds)
      .in("user_id", studentIds)
    progressRecords = progress ?? []
  }

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <BackButton href={`/protected/instructor/courses/${id}`} />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-1">{t.heading}</p>
      </div>

      {!enrollments?.length ? (
        <p className="text-muted-foreground text-sm">{t.noStudents}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {enrollments.map((enrollment) => {
            const profile = enrollment.profiles as unknown as EnrollmentProfile
            const studentProgress = progressRecords.filter(
              (p) => p.user_id === enrollment.user_id
            )
            const completedIds = new Set(studentProgress.map((p) => p.lesson_id))
            const completedCount = studentProgress.length
            const pct =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0
            const lastActivityTs = studentProgress.length
              ? Math.max(
                  ...studentProgress.map((p) => new Date(p.completed_at).getTime())
                )
              : null

            return (
              <Card key={enrollment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {profile?.full_name ?? "—"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={pct === 100 ? "default" : "outline"}>
                        {completedCount}/{totalLessons} {t.lessons}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {lastActivityTs && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.lastActivity}:{" "}
                      {new Date(lastActivityTs).toLocaleDateString()}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-0">
                  {course.modules.map((module) => {
                    const completedInModule = module.lessons.filter((l) =>
                      completedIds.has(l.id)
                    ).length

                    return (
                      <div key={module.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {module.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {completedInModule}/{module.lessons.length}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2 text-sm py-0.5"
                            >
                              {completedIds.has(lesson.id) ? (
                                <CheckCircle2
                                  size={13}
                                  className="text-green-500 shrink-0"
                                />
                              ) : (
                                <Circle
                                  size={13}
                                  className="text-muted-foreground/40 shrink-0"
                                />
                              )}
                              <span
                                className={
                                  completedIds.has(lesson.id)
                                    ? ""
                                    : "text-muted-foreground"
                                }
                              >
                                {lesson.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
