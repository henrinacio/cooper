"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deactivateUser, reactivateUser } from "../../../../actions"

interface DeactivateButtonProps {
  userId: string
  isBanned: boolean
}

export function DeactivateButton({ userId, isBanned }: DeactivateButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const action = isBanned ? reactivateUser : deactivateUser
      const result = await action(userId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isBanned ? "User reactivated" : "User deactivated")
      }
    })
  }

  return (
    <Button
      variant={isBanned ? "outline" : "destructive"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isBanned ? "Reactivate" : "Deactivate"}
    </Button>
  )
}
