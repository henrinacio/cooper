import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  modules: { lessons: { id: string }[] | null }[] | null;
};

export const metadata = { title: "Dashboard" };

async function CourseList() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub as string;

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id, enrolled_at, courses(id, slug, title, description, modules(lessons(id)))")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  const { data: progressRows } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId);

  const completedIds = new Set(progressRows?.map((p) => p.lesson_id) ?? []);

  if (!enrollments?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <BookOpen size={40} className="text-muted-foreground" />
        <p className="text-muted-foreground">No courses yet.</p>
        <Button asChild>
          <Link href="/protected/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrollments.map((enrollment) => {
        const course = enrollment.courses as unknown as Course | null;
        if (!course) return null;

        const allLessons: string[] = course.modules?.flatMap(
          (m) => m.lessons?.map((l) => l.id) ?? [],
        ) ?? [];
        const completed = allLessons.filter((id) => completedIds.has(id)).length;
        const total = allLessons.length;
        const pct = total ? Math.round((completed / total) * 100) : 0;

        return (
          <Card key={enrollment.course_id} className="flex flex-col">
            {course.thumbnail_url && (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                width={600}
                height={144}
                className="w-full h-36 object-cover rounded-t-xl"
              />
            )}
            <CardHeader className="flex-1">
              <CardTitle className="text-base">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completed}/{total} lessons</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <Button asChild size="sm">
                <Link href={`/protected/courses/${course.slug}`}>
                  {pct === 100 ? "Review Course" : "Continue"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">My Learning</h1>
        <p className="text-muted-foreground mt-1">Your enrolled courses</p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading courses…</div>}>
        <CourseList />
      </Suspense>
    </div>
  );
}
