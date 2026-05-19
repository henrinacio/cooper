"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createNotification } from "@/lib/notifications/create"

interface ScheduleSessionInput {
  courseId: string
  studentId: string
  title: string
  scheduledAt: string
  durationMin: number
  notes: string | null
}

export async function scheduleSession(input: ScheduleSessionInput): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("scheduled_sessions")
    .insert({
      course_id: input.courseId,
      instructor_id: data.claims.sub as string,
      student_id: input.studentId,
      title: input.title,
      scheduled_at: input.scheduledAt,
      duration_min: input.durationMin,
      notes: input.notes,
    })

  if (error) {
    return { error: error.message }
  }

  await createNotification({
    userId: input.studentId,
    actorId: data.claims.sub as string,
    type: "class_scheduled",
    metadata: {
      sessionTitle: input.title,
      courseId: input.courseId,
      scheduledAt: input.scheduledAt,
      durationMin: input.durationMin,
    },
  })

  revalidatePath("/protected/calendar")
  return {}
}

export async function deleteSession(sessionId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("scheduled_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("instructor_id", data.claims.sub as string)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/protected/calendar")
  return {}
}
