"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createStudentNote(
  courseId: string,
  studentId: string,
  content: string,
  tags: string[],
  pinned: boolean,
  sessionId?: string | null,
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const instructorId = data.claims.sub as string

  const { data: note, error } = await supabase
    .from("student_notes")
    .insert({
      instructor_id: instructorId,
      student_id: studentId,
      course_id: courseId,
      content,
      tags,
      pinned,
      session_id: sessionId ?? null,
    })
    .select("id")
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  revalidatePath(`/protected/instructor/students/${studentId}`)
  return { id: note.id }
}

export async function updateStudentNote(
  courseId: string,
  noteId: string,
  studentId: string,
  content: string,
  tags: string[],
  pinned: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const instructorId = data.claims.sub as string

  const { error } = await supabase
    .from("student_notes")
    .update({ content, tags, pinned })
    .eq("id", noteId)
    .eq("instructor_id", instructorId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  revalidatePath(`/protected/instructor/students/${studentId}`)
  return {}
}

export async function deleteStudentNote(
  courseId: string,
  noteId: string,
  studentId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("student_notes")
    .delete()
    .eq("id", noteId)
    .eq("instructor_id", data.claims.sub as string)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  revalidatePath(`/protected/instructor/students/${studentId}`)
  return {}
}

export async function getStudentNoteHistory(
  noteId: string,
): Promise<{ history?: { id: string; content: string; edited_at: string }[]; error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { data: history, error } = await supabase
    .from("student_note_history")
    .select("id, content, edited_at")
    .eq("note_id", noteId)
    .order("edited_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { history: history ?? [] }
}
