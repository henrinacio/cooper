"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addStudentToCourse } from "./actions"
import { UserPlus } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./add-student-form.i18n"

export function AddStudentForm({ courseId }: { courseId: string }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const locale = useLocale()
  const t = translations[locale]

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const result = await addStudentToCourse(courseId, email.trim())

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(`${email} ${t.enrolledSuccess}`)
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
    </form>
  )
}
