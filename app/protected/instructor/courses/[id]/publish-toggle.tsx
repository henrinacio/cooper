"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./publish-toggle.i18n"

export function PublishToggle({ courseId, published }: { courseId: string; published: boolean }) {
  const [state, setState] = useState(published)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const locale = useLocale()
  const t = translations[locale]

  async function toggle() {
    setLoading(true)
    const supabase = createClient()

    await supabase
      .from("courses")
      .update({ published: !state })
      .eq("id", courseId)

    setState(!state)
    setLoading(false)
    router.refresh()
  }

  return (
    <Button variant={state ? "secondary" : "default"} size="sm" onClick={toggle} disabled={loading}>
      {loading ? "…" : state ? t.unpublish : t.publish}
    </Button>
  )
}
