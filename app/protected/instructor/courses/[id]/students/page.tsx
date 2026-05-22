import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { BarChart2, User } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { AddStudentForm } from "../add-student-form"
import { RemoveStudentButton } from "./remove-student-button"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EnrollmentProfile = { id: string; full_name: string | null };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseStudentsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", id)
    .eq("instructor_id", data.claims.sub as string)
    .single()

  if (!course) {
    notFound()
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, user_id, enrolled_at, profiles(id, full_name)")
    .eq("course_id", id)
    .order("enrolled_at", { ascending: false })

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <BackButton href={`/protected/instructor/courses/${id}`} />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-1">
          {t.students}
        </p>
      </div>

      <div className="flex gap-8 items-start">
        <Card className="shrink-0">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t.enrolledCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{enrollments?.length ?? 0}</p>
          </CardContent>
        </Card>

        <AddStudentForm courseId={course.id} />
      </div>

      <div className="flex gap-4">
        <Link href={`/protected/instructor/courses/${id}/progress`} className="block flex-1">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BarChart2 size={16} />
                {t.viewProgress}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t.enrollmentList}</h2>

      {!enrollments?.length ? (
        <p className="text-muted-foreground text-sm">{t.noStudents}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {enrollments.map((enrollment) => {
            const studentProfile = (enrollment.profiles as unknown as EnrollmentProfile)
            const studentFullName = studentProfile?.full_name
            return (
              <Card key={enrollment.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {studentFullName ?? "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.enrolled} {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/protected/instructor/students/${enrollment.user_id}`}>
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                        <User size={13} />
                        {t.viewProfile}
                      </button>
                    </Link>
                    <RemoveStudentButton
                      courseId={course.id}
                      enrollmentId={enrollment.id}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
