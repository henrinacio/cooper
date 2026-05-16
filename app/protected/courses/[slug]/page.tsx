import { createClient } from "@/lib/supabase/server";
import { CourseWithModules } from "@/lib/supabase/types";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: slug };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub as string;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  // RLS ensures this returns null if the user has no access
  const { data: course } = await supabase
    .from("courses")
    .select(
      "*, modules(id, title, order, lessons(id, title, type, duration_s, order))",
    )
    .eq("slug", slug)
    .order("order", { referencedTable: "modules" })
    .order("order", { referencedTable: "modules.lessons" })
    .single<CourseWithModules>();

  if (!course) notFound();

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );

  const firstLesson = course.modules[0]?.lessons[0];

  const isPrivileged = profile ? ['instructor', 'admin'].includes(profile.role) : false

  return (
    <div className="flex flex-col gap-8">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/protected/dashboard">
          <ArrowLeft size={14} />
          Back
        </Link>
      </Button>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {profile && isPrivileged && (
              <div>
                <Badge variant="outline" className="text-xs">
                  Preview Mode
                </Badge>
              </div>
            )}
          </div>
          {course.description && (
            <p className="text-muted-foreground">{course.description}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {totalLessons} lessons
            </span>
          </div>
        </div>

        {!isPrivileged && firstLesson && (
          <div>
            <Button asChild>
              <Link href={`/protected/learn/${course.slug}/${firstLesson.id}`}>
                Start Learning
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Curriculum</h2>
        {course.modules.map((mod) => (
          <Card key={mod.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {mod.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {mod.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/protected/learn/${course.slug}/${lesson.id}`}
                  className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={13} className="text-muted-foreground" />
                    {lesson.title}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className="text-xs capitalize">
                      {lesson.type}
                    </Badge>
                    {lesson.duration_s && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {Math.ceil(lesson.duration_s / 60)}m
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
