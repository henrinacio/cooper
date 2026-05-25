import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CourseWithModules } from "@/lib/supabase/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Pencil, PlusCircle, TrendingUp } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { PublishToggle } from "./components/publish-toggle/publish-toggle"
import { AddModuleForm } from "./components/add-module-form/add-module-form"
import { DeleteModuleButton } from "./components/delete-module-button/delete-module-button"
import { DeleteLessonButton } from "./components/delete-lesson-button/delete-lesson-button"
import { RenameModuleButton } from "./components/rename-module-button/rename-module-button"
import { EditCourseHeader } from "./components/edit-course-header/edit-course-header"
import { DeleteCourseButton } from "./components/delete-course-button/delete-course-button"
import { ExportCourseButton } from "./components/export-course-button/export-course-button"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

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

  if (!course) {
    notFound()
  }

  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", id)

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <BackButton href="/protected/instructor/courses" />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/protected/courses/${course.slug}`}>{t.preview}</Link>
          </Button>
          <ExportCourseButton courseId={course.id} />
          <PublishToggle courseId={course.id} published={course.published} />
          <DeleteCourseButton courseId={course.id} />
        </div>
      </div>

      <EditCourseHeader courseId={course.id} title={course.title} description={course.description} />

      <div className="flex gap-4">
        <Link href={`/protected/instructor/courses/${id}/students`} className="block flex-1">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users size={16} />
                {t.students}
              </div>
              <Badge variant="outline" className="text-xs">
                {enrollmentCount ?? 0}
              </Badge>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/protected/instructor/courses/${id}/analytics`} className="block flex-1">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp size={16} />
                {t.viewAnalytics}
              </div>
            </CardContent>
          </Card>
        </Link>
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
                <CardTitle className="text-sm font-semibold flex items-center justify-between group/module">
                  <RenameModuleButton courseId={course.id} moduleId={module.id} currentTitle={module.title} />
                  <div className="flex items-center gap-2 shrink-0">
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
                    <BookOpen size={16} className="text-muted-foreground shrink-0" />
                    <span className="flex-1">{lesson.title}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {lesson.type}
                    </Badge>
                    <Link
                      href={`/protected/instructor/courses/${course.id}/lessons/${lesson.id}`}
                    >
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Pencil size={16} />
                      </Button>
                    </Link>
                    <DeleteLessonButton courseId={course.id} lessonId={lesson.id} />
                  </div>
                ))}

                <Link
                  href={`/protected/instructor/courses/${course.id}/lessons/new?moduleId=${module.id}`}
                  className="mt-1"
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <PlusCircle size={16} />
                    {t.addLesson}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
