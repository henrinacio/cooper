"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

type UserRole = "student" | "instructor" | "admin"

async function assertAdmin(): Promise<{ error: string } | { userId: string }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { error: "Not authenticated" }
  }

  const userId = data.claims.sub as string

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (!profile || profile.role !== "admin") {
    return { error: "Not authorized" }
  }

  return { userId }
}

export async function updateUserRole(
  targetUserId: string,
  role: UserRole,
): Promise<{ error?: string }> {
  const authResult = await assertAdmin()

  if ("error" in authResult) {
    return { error: authResult.error }
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", targetUserId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/protected/admin/users")
  return {}
}


export async function deactivateUser(
  targetUserId: string,
): Promise<{ error?: string }> {
  const authResult = await assertAdmin()

  if ("error" in authResult) {
    return { error: authResult.error }
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    ban_duration: "876000h",
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/protected/admin/users")
  return {}
}

export async function reactivateUser(
  targetUserId: string,
): Promise<{ error?: string }> {
  const authResult = await assertAdmin()

  if ("error" in authResult) {
    return { error: authResult.error }
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    ban_duration: "none",
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/protected/admin/users")
  return {}
}
