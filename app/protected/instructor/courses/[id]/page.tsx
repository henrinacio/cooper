import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { CourseWithModules } from "@/lib/supabase/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Users } from "lucide-react";
import { PublishToggle } from "./publish-toggle";
import { AddStudentForm } from "./add-student-form";
import { RemoveStudentButton } from "./remove-student-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/auth/login");

  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(id, title, order, lessons(id, title, type, order))")
    .eq("id", id)
    .eq("instructor_id", claims.claims.sub as string)
    .order("order", { referencedTable: "modules" })
    .order("order", { referencedTable: "modules.lessons" })
    .single<CourseWithModules>();

  if (!course) notFound();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, user_id, enrolled_at, profiles(id, full_name)")
    .eq("course_id", id)
    .order("enrolled_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/protected/instructor/courses">
            <ArrowLeft size={14} />
            Back
          </Link>
        </Button>
      </div>

      {/* Course header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground mt-1">{course.description}</p>
          )}
        </div>
        <PublishToggle courseId={course.id} published={course.published} />
      </div>

      {/* Curriculum */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Curriculum</h2>
        {!course.modules.length ? (
          <p className="text-muted-foreground text-sm">No modules yet.</p>
        ) : (
          course.modules.map((mod) => (
            <Card key={mod.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  {mod.title}
                  <Badge variant="outline" className="text-xs">
                    {mod.lessons.length} lessons
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-accent"
                  >
                    <BookOpen size={13} className="text-muted-foreground" />
                    <span className="flex-1">{lesson.title}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {lesson.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Students */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users size={18} />
          <h2 className="text-xl font-semibold">
            Students
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({enrollments?.length ?? 0})
            </span>
          </h2>
        </div>

        <AddStudentForm courseId={course.id} />

        {!!enrollments?.length && (
          <div className="flex flex-col gap-1 mt-2">
            {enrollments.map((e) => {
              const profile = e.profiles as any;
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between text-sm px-3 py-2 rounded border"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {profile?.full_name ?? "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                    </span>
                  </div>
                  <RemoveStudentButton
                    courseId={course.id}
                    enrollmentId={e.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
