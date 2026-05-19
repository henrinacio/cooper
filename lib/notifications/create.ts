import { createClient } from "@/lib/supabase/server"

interface CreateNotificationInput {
  userId: string;
  actorId: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc("create_notification", {
    p_user_id: input.userId,
    p_actor_id: input.actorId,
    p_type: input.type,
    p_metadata: (input.metadata ?? {}) as never,
  })
}
