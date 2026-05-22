"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react"
import { StudentNotesPanel } from "@/app/protected/instructor/courses/[id]/student-notes-panel"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./student-course-card.i18n"
import type { StudentNote } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  duration_s: number | null;
}

interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Session {
  id: string;
  title: string;
  scheduled_at: string;
  duration_min: number;
}

interface Props {
  courseId: string;
  courseTitle: string;
  modules: CourseModule[];
  completedCount: number;
  totalLessons: number;
  studentId: string;
  initialNotes: StudentNote[];
  enrolledAt: string | null;
  lastCompletedAt: string | null;
  sessions: Session[];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return "< 1m"
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours === 0) {
    return `${minutes}m`
  }
  if (minutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${minutes}m`
}

export function StudentCourseCard({
  courseId,
  courseTitle,
  modules,
  completedCount,
  totalLessons,
  studentId,
  initialNotes,
  enrolledAt,
  lastCompletedAt,
  sessions,
}: Props) {
  const locale = useLocale()
  const t = translations[locale]
  const [isProgressExpanded, setIsProgressExpanded] = useState(false)

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const now = Date.now()

  const daysInactive = lastCompletedAt
    ? Math.floor((now - new Date(lastCompletedAt).getTime()) / 86400000)
    : null

  const daysSinceEnrollment = enrolledAt
    ? Math.max(1, (now - new Date(enrolledAt).getTime()) / 86400000)
    : null
  const weeksElapsed = daysSinceEnrollment ? daysSinceEnrollment / 7 : null
  const lessonsPerWeek = weeksElapsed && completedCount > 0
    ? Math.round((completedCount / weeksElapsed) * 10) / 10
    : null

  const stuckModule = completedCount > 0 && completedCount < totalLessons
    ? modules.find((courseModule) => courseModule.lessons.some((lesson) => !lesson.completed))
    : null

  const remainingSeconds = modules
    .flatMap((courseModule) => courseModule.lessons)
    .filter((lesson) => !lesson.completed)
    .reduce((sum, lesson) => sum + (lesson.duration_s ?? 0), 0)

  const upcomingSessions = sessions.filter(
    (session) => new Date(session.scheduled_at).getTime() > now
  )
  const pastSessionsCount = sessions.length - upcomingSessions.length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">{courseTitle}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={percentage === 100 ? "default" : "outline"}>
              {completedCount}/{totalLessons} {t.lessons}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">{percentage}%</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              aria-label={isProgressExpanded ? t.hideProgress : t.showProgress}
              onClick={() => setIsProgressExpanded((previous) => !previous)}
            >
              {isProgressExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
        </div>

        <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex gap-4 mt-2">
          {enrolledAt && (
            <span className="text-xs text-muted-foreground">
              {t.enrolledAt}: {new Date(enrolledAt).toLocaleDateString()}
            </span>
          )}
          {lastCompletedAt && (
            <span className="text-xs text-muted-foreground">
              {t.lastCompleted}: {new Date(lastCompletedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          {daysInactive !== null && (
            <span className={cn(
              "text-xs font-medium",
              daysInactive === 0
                ? "text-green-600 dark:text-green-400"
                : daysInactive > 14
                ? "text-destructive"
                : daysInactive > 7
                ? "text-amber-500"
                : "text-muted-foreground"
            )}>
              {daysInactive === 0 ? t.activeToday : `${daysInactive}${t.daysInactiveSuffix}`}
            </span>
          )}
          {lessonsPerWeek !== null && (
            <span className="text-xs text-muted-foreground">
              ~{lessonsPerWeek} {t.lessonsPerWeek}
            </span>
          )}
          {stuckModule && (
            <span className="text-xs text-muted-foreground">
              {t.stuckOn}: <span className="text-foreground">{stuckModule.title}</span>
            </span>
          )}
        </div>

        {remainingSeconds > 0 && (
          <span className="text-xs text-muted-foreground mt-1">
            {formatDuration(remainingSeconds)} {t.timeRemaining}
          </span>
        )}
      </CardHeader>

      <CardContent className="pt-0 flex flex-col gap-0">
        {isProgressExpanded && (
          <div className="flex flex-col gap-4 pb-4 border-b mb-4">
            {modules.map((courseModule) => (
              <div key={courseModule.id} className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {courseModule.title}
                </p>
                <div className="flex flex-col gap-1">
                  {courseModule.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-2 text-sm">
                      {lesson.completed ? (
                        <CheckCircle2 size={16} className="text-primary shrink-0" />
                      ) : (
                        <Circle size={16} className="text-muted-foreground shrink-0" />
                      )}
                      <span className={lesson.completed ? "" : "text-muted-foreground"}>
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                  {courseModule.lessons.length === 0 && (
                    <p className="text-xs text-muted-foreground">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <StudentNotesPanel
          courseId={courseId}
          studentId={studentId}
          initialNotes={initialNotes}
          hideViewProfile
        />

        {sessions.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {t.sessions}
            </p>
            {upcomingSessions.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t.noUpcomingSessions}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between text-sm">
                    <span>{session.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.scheduled_at).toLocaleDateString()} · {session.duration_min}m
                    </span>
                  </div>
                ))}
              </div>
            )}
            {pastSessionsCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                +{pastSessionsCount} {pastSessionsCount === 1 ? t.pastSession : t.pastSessions}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
