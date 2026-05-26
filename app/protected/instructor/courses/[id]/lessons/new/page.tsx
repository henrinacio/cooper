import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LessonForm } from "../lesson-form"
import { ArrowLeft } from "lucide-react"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ moduleId?: string }>;
}

async function NewLessonContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ moduleId?: string }>;
}) {
  const { id } = await params
  const { moduleId } = await searchParams

  if (!moduleId) {
    notFound()
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const { data: module } = await supabase
    .from("modules")
    .select("id, title, course_id")
    .eq("id", moduleId)
    .eq("course_id", id)
    .single()

  if (!module) {
    notFound()
  }

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
        <p className="text-sm text-muted-foreground mb-1">{t.moduleLabel} {module.title}</p>
        <h1 className="text-2xl font-bold">{t.title}</h1>
      </div>

      <LessonForm courseId={id} moduleId={moduleId} />
    </div>
  )
}

export default function NewLessonPage({ params, searchParams }: Props) {
  return (
    <Suspense>
      <NewLessonContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}
