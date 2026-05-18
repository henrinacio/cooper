"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteModule } from "./actions"
import { Trash2 } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./delete-module-button.i18n"

interface Props {
  courseId: string;
  moduleId: string;
}

export function DeleteModuleButton({ courseId, moduleId }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const locale = useLocale()
  const t = translations[locale]

  async function remove() {
    setLoading(true)
    await deleteModule(courseId, moduleId)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">{t.confirm}</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={remove}
          disabled={loading}
          className="h-6 text-xs px-2"
        >
          {loading ? "…" : t.yes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          className="h-6 text-xs px-2"
        >
          {t.no}
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
    >
      <Trash2 size={13} />
    </Button>
  )
}
