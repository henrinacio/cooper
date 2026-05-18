"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCircle, Undo2 } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./complete-button.i18n"

interface Props {
  lessonId: string;
  userId: string;
  nextLessonId?: string;
  prevLessonId?: string;
  courseSlug: string;
  completed: boolean;
  isPrivileged: boolean;
}

export function CompleteButton({ lessonId, userId, nextLessonId, prevLessonId, courseSlug, completed, isPrivileged }: Props) {
  const [done, setDone] = useState(completed)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const locale = useLocale()
  const t = translations[locale]

  async function markComplete() {
    if (done) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from("progress").upsert({ user_id: userId, lesson_id: lessonId })
    setDone(true)
    setLoading(false)
    router.refresh()
  }

  async function markIncomplete() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from("progress").delete().eq("user_id", userId).eq("lesson_id", lessonId)
    setDone(false)
    setLoading(false)
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
          <Undo2 size={14} />
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
