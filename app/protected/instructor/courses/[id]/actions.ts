"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStudentToCourse(
  courseId: string,
  email: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { error: "Not authenticated" };

  const { data: studentId, error: lookupError } = await supabase.rpc(
    "get_user_id_by_email",
    { p_email: email },
  );

  if (lookupError) return { error: lookupError.message };
  if (!studentId) return { error: "No account found with that email" };

  const { error: enrollError } = await supabase
    .from("enrollments")
    .insert({ user_id: studentId, course_id: courseId });

  if (enrollError) {
    if (enrollError.code === "23505") return { error: "User is already enrolled" };
    return { error: enrollError.message };
  }

  revalidatePath(`/protected/instructor/courses/${courseId}`);
  return {};
}

export async function removeStudentFromCourse(
  courseId: string,
  enrollmentId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", enrollmentId)
    .eq("course_id", courseId);

  if (error) return { error: error.message };

  revalidatePath(`/protected/instructor/courses/${courseId}`);
  return {};
}
