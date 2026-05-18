"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { removeStudentFromCourse } from "./actions"
import { X } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./remove-student-button.i18n"

interface Props {
  courseId: string;
  enrollmentId: string;
}

export function RemoveStudentButton({ courseId, enrollmentId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const locale = useLocale()
  const t = translations[locale]

  async function remove() {
    setLoading(true)
    await removeStudentFromCourse(courseId, enrollmentId)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive"
      >
        <X size={16} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.confirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {t.no}
            </Button>
            <Button variant="destructive" onClick={remove} disabled={loading}>
              {loading ? "…" : t.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
