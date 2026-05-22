import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { AddStudentForm } from "../add-student-form"
import { RemoveStudentButton } from "../remove-student-button"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

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
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/protected/instructor/courses/${id}/progress`}>
              <BarChart2 size={16} />
              {t.viewProgress}
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-1">
          {t.students}
          <span className="ml-2 text-sm">({enrollments?.length ?? 0})</span>
        </p>
      </div>

      <AddStudentForm courseId={course.id} />

      {!enrollments?.length ? (
        <p className="text-muted-foreground text-sm">{t.noStudents}</p>
      ) : (
        <div className="flex flex-col gap-1">
          {enrollments.map((enrollment) => {
            const studentProfile = (enrollment.profiles as unknown as EnrollmentProfile)
            const studentFullName = studentProfile?.full_name
            return (
              <div
                key={enrollment.id}
                className="flex text-sm px-3 py-2 rounded border"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {studentFullName ?? "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.enrolled} {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </span>
                    </div>
                    <RemoveStudentButton
                      courseId={course.id}
                      enrollmentId={enrollment.id}
                    />
                  </div>
                  <Button asChild variant="outline" size="sm" className="self-start">
                    <Link href={`/protected/instructor/students/${enrollment.user_id}`}>
                      {t.viewProfile}
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
