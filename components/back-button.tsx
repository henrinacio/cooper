"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./back-button.i18n"

export function BackButton() {
  const router = useRouter()
  const locale = useLocale()
  const t = translations[locale]

  return (
    <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
      <ArrowLeft size={14} />
      {t.back}
    </Button>
  )
}
