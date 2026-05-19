"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, BookOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScheduleSessionDialog } from "./schedule-session-dialog"
import { deleteSession, confirmSession } from "./actions"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ScheduledSessionWithDetails, CourseWithStudents } from "@/lib/supabase/types"
import type { translations as pageTranslations } from "./page.i18n"
import type { translations as dialogTranslations } from "./schedule-session-dialog.i18n"

type CalendarTranslations = (typeof pageTranslations)[keyof typeof pageTranslations]
type DialogTranslations = (typeof dialogTranslations)[keyof typeof dialogTranslations]

function toLocalDateStr(isoString: string): string {
  const date = new Date(isoString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function buildDays(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: Array<{ day: number; dateString: string } | null> = []
  for (let i = 0; i < firstWeekday; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      dateString: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    })
  }
  return days
}

interface SessionCardProps {
  session: ScheduledSessionWithDetails
  isPrivileged: boolean
  t: CalendarTranslations
}

function SessionCard({ session, isPrivileged, t }: SessionCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(session.confirmed)
  const [confirming, setConfirming] = useState(false)

  const time = new Date(session.scheduled_at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })

  const otherPerson = isPrivileged
    ? session.student?.full_name
    : session.instructor?.full_name

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteSession(session.id)
    if (result.error) {
      toast.error(t.deleteError)
      setDeleting(false)
      setDeleteDialogOpen(false)
    } else {
      toast.success(t.deleteSuccess)
    }
  }

  async function handleConfirm() {
    setConfirming(true)
    const result = await confirmSession(session.id)
    if (!result.error) {
      setConfirmed(true)
    }
    setConfirming(false)
  }

  return (
    <div className="flex items-start justify-between border rounded-lg p-3 gap-3">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="font-medium text-sm truncate">{session.title}</span>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1" suppressHydrationWarning>
            <Clock size={16} />
            {time} · {session.duration_min}min
          </span>
          {session.courses && (
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              {session.courses.title}
            </span>
          )}
        </div>
        {otherPerson && (
          <span className="text-xs text-muted-foreground">
            {isPrivileged ? t.studentLabel : t.instructorLabel}: {otherPerson}
          </span>
        )}
        {session.notes && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{session.notes}</p>
        )}
        {!isPrivileged && (
          confirmed ? (
            <span className="text-xs text-muted-foreground mt-1">{t.confirmed}</span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="mt-1.5 h-7 text-xs self-start"
              onClick={handleConfirm}
              disabled={confirming}
            >
              {t.confirmClass}
            </Button>
          )
        )}
      </div>
      {isPrivileged && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleting}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.deleteConfirmTitle}</DialogTitle>
                <DialogDescription>{t.deleteConfirmDescription}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                  {t.deleteCancel}
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "…" : t.deleteConfirm}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

interface Props {
  sessions: ScheduledSessionWithDetails[]
  role: string
  courses: CourseWithStudents[]
  t: CalendarTranslations
  dialogT: DialogTranslations
}

export function CalendarView({ sessions, role, courses, t, dialogT }: Props) {
  const [todayString, setTodayString] = useState("")
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const today = new Date()
    const ts = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    setTodayString(ts)
    setSelectedDate(ts)
  }, [])

  const days = buildDays(year, month)

  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"] as const
  const weekDays = ["sun","mon","tue","wed","thu","fri","sat"] as const

  const sessionsByDate = sessions.reduce<Record<string, ScheduledSessionWithDetails[]>>(
    (acc, session) => {
      const dateString = toLocalDateStr(session.scheduled_at)

      if (!acc[dateString]) {
        acc[dateString] = []
      }

      acc[dateString].push(session)
      return acc
    },
    {}
  )

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((year) => year - 1)
    } else {
      setMonth((month) => month - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((year) => year + 1)
    } else {
      setMonth((month) => month + 1)
    }
  }

  const selectedSessions = selectedDate ? (sessionsByDate[selectedDate] ?? []) : []
  const isPrivileged = role === "instructor" || role === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </Button>
          <span className="font-semibold w-44 text-center text-sm">
            {t[months[month]]} {year}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={nextMonth}>
            <ChevronRight size={16} />
          </Button>
        </div>
        {isPrivileged && courses.length > 0 && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus size={16} />
            {t.scheduleClass}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((weekDay) => (
          <div key={weekDay} className="text-center text-xs font-medium text-muted-foreground py-1">
            {t[weekDay]}
          </div>
        ))}

        {days.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} />
          }

          const hasSessions = !!sessionsByDate[cell.dateString]?.length
          const isToday = cell.dateString === todayString
          const isSelected = cell.dateString === selectedDate

          return (
            <button
              key={cell.dateString}
              onClick={() => setSelectedDate(cell.dateString)}
              className={cn(
                "relative flex flex-col items-center justify-start pt-1.5 h-11 rounded-lg text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                isToday && !isSelected ? "font-bold ring-1 ring-primary/40" : ""
              )}
            >
              <span className="text-sm leading-none">{cell.day}</span>
              {hasSessions && (
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide" suppressHydrationWarning>
            {new Date(selectedDate + "T12:00").toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noSessions}</p>
          ) : (
            selectedSessions.map((selectedSession) => (
              <SessionCard key={selectedSession.id} session={selectedSession} isPrivileged={isPrivileged} t={t} />
            ))
          )}
        </div>
      )}

      {isPrivileged && (
        <ScheduleSessionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          courses={courses}
          defaultDate={selectedDate ?? undefined}
          t={dialogT}
        />
      )}
    </div>
  )
}
