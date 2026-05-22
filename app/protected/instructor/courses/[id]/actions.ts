"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { LessonType } from "@/lib/supabase/types"
import { createNotification } from "@/lib/notifications/create"

// ---- course -----------------------------------------------------------------

export async function deleteCourse(courseId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("instructor_id", data.claims.sub as string)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/protected/instructor/courses")
  return {}
}

export async function updateCourse(
  courseId: string,
  title: string,
  description: string | null,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("courses")
    .update({ title, description })
    .eq("id", courseId)
    .eq("instructor_id", data.claims.sub as string)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

// ---- modules ----------------------------------------------------------------

export async function createModule(
  courseId: string,
  title: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { data: maxRow } = await supabase
    .from("modules")
    .select("order")
    .eq("course_id", courseId)
    .order("order", { ascending: false })
    .limit(1)
    .single()

  const order = maxRow ? maxRow.order + 1 : 1

  const { error } = await supabase
    .from("modules")
    .insert({ course_id: courseId, title, order })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

export async function renameModule(
  courseId: string,
  moduleId: string,
  title: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("modules")
    .update({ title })
    .eq("id", moduleId)
    .eq("course_id", courseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

export async function deleteModule(
  courseId: string,
  moduleId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", moduleId)
    .eq("course_id", courseId)

  if (error) return { error: error.message }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

// ---- lessons ----------------------------------------------------------------

interface LessonData {
  title: string;
  type: LessonType;
  content: string | null;
  video_url: string | null;
  duration_s: number | null;
}

export async function createLesson(
  courseId: string,
  moduleId: string,
  lessonData: LessonData,
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) return { error: "Not authenticated" }

  const { data: maxRow } = await supabase
    .from("lessons")
    .select("order")
    .eq("module_id", moduleId)
    .order("order", { ascending: false })
    .limit(1)
    .single()

  const order = maxRow ? maxRow.order + 1 : 1

  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({ module_id: moduleId, order, ...lessonData })
    .select("id")
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return { id: lesson.id }
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  lessonData: LessonData,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("lessons")
    .update(lessonData)
    .eq("id", lessonId)

  if (error) return { error: error.message }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

export async function deleteLesson(
  courseId: string,
  lessonId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", lessonId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

// ---- students ---------------------------------------------------------------

export async function addStudentToCourse(
  courseId: string,
  email: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { data: studentId, error: lookupError } = await supabase.rpc(
    "get_user_id_by_email",
    { p_email: email },
  )

  if (lookupError) {
    return { error: lookupError.message }
  }

  if (!studentId) {
    return { error: "No account found with that email" }
  }

  const { error: enrollError } = await supabase
    .from("enrollments")
    .insert({ user_id: studentId, course_id: courseId })

  if (enrollError) {
    if (enrollError.code === "23505") {
      return { error: "User is already enrolled" }
    }

    return { error: enrollError.message }
  }

  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single()

  await createNotification({
    userId: studentId as string,
    actorId: data.claims.sub as string,
    type: "course_enrolled",
    metadata: {
      courseId,
      courseTitle: course?.title ?? "",
    },
  })

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}

// ---- student notes ----------------------------------------------------------

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

export async function removeStudentFromCourse(
  courseId: string,
  enrollmentId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", enrollmentId)
    .eq("course_id", courseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`)
  return {}
}
