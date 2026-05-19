"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addStudentToCourse } from "./actions"
import { UserPlus } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./add-student-form.i18n"
import { toast } from "sonner"

export function AddStudentForm({ courseId }: { courseId: string }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const locale = useLocale()
  const t = translations[locale]

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await addStudentToCourse(courseId, email.trim())

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`${email} ${t.enrolledSuccess}`)
      setEmail("")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Label htmlFor="student-email">{t.label}</Label>
      <div className="flex gap-2">
        <Input
          id="student-email"
          type="email"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-w-sm"
        />
        <Button type="submit" disabled={loading} size="sm">
          <UserPlus size={16} />
          {loading ? t.adding : t.add}
        </Button>
      </div>
    </form>
  )
}
