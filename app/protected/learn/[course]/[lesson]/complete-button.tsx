"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Undo2 } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./complete-button.i18n"
import { markLessonComplete, markLessonIncomplete } from "./actions"
import { toast } from "sonner"

interface Props {
  lessonId: string;
  courseId: string;
  instructorId: string;
  nextLessonId?: string;
  prevLessonId?: string;
  courseSlug: string;
  completed: boolean;
  isPrivileged: boolean;
}

export function CompleteButton({ lessonId, courseId, instructorId, nextLessonId, prevLessonId, courseSlug, completed, isPrivileged }: Props) {
  const [done, setDone] = useState(completed)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const locale = useLocale()
  const t = translations[locale]

  async function markComplete() {
    if (done) return
    setLoading(true)
    await markLessonComplete(lessonId, courseId, instructorId)
    setDone(true)
    setLoading(false)
    toast.success(t.markedComplete)
    router.refresh()
  }

  async function markIncomplete() {
    setLoading(true)
    await markLessonIncomplete(lessonId)
    setDone(false)
    setLoading(false)
    toast.success(t.markedIncomplete)
    router.refresh()
  }

  return (
    <div className="flex gap-3">
      {!isPrivileged && (
        <Button
          onClick={markComplete}
          disabled={done || loading}
          variant={done ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          <CheckCircle size={16} />
          {done ? t.completed : loading ? t.saving : t.markComplete}
        </Button>
      )}
      {done && (
        <Button
          variant="ghost"
          size="sm"
          onClick={markIncomplete}
          disabled={loading}
          className="flex items-center gap-1 text-muted-foreground"
        >
          <Undo2 size={16} />
          {t.undo}
        </Button>
      )}
      {prevLessonId && (
        <Button
          variant="outline"
          onClick={() => router.push(`/protected/learn/${courseSlug}/${prevLessonId}`)}
        >
          {t.previous}
        </Button>
      )}
      {nextLessonId && (
        <Button
          variant="outline"
          onClick={() => router.push(`/protected/learn/${courseSlug}/${nextLessonId}`)}
        >
          {t.next}
        </Button>
      )}
    </div>
  )
}
