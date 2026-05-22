import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import { BackButton } from "@/components/back-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StickyNote, Pin, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StudentNote } from "@/lib/supabase/types"

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function StudentProfilePage({ params }: Props) {
  const { studentId } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const instructorId = data.claims.sub as string

  const { data: student } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at")
    .eq("id", studentId)
    .single()

  if (!student) {
    notFound()
  }

  const { data: notes } = await supabase
    .from("student_notes")
    .select("*, courses(id, title)")
    .eq("student_id", studentId)
    .eq("instructor_id", instructorId)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const noteList = (notes ?? []) as (StudentNote & { courses: { id: string; title: string } | null })[]

  const notesByCourseId = noteList.reduce<Record<string, { courseTitle: string; notes: typeof noteList }>>(
    (accumulator, note) => {
      const courseId = note.course_id
      if (!accumulator[courseId]) {
        accumulator[courseId] = {
          courseTitle: note.courses?.title ?? courseId,
          notes: [],
        }
      }
      accumulator[courseId].notes.push(note)
      return accumulator
    },
    {}
  )

  const courseGroups = Object.entries(notesByCourseId)

  const locale = await getLocale()
  const t = translations[locale]

  const totalNoteCount = noteList.length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <BackButton href="/protected/instructor/courses" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted shrink-0">
          {student.avatar_url ? (
            <img
              width={16}
              height={16}
              src={student.avatar_url}
              alt={student.full_name ?? ""}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <User size={32} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold">{student.full_name ?? "—"}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StickyNote size={16} />
            <span>{totalNoteCount} {t.noteCount}{totalNoteCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {courseGroups.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t.noNotes}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {courseGroups.map(([courseId, group]) => (
            <Card key={courseId}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span>{group.courseTitle}</span>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {group.notes.length} {t.noteCount}{group.notes.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {group.notes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      "flex flex-col gap-2 p-3 rounded-lg border text-sm",
                      note.pinned && "border-primary/40 bg-primary/5"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{note.content}</p>

                    <div className="flex flex-wrap items-center gap-1">
                      {note.pinned && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 gap-0.5 border-primary/50 text-primary">
                          <Pin size={8} />
                          {t.pinnedLabel}
                        </Badge>
                      )}
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-muted-foreground text-[10px] ml-auto">
                        {t.editedAt} {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
