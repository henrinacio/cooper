import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LessonForm } from "../lesson-form";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ moduleId?: string }>;
}

export default async function NewLessonPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { moduleId } = await searchParams;

  if (!moduleId) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/auth/login");

  const { data: module } = await supabase
    .from("modules")
    .select("id, title, course_id")
    .eq("id", moduleId)
    .eq("course_id", id)
    .single();

  if (!module) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/protected/instructor/courses/${id}`}>
            <ArrowLeft size={14} />
            Back to course
          </Link>
        </Button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Module: {module.title}</p>
        <h1 className="text-2xl font-bold">New Lesson</h1>
      </div>

      <LessonForm courseId={id} moduleId={moduleId} />
    </div>
  );
}
