import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewCourseForm } from "./new-course-form";

export const metadata = { title: "New Course" };

export default async function NewCoursePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.claims.sub as string)
    .single();

  if (!profile || !["instructor", "admin"].includes(profile.role)) {
    redirect("/protected/dashboard");
  }

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">New Course</h1>
        <p className="text-muted-foreground mt-1">Create a new course</p>
      </div>
      <NewCourseForm />
    </div>
  );
}
