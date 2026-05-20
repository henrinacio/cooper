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
import { Plus, Trash2 } from "lucide-react"

interface QuizOption {
  text: string
}

interface QuizQuestion {
  question: string
  options: QuizOption[]
  answer: number | null
}

interface Props {
  courseId: string;
  moduleId: string;
  lesson?: Lesson;
}

function parseQuizContent(content: string | null | undefined): QuizQuestion[] {
  if (!content) {
    return [{ question: "", options: [], answer: null }]
  }
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((rawQuestion: { question?: string; options?: string[]; answer?: number }) => ({
        question: rawQuestion.question ?? "",
        options: Array.isArray(rawQuestion.options)
          ? rawQuestion.options.map((optionText) => ({ text: optionText }))
          : [],
        answer: typeof rawQuestion.answer === "number" ? rawQuestion.answer : null,
      }))
    }
  } catch {
    // not valid JSON, start fresh
  }
  return [{ question: "", options: [], answer: null }]
}

export function LessonForm({ courseId, moduleId, lesson }: Props) {
  const router = useRouter()
  const [type, setType] = useState<LessonType>(lesson?.type ?? "text")
  const [loading, setLoading] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    lesson?.type === "quiz"
      ? parseQuizContent(lesson.content)
      : [{ question: "", options: [], answer: null }]
  )

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

  function addQuestion() {
    setQuizQuestions((previous) => [
      ...previous,
      { question: "", options: [], answer: null },
    ])
  }

  function removeQuestion(questionIndex: number) {
    setQuizQuestions((previous) =>
      previous.filter((_, index) => index !== questionIndex)
    )
  }

  function updateQuestionText(questionIndex: number, questionText: string) {
    setQuizQuestions((previous) =>
      previous.map((existingQuestion, index) =>
        index === questionIndex
          ? { ...existingQuestion, question: questionText }
          : existingQuestion
      )
    )
  }

  function addOption(questionIndex: number) {
    setQuizQuestions((previous) =>
      previous.map((existingQuestion, index) =>
        index === questionIndex
          ? { ...existingQuestion, options: [...existingQuestion.options, { text: "" }] }
          : existingQuestion
      )
    )
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setQuizQuestions((previous) =>
      previous.map((existingQuestion, index) => {
        if (index !== questionIndex) {
          return existingQuestion
        }
        const newOptions = existingQuestion.options.filter((_, optIndex) => optIndex !== optionIndex)
        let newAnswer = existingQuestion.answer
        if (existingQuestion.answer === optionIndex) {
          newAnswer = null
        } else if (existingQuestion.answer !== null && existingQuestion.answer > optionIndex) {
          newAnswer = existingQuestion.answer - 1
        }
        return { ...existingQuestion, options: newOptions, answer: newAnswer }
      })
    )
  }

  function updateOptionText(questionIndex: number, optionIndex: number, optionText: string) {
    setQuizQuestions((previous) =>
      previous.map((existingQuestion, qIndex) =>
        qIndex === questionIndex
          ? {
              ...existingQuestion,
              options: existingQuestion.options.map((existingOption, oIndex) =>
                oIndex === optionIndex ? { text: optionText } : existingOption
              ),
            }
          : existingQuestion
      )
    )
  }

  function setCorrectAnswer(questionIndex: number, optionIndex: number) {
    setQuizQuestions((previous) =>
      previous.map((existingQuestion, index) =>
        index === questionIndex
          ? { ...existingQuestion, answer: optionIndex }
          : existingQuestion
      )
    )
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    let content: string | null = null
    let duration_s: number | null = null

    if (type === "quiz") {
      const serializedQuestions = quizQuestions
        .filter((quizQuestion) => quizQuestion.question.trim())
        .map((quizQuestion) => {
          const filteredOptions = quizQuestion.options
            .map((option) => option.text.trim())
            .filter(Boolean)

          const questionData: {
            question: string
            options?: string[]
            answer?: number
          } = { question: quizQuestion.question.trim() }

          if (filteredOptions.length > 0) {
            questionData.options = filteredOptions
          }

          if (quizQuestion.answer !== null) {
            questionData.answer = quizQuestion.answer
          }

          return questionData
        })

      content = serializedQuestions.length > 0 ? JSON.stringify(serializedQuestions) : null
    } else if (type === "text") {
      content = (form.get("content") as string).trim() || null
      if (content) {
        duration_s = readingTimeSecs(content)
      }
    } else if (type === "video") {
      duration_s = Number(form.get("duration_s")) || null
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
          {LESSON_TYPES.map((lessonType) => (
            <button
              key={lessonType.value}
              type="button"
              onClick={() => setType(lessonType.value)}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                type === lessonType.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {lessonType.label}
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

      {type === "text" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">{t.content}</Label>
          <textarea
            id="content"
            name="content"
            rows={10}
            defaultValue={lesson?.content ?? ""}
            placeholder={t.textPlaceholder}
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-mono"
          />
        </div>
      )}

      {type === "quiz" && (
        <div className="flex flex-col gap-4">
          <Label>{t.quiz}</Label>

          {quizQuestions.map((quizQuestion, questionIndex) => (
            <div key={questionIndex} className="flex flex-col gap-2 border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground shrink-0">
                  Q{questionIndex + 1}
                </span>
                <Input
                  value={quizQuestion.question}
                  onChange={(event) => updateQuestionText(questionIndex, event.target.value)}
                  placeholder={t.questionPlaceholder}
                  className="flex-1"
                />
                {quizQuestions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {quizQuestion.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2 pl-6">
                  <input
                    type="radio"
                    name={`correct-answer-${questionIndex}`}
                    checked={quizQuestion.answer === optionIndex}
                    onChange={() => setCorrectAnswer(questionIndex, optionIndex)}
                    title={t.markCorrect}
                    className="shrink-0"
                  />
                  <Input
                    value={option.text}
                    onChange={(event) => updateOptionText(questionIndex, optionIndex, event.target.value)}
                    placeholder={`${t.optionPlaceholder} ${optionIndex + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(questionIndex, optionIndex)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addOption(questionIndex)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pl-6 w-fit"
              >
                <Plus size={12} />
                {t.addOption}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <Plus size={14} />
            {t.addQuestion}
          </button>
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
