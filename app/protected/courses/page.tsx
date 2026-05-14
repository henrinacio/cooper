import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CourseWithInstructor } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "My Courses" };

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("*, profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .returns<CourseWithInstructor[]>();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-1">Courses you have access to</p>
      </div>

      {!courses?.length ? (
        <p className="text-muted-foreground">
          No courses yet. Ask your instructor to add you to a course.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/protected/courses/${course.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                {course.thumbnail_url && (
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">
                    {course.profiles.full_name ?? "Instructor"}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
