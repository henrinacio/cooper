"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { notifications: [], error: "Not authenticated" }
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*, actor:actor_id(full_name, avatar_url)")
    .eq("user_id", data.claims.sub as string)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    return { notifications: [], error: error.message }
  }

  return { notifications: notifications ?? [] }
}

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return 0
  }

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", data.claims.sub as string)
    .eq("read", false)

  return count ?? 0
}

export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
  revalidatePath("/protected/notifications")
}

export async function markAllAsRead(): Promise<void> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return
  }

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", data.claims.sub as string)
    .eq("read", false)

  revalidatePath("/protected/notifications")
}

export async function deleteAllNotifications(): Promise<void> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return
  }

  await supabase
    .from("notifications")
    .delete()
    .eq("user_id", data.claims.sub as string)

  revalidatePath("/protected/notifications")
}
