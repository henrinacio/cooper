"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLesson, updateLesson } from "../actions"
import { Lesson, LessonType } from "@/lib/supabase/types"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./lesson-form.i18n"
import { toast } from "sonner"

interface Props {
  courseId: string;
  moduleId: string;
  lesson?: Lesson;
}

export function LessonForm({ courseId, moduleId, lesson }: Props) {
  const router = useRouter()
  const [type, setType] = useState<LessonType>(lesson?.type ?? "text")
  const [loading, setLoading] = useState(false)

  const locale = useLocale()
  const t = translations[locale]

  const LESSON_TYPES: { value: LessonType; label: string }[] = [
    { value: "video", label: t.video },
    { value: "text", label: t.text },
    { value: "quiz", label: t.quiz },
  ]

  const isEdit = !!lesson

  function readingTimeSecs(content: string): number | null {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    return words > 0 ? Math.ceil(words / 200) * 60 : null
  }

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const content = type !== "video" ? ((form.get("content") as string).trim() || null) : null

    let duration_s: number | null = null
    if (type === "video") {
      duration_s = Number(form.get("duration_s")) || null
    } else if (type === "text" && content) {
      duration_s = readingTimeSecs(content)
    }

    const data = {
      title: (form.get("title") as string).trim(),
      type,
      content,
      video_url: type === "video" ? ((form.get("video_url") as string).trim() || null) : null,
      duration_s,
    }

    if (isEdit) {
      const result = await updateLesson(courseId, lesson.id, data)
      setLoading(false)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(t.successEdit)
      router.push(`/protected/instructor/courses/${courseId}`)
    } else {
      const result = await createLesson(courseId, moduleId, data)
      setLoading(false)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(t.successCreate)
      router.push(`/protected/instructor/courses/${courseId}`)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">{t.titleLabel}</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={lesson?.title}
          placeholder={t.titlePlaceholder}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t.typeLabel}</Label>
        <div className="flex gap-2">
          {LESSON_TYPES.map((lt) => (
            <button
              key={lt.value}
              type="button"
              onClick={() => setType(lt.value)}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                type === lt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </div>

      {type === "video" && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video_url">{t.videoUrl}</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              defaultValue={lesson?.video_url ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration_s">{t.duration}</Label>
            <Input
              id="duration_s"
              name="duration_s"
              type="number"
              min={0}
              defaultValue={lesson?.duration_s ?? ""}
              placeholder="300"
            />
          </div>
        </>
      )}

      {type !== "video" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">{t.content}</Label>
          <textarea
            id="content"
            name="content"
            rows={10}
            defaultValue={lesson?.content ?? ""}
            placeholder={type === "quiz" ? t.quizPlaceholder : t.textPlaceholder}
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-mono"
          />
        </div>
      )}

<div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? t.saving : isEdit ? t.saveChanges : t.createLesson}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/protected/instructor/courses/${courseId}`)}
        >
          {t.cancel}
        </Button>
      </div>
    </form>
  )
}
