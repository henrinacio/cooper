import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { NewCourseForm } from "./new-course-form"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

export const metadata = { title: "New Course" }

export default async function NewCoursePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.claims.sub as string)
    .single()

  if (!profile || !["instructor", "admin"].includes(profile.role)) {
    redirect("/protected/dashboard")
  }

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <BackButton href="/protected/instructor/courses" />

      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>
      <NewCourseForm />
    </div>
  )
}
