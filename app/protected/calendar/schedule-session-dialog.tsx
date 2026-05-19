"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { scheduleSession } from "./actions"
import type { CourseWithStudents } from "@/lib/supabase/types"
import type { translations } from "./schedule-session-dialog.i18n"

type DialogTranslations = (typeof translations)[keyof typeof translations]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: CourseWithStudents[]
  defaultDate?: string
  t: DialogTranslations
}

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"

export function ScheduleSessionDialog({ open, onOpenChange, courses, defaultDate, t }: Props) {
  const [courseId, setCourseId] = useState("")
  const [studentId, setStudentId] = useState("")
  const [title, setTitle] = useState("")
  const [dateTime, setDateTime] = useState(defaultDate ? `${defaultDate}T09:00` : "")
  const [durationMin, setDurationMin] = useState("60")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCourseId("")
      setStudentId("")
      setTitle("")
      setDateTime(defaultDate ? `${defaultDate}T09:00` : "")
      setDurationMin("60")
      setNotes("")
      setError(null)
    }
  }, [open, defaultDate])

  const selectedCourse = courses.find((course) => course.id === courseId)
  const students =
    selectedCourse?.enrollments.map((enrollment) => ({
      id: (enrollment.profiles as { id: string; full_name: string | null } | null)?.id ?? enrollment.user_id,
      full_name:
        (enrollment.profiles as { id: string; full_name: string | null } | null)?.full_name ?? "Unknown",
    })) ?? []

  function resetForm() {
    setCourseId("")
    setStudentId("")
    setTitle("")
    setDateTime(defaultDate ? `${defaultDate}T09:00` : "")
    setDurationMin("60")
    setNotes("")
    setError(null)
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!courseId || !studentId || !title || !dateTime) {
      return
    }

    setLoading(true)
    setError(null)

    const result = await scheduleSession({
      courseId,
      studentId,
      title,
      scheduledAt: new Date(dateTime).toISOString(),
      durationMin: parseInt(durationMin),
      notes: notes.trim() || null,
    })

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      resetForm()
      onOpenChange(false)
    }
  }

  function handleSetTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  function handleSelectCourse(e: React.ChangeEvent<HTMLSelectElement>) {
    setCourseId(e.target.value)
    setStudentId("")
  }

  function handleSelectStudent(e: React.ChangeEvent<HTMLSelectElement>) {
    setStudentId(e.target.value)
  }

  function handleSetDateTime(e: React.ChangeEvent<HTMLInputElement>) {
    setDateTime(e.target.value)
  }

  function handleSetDurationMin(e: React.ChangeEvent<HTMLSelectElement>) {
    setDurationMin(e.target.value)
  }

  function handleSetNotes(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNotes(e.target.value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sc-title">{t.titleLabel}</Label>
            <Input
              id="sc-title"
              value={title}
              onChange={handleSetTitle}
              placeholder={t.titlePlaceholder}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sc-course">{t.courseLabel}</Label>
            <select
              id="sc-course"
              value={courseId}
              onChange={handleSelectCourse}
              required
              className={selectClass}
            >
              <option value="" disabled>{t.selectCourse}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sc-student">{t.studentLabel}</Label>
            <select
              id="sc-student"
              value={studentId}
              onChange={handleSelectStudent}
              required
              disabled={!courseId || students.length === 0}
              className={selectClass}
            >
              <option value="" disabled>
                {!courseId
                  ? t.selectCourseFirst
                  : students.length === 0
                  ? t.noStudents
                  : t.selectStudent}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.full_name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sc-datetime">{t.dateTimeLabel}</Label>
            <Input
              id="sc-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={handleSetDateTime}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sc-duration">{t.durationLabel}</Label>
            <select
              id="sc-duration"
              value={durationMin}
              onChange={handleSetDurationMin}
              className={selectClass}
            >
              <option value="30">{t.dur30}</option>
              <option value="45">{t.dur45}</option>
              <option value="60">{t.dur60}</option>
              <option value="90">{t.dur90}</option>
              <option value="120">{t.dur120}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sc-notes">{t.notesLabel}</Label>
            <textarea
              id="sc-notes"
              value={notes}
              onChange={handleSetNotes}
              placeholder={t.notesPlaceholder}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter showCloseButton>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="h-4 w-4" />}
              {t.scheduleButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
