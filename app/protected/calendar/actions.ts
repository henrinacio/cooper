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

  const { data: sessionData, error } = await supabase
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
    .select("id")
    .single()

  if (error) {
    return { error: error.message }
  }

  await createNotification({
    userId: input.studentId,
    actorId: data.claims.sub as string,
    type: "class_scheduled",
    metadata: {
      sessionId: sessionData.id,
      sessionTitle: input.title,
      courseId: input.courseId,
      scheduledAt: input.scheduledAt,
      durationMin: input.durationMin,
    },
  })

  revalidatePath("/protected/calendar")
  return {}
}

export async function confirmSession(sessionId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const studentId = data.claims.sub as string

  const { data: session, error: fetchError } = await supabase
    .from("scheduled_sessions")
    .select("instructor_id, title, scheduled_at, course_id")
    .eq("id", sessionId)
    .eq("student_id", studentId)
    .single()

  if (fetchError || !session) {
    return { error: "Session not found" }
  }

  const { error: updateError } = await supabase
    .from("scheduled_sessions")
    .update({ confirmed: true })
    .eq("id", sessionId)
    .eq("student_id", studentId)

  if (updateError) {
    return { error: updateError.message }
  }

  const { data: existingNotification } = await supabase
    .from("notifications")
    .select("id, metadata")
    .eq("user_id", studentId)
    .filter("metadata", "@>", JSON.stringify({ sessionId }))
    .maybeSingle()

  if (existingNotification) {
    const mergedMetadata = {
      ...(existingNotification.metadata as Record<string, unknown>),
      confirmed: true,
    }
    await supabase
      .from("notifications")
      .update({ metadata: mergedMetadata as never })
      .eq("id", existingNotification.id)
  }

  await createNotification({
    userId: session.instructor_id,
    actorId: studentId,
    type: "class_confirmed",
    metadata: {
      sessionId,
      sessionTitle: session.title,
      courseId: session.course_id,
      scheduledAt: session.scheduled_at,
    },
  })

  revalidatePath("/protected/notifications")
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
