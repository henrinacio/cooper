"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { removeStudentFromCourse } from "./actions"
import { X } from "lucide-react"

interface Props {
  courseId: string;
  enrollmentId: string;
}

export function RemoveStudentButton({ courseId, enrollmentId }: Props) {
  const [loading, setLoading] = useState(false)

  async function remove() {
    setLoading(true)
    await removeStudentFromCourse(courseId, enrollmentId)
    // revalidatePath in action refreshes the page
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={remove}
      disabled={loading}
      className="text-muted-foreground hover:text-destructive"
    >
      <X size={14} />
    </Button>
  )
}
