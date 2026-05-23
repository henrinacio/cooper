"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { updateUserRole } from "../../actions"

type UserRole = "student" | "instructor" | "admin"

interface UserRoleSelectProps {
  userId: string
  currentRole: UserRole
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState<UserRole>(currentRole)
  const [isPending, startTransition] = useTransition()

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = event.target.value as UserRole
    const previousRole = role
    setRole(newRole)

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)

      if (result.error) {
        toast.error(result.error)
        setRole(previousRole)
      } else {
        toast.success("Role updated")
      }
    })
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={isPending}
      className="text-sm border border-border rounded px-2 py-1 bg-background disabled:opacity-50"
    >
      <option value="student">Student</option>
      <option value="instructor">Instructor</option>
      <option value="admin">Admin</option>
    </select>
  )
}
