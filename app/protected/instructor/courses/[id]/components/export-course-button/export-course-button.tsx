"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./export-course-button.i18n"

interface Props {
  courseId: string
}

export function ExportCourseButton({ courseId }: Props) {
  const [loading, setLoading] = useState(false)
  const locale = useLocale()
  const t = translations[locale]

  async function handleExport() {
    setLoading(true)

    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/export`)

      if (!response.ok) {
        toast.error(t.error)
        return
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get("Content-Disposition") ?? ""
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : "course-backup.md"

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      <Download size={16} />
      {loading ? t.exporting : t.export}
    </Button>
  )
}
