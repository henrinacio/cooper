"use server"

import { createClient } from "@/lib/supabase/server"
import { createNotification } from "@/lib/notifications/create"
import { revalidatePath } from "next/cache"

export async function markLessonComplete(
  lessonId: string,
  courseId: string,
  instructorId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const userId = data.claims.sub as string

  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: userId, lesson_id: lessonId })

  if (error) {
    return { error: error.message }
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId)

  const moduleIds = modules?.map((m) => m.id) ?? []

  if (moduleIds.length > 0) {
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("id")
      .in("module_id", moduleIds)

    const totalCount = allLessons?.length ?? 0

    if (totalCount > 0) {
      const lessonIds = allLessons!.map((l) => l.id)

      const { count: completedCount } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("lesson_id", lessonIds)

      if (completedCount === totalCount) {
        const { data: course } = await supabase
          .from("courses")
          .select("title")
          .eq("id", courseId)
          .single()

        await createNotification({
          userId: instructorId,
          actorId: userId,
          type: "course_completed",
          metadata: {
            courseId,
            courseTitle: course?.title ?? "",
            studentId: userId,
          },
        })
      }
    }
  }

  revalidatePath("/protected/learn")
  return {}
}

export async function markLessonIncomplete(
  lessonId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const userId = data.claims.sub as string

  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/protected/learn")
  return {}
}
