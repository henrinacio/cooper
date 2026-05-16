"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteLesson } from "./actions"
import { Trash2 } from "lucide-react"

interface Props {
  courseId: string;
  lessonId: string;
}

export function DeleteLessonButton({ courseId, lessonId }: Props) {
  const [loading, setLoading] = useState(false)

  async function remove() {
    setLoading(true)
    await deleteLesson(courseId, lessonId)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={remove}
      disabled={loading}
      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
    >
      <Trash2 size={13} />
    </Button>
  )
}
