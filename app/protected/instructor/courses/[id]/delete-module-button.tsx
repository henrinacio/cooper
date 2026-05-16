"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteModule } from "./actions"
import { Trash2 } from "lucide-react"

interface Props {
  courseId: string;
  moduleId: string;
}

export function DeleteModuleButton({ courseId, moduleId }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function remove() {
    setLoading(true)
    await deleteModule(courseId, moduleId)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Delete module and all lessons?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={remove}
          disabled={loading}
          className="h-6 text-xs px-2"
        >
          {loading ? "…" : "Yes"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          className="h-6 text-xs px-2"
        >
          No
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
