import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CourseWithModules } from "@/lib/supabase/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Pencil, PlusCircle } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { PublishToggle } from "./publish-toggle"
import { AddStudentForm } from "./add-student-form"
import { RemoveStudentButton } from "./remove-student-button"
import { AddModuleForm } from "./add-module-form"
import { DeleteModuleButton } from "./delete-module-button"
import { DeleteLessonButton } from "./delete-lesson-button"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

type EnrollmentProfile = { id: string; full_name: string | null };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(id, title, order, lessons(id, title, type, order))")
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

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <BackButton href="/protected/instructor/courses" />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground mt-1">{course.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/protected/courses/${course.slug}`}>{t.preview}</Link>
          </Button>
          <PublishToggle courseId={course.id} published={course.published} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t.curriculum}</h2>
          <AddModuleForm courseId={course.id} />
        </div>

        {!course.modules.length ? (
          <p className="text-muted-foreground text-sm">{t.noModules}</p>
        ) : (
          course.modules.map((module) => (
            <Card key={module.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>{module.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {module.lessons.length} {t.lessonsLabel}
                    </Badge>
                    <DeleteModuleButton courseId={course.id} moduleId={module.id} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-accent group"
                  >
                    <BookOpen size={13} className="text-muted-foreground shrink-0" />
                    <span className="flex-1">{lesson.title}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {lesson.type}
                    </Badge>
                    <Link
                      href={`/protected/instructor/courses/${course.id}/lessons/${lesson.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Pencil size={12} />
                      </Button>
                    </Link>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteLessonButton courseId={course.id} lessonId={lesson.id} />
                    </div>
                  </div>
                ))}

                <Link
                  href={`/protected/instructor/courses/${course.id}/lessons/new?moduleId=${module.id}`}
                  className="mt-1"
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <PlusCircle size={13} />
                    {t.addLesson}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users size={18} />
          <h2 className="text-xl font-semibold">
            {t.students}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({enrollments?.length ?? 0})
            </span>
          </h2>
        </div>

        <AddStudentForm courseId={course.id} />

        {!!enrollments?.length && (
          <div className="flex flex-col gap-1 mt-2">
            {enrollments.map((enrollment) => {
              const studentFullName = (enrollment.profiles as unknown as EnrollmentProfile)?.full_name
              return (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between text-sm px-3 py-2 rounded border"
                >
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
