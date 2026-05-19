"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteCourse } from "./actions"
import { Trash2 } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./delete-course-button.i18n"
import { toast } from "sonner"

interface Props {
  courseId: string;
}

export function DeleteCourseButton({ courseId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const locale = useLocale()
  const t = translations[locale]

  async function remove() {
    setLoading(true)
    const result = await deleteCourse(courseId)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(t.deletedSuccess)
      router.push("/protected/instructor/courses")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 size={16} />
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
