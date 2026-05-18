"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { renameModule } from "./actions"
import { Pencil, Check, X } from "lucide-react"

interface Props {
  courseId: string;
  moduleId: string;
  currentTitle: string;
}

export function RenameModuleButton({ courseId, moduleId, currentTitle }: Props) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function save() {
    const value = inputRef.current?.value.trim()
    if (!value || value === currentTitle) {
      setEditing(false)
      return
    }
    setLoading(true)
    await renameModule(courseId, moduleId, value)
    setLoading(false)
    setEditing(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save()
    if (e.key === "Escape") setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <Input
          ref={inputRef}
          defaultValue={currentTitle}
          onKeyDown={onKeyDown}
          disabled={loading}
          className="h-6 text-sm py-0 px-2 flex-1 min-w-0"
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={save}
          disabled={loading}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Check size={13} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing(false)}
          disabled={loading}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0"
        >
          <X size={13} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 flex-1 min-w-0">
      <span className="truncate">{currentTitle}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={startEdit}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0"
      >
        <Pencil size={12} />
      </Button>
    </div>
  )
}
