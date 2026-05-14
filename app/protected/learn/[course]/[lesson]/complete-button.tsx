"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Undo2 } from "lucide-react";

interface Props {
  lessonId: string;
  userId: string;
  nextLessonId?: string;
  courseSlug: string;
  completed: boolean;
}

export function CompleteButton({ lessonId, userId, nextLessonId, courseSlug, completed }: Props) {
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function markComplete() {
    if (done) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("progress").upsert({ user_id: userId, lesson_id: lessonId });
    setDone(true);
    setLoading(false);
    router.refresh();
  }

  async function markIncomplete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("progress").delete().eq("user_id", userId).eq("lesson_id", lessonId);
    setDone(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={markComplete}
        disabled={done || loading}
        variant={done ? "secondary" : "default"}
        className="flex items-center gap-2"
      >
        <CheckCircle size={16} />
        {done ? "Completed" : loading ? "Saving…" : "Mark Complete"}
      </Button>
      {done && (
        <Button
          variant="ghost"
          size="sm"
          onClick={markIncomplete}
          disabled={loading}
          className="flex items-center gap-1 text-muted-foreground"
        >
          <Undo2 size={14} />
          Undo
        </Button>
      )}
      {nextLessonId && (
        <Button
          variant="outline"
          onClick={() => router.push(`/protected/learn/${courseSlug}/${nextLessonId}`)}
        >
          Next Lesson
        </Button>
      )}
    </div>
  );
}
