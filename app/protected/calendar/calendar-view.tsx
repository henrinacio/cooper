"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScheduleSessionDialog } from "./schedule-session-dialog"
import { cn, LOCALE_LANGUAGE } from "@/lib/utils"
import type { ScheduledSessionWithDetails, CourseWithStudents } from "@/lib/supabase/types"
import { translations } from "./calendar-view.i18n"
import { useLocale } from "@/components/locale-provider"
import { SessionCard } from "./session-card"

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

interface Props {
  sessions: ScheduledSessionWithDetails[]
  role: string
  courses: CourseWithStudents[]
}

export function CalendarView({ sessions, role, courses }: Props) {
  const [todayString, setTodayString] = useState("")
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const locale = useLocale()
  const t = translations[locale]
  const localeLanguage = LOCALE_LANGUAGE[locale] ?? "en"

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
            {new Date(selectedDate + "T12:00").toLocaleDateString(localeLanguage, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noSessions}</p>
          ) : (
            selectedSessions.map((selectedSession) => (
              <SessionCard
                key={selectedSession.id}
                session={selectedSession}
                isPrivileged={isPrivileged}
              />
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
        />
      )}
    </div>
  )
}
