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

interface Lesson {
  id: string;
  title: string;
  order: number;
  completed: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Props {
  courseId: string;
  courseTitle: string;
  modules: CourseModule[];
  completedCount: number;
  totalLessons: number;
  studentId: string;
  initialNotes: StudentNote[];
}

export function StudentCourseCard({
  courseId,
  courseTitle,
  modules,
  completedCount,
  totalLessons,
  studentId,
  initialNotes,
}: Props) {
  const locale = useLocale()
  const t = translations[locale]
  const [isProgressExpanded, setIsProgressExpanded] = useState(false)

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

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
                        <CheckCircle2 size={15} className="text-primary shrink-0" />
                      ) : (
                        <Circle size={15} className="text-muted-foreground shrink-0" />
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
      </CardContent>
    </Card>
  )
}
