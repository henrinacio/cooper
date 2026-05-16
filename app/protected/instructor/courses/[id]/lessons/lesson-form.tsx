"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLesson, updateLesson } from "../actions"
import { Lesson, LessonType } from "@/lib/supabase/types"

interface Props {
  courseId: string;
  moduleId: string;
  lesson?: Lesson;
}

const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "video", label: "Video" },
  { value: "text", label: "Text" },
  { value: "quiz", label: "Quiz" },
]

export function LessonForm({ courseId, moduleId, lesson }: Props) {
  const router = useRouter()
  const [type, setType] = useState<LessonType>(lesson?.type ?? "text")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!lesson

  function readingTimeSecs(content: string): number | null {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    return words > 0 ? Math.ceil(words / 200) * 60 : null
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
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
        setError(result.error)
        return
      }

      router.push(`/protected/instructor/courses/${courseId}`)
    } else {
      const result = await createLesson(courseId, moduleId, data)
      setLoading(false)

      if (result.error) {
        setError(result.error)
        return
      }

      router.push(`/protected/instructor/courses/${courseId}`)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={lesson?.title}
          placeholder="Lesson title"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Type</Label>
        <div className="flex gap-2">
          {LESSON_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                type === t.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {type === "video" && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video_url">Video URL</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              defaultValue={lesson?.video_url ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration_s">Duration (seconds)</Label>
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
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            name="content"
            rows={10}
            defaultValue={lesson?.content ?? ""}
            placeholder={type === "quiz" ? "JSON quiz definition or question text…" : "Lesson content (Markdown supported)"}
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-mono"
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Lesson"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/protected/instructor/courses/${courseId}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
