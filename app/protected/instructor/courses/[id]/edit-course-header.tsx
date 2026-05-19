"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateCourse } from "./actions"
import { Pencil, Check, X } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./edit-course-header.i18n"
import { toast } from "sonner"

interface Props {
  courseId: string;
  title: string;
  description: string | null;
}

export function EditCourseHeader({ courseId, title, description }: Props) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const locale = useLocale()
  const t = translations[locale]

  function startEdit() {
    setEditing(true)
    setTimeout(() => titleRef.current?.select(), 0)
  }

  async function save() {
    const newTitle = titleRef.current?.value.trim()
    if (!newTitle) {
      setEditing(false)
      return
    }
    const newDesc = descRef.current?.value.trim() || null
    if (newTitle === title && newDesc === (description?.trim() || null)) {
      setEditing(false)
      return
    }
    setLoading(true)
    const result = await updateCourse(courseId, newTitle, newDesc)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(t.savedSuccess)
      setEditing(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 flex-1">
        <Input
          ref={titleRef}
          defaultValue={title}
          onKeyDown={onKeyDown}
          disabled={loading}
          className="text-2xl font-bold h-auto py-1 px-2"
          autoFocus
        />
        <textarea
          ref={descRef}
          defaultValue={description ?? ""}
          onKeyDown={onKeyDown}
          disabled={loading}
          rows={2}
          placeholder="Description (optional)"
          className="w-full resize-none rounded-md border border-input bg-background px-2 py-1 text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
        />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={save}
            disabled={loading}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            <Check size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
            disabled={loading}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={startEdit}
        className="h-7 w-7 p-0 mt-1 text-muted-foreground hover:text-foreground shrink-0"
      >
        <Pencil size={16} />
      </Button>
    </div>
  )
}
