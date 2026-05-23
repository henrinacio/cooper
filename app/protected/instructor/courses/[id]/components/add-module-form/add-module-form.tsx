"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createModule } from "../../actions"
import { PlusCircle, X } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./add-module-form.i18n"
import { toast } from "sonner"

export function AddModuleForm({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const locale = useLocale()
  const t = translations[locale]

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await createModule(courseId, title.trim())
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(t.addedSuccess)
    setTitle("")
    setOpen(false)
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PlusCircle size={16} />
        {t.addModule}
      </Button>
    )
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t.placeholder}
        required
        className="max-w-xs"
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? t.adding : t.add}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
        <X size={16} />
      </Button>
    </form>
  )
}
