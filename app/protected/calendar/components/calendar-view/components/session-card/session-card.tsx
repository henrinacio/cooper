"use client"

import { useState } from "react"
import { Clock, BookOpen, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { deleteSession, confirmSession } from "../../../../actions"
import { cn, LOCALE_LANGUAGE } from "@/lib/utils"
import { toast } from "sonner"
import type { ScheduledSessionWithDetails } from "@/lib/supabase/types"
import { translations } from "./session-card.i18n"
import { useLocale } from "@/components/locale-provider"

interface Props {
  session: ScheduledSessionWithDetails
  isIstructor: boolean
}

export function SessionCard({ session, isIstructor }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(session.confirmed)
  const [confirming, setConfirming] = useState(false)

  const locale = useLocale()
  const t = translations[locale]
  const localeLanguage = LOCALE_LANGUAGE[locale] ?? "en"

  const time = new Date(session.scheduled_at).toLocaleTimeString(localeLanguage, {
    hour: "2-digit",
    minute: "2-digit",
  })

  const otherPerson = isIstructor
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
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {isIstructor ? t.studentLabel : t.instructorLabel}: {otherPerson}
            {isIstructor && (
              <a
                href={`/protected/instructor/students/${session.student_id}`}
                className={cn("inline-flex items-center text-muted-foreground hover:text-foreground transition-colors")}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </span>
        )}
        {session.notes && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{session.notes}</p>
        )}
        {!isIstructor && (
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
      {isIstructor && (
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
                  {deleting ? <Spinner /> : t.deleteConfirm}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
