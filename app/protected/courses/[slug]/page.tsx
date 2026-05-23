import { createClient } from "@/lib/supabase/server"
import { CourseWithModulesAndInstructor } from "@/lib/supabase/types"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return { title: slug }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const userId = data.claims.sub as string

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  const { data: course } = await supabase
    .from("courses")
    .select(
      "*, profiles!instructor_id(id, full_name, avatar_url), modules(id, title, order, lessons(id, title, type, duration_s, order))",
    )
    .eq("slug", slug)
    .order("order", { referencedTable: "modules" })
    .order("order", { referencedTable: "modules.lessons" })
    .single<CourseWithModulesAndInstructor>()

  if (!course) {
    notFound()
  }

  const locale = await getLocale()
  const t = translations[locale]

  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0,
  )

  const firstLesson = course.modules[0]?.lessons[0]

  const isIstructor = profile ? profile.role === 'instructor' : false

  return (
    <div className="flex flex-col gap-8">
      <BackButton href={isIstructor ? '/protected/instructor/courses' : '/protected/dashboard'} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {isIstructor && (
              <div className="flex text-center">
                <Badge variant="outline" className="text-xs">
                  {t.previewMode}
                </Badge>
              </div>
            )}
          </div>
          {course.description && (
            <p className="text-muted-foreground">{course.description}</p>
          )}
          {course.profiles?.full_name && (
            <p className="text-sm text-muted-foreground">
              {t.instructor}: <span className="font-medium text-foreground">{course.profiles.full_name}</span>
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              {totalLessons} {t.lessonsCount}
            </span>
            <span>
              {t.lastUpdated} {new Date(course.updated_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>

        {!isIstructor && firstLesson && (
          <div>
            <Button asChild>
              <Link href={`/protected/learn/${course.slug}/${firstLesson.id}`}>
                {t.startLearning}
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t.curriculum}</h2>
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {module.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/protected/learn/${course.slug}/${lesson.id}`}
                  className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-muted-foreground" />
                    {lesson.title}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className="text-xs capitalize">
                      {lesson.type}
                    </Badge>
                    {lesson.duration_s && (
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {Math.ceil(lesson.duration_s / 60)}m
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
