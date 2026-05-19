import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LessonForm } from "../lesson-form"
import { Lesson } from "@/lib/supabase/types"
import { ArrowLeft } from "lucide-react"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

interface Props {
  params: Promise<{ id: string; lessonId: string }>
}

export default async function EditLessonPage({ params }: Props) {
  const { id, lessonId } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, modules!inner(course_id)")
    .eq("id", lessonId)
    .eq("modules.course_id", id)
    .single<Lesson & { modules: { course_id: string } }>()

  if (!lesson) {
    notFound()
  }

  const { data: module } = await supabase
    .from("modules")
    .select("id, title")
    .eq("id", lesson.module_id)
    .single()

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/protected/instructor/courses/${id}`}>
            <ArrowLeft size={16} />
            {t.back}
          </Link>
        </Button>
      </div>

      <div>
        {module && (
          <p className="text-sm text-muted-foreground mb-1">{t.moduleLabel} {module.title}</p>
        )}
        <h1 className="text-2xl font-bold">{t.title}</h1>
      </div>

      <LessonForm courseId={id} moduleId={lesson.module_id} lesson={lesson} />
    </div>
  )
}
