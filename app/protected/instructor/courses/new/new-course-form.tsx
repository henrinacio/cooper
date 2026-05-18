"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./new-course-form.i18n"

export function NewCourseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locale = useLocale()
  const t = translations[locale]

  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const title = (form.get("title") as string).trim()
    const description = (form.get("description") as string).trim()
    const published = form.get("published") === "on"

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    const { data, error: err } = await supabase
      .from("courses")
      .insert({ title, description: description || null, slug, instructor_id: user.id, published })
      .select("id")
      .single()

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push(`/protected/instructor/courses/${data.id}`)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">{t.titleLabel}</Label>
        <Input id="title" name="title" required placeholder={t.titlePlaceholder} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">{t.descriptionLabel}</Label>
        <Input id="description" name="description" placeholder={t.descriptionPlaceholder} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="published" name="published" />
        <Label htmlFor="published" className="cursor-pointer">{t.publishImmediately}</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? t.creating : t.createCourse}
      </Button>
    </form>
  )
}
