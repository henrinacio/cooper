"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { confirmSession } from "@/app/protected/calendar/actions"

interface ConfirmButtonProps {
  sessionId: string
  labelConfirm: string
  labelConfirmed: string
}

export function ConfirmButton({ sessionId, labelConfirm, labelConfirmed }: ConfirmButtonProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function handleConfirm() {
    setConfirming(true)
    const result = await confirmSession(sessionId)
    if (!result.error) {
      setConfirmed(true)
    }
    setConfirming(false)
  }

  if (confirmed) {
    return <span className="text-xs text-muted-foreground mt-1">{labelConfirmed}</span>
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="mt-1.5 h-7 text-xs self-start"
      onClick={handleConfirm}
      disabled={confirming}
    >
      {labelConfirm}
    </Button>
  )
}
