import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Suspense } from "react"

export const metadata = { title: "My Courses" }

async function CourseList() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  const userId = data.claims.sub as string

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (!profile || !["instructor", "admin"].includes(profile.role)) {
    redirect("/protected/dashboard")
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("*, enrollments(count)")
    .eq("instructor_id", userId)
    .order("created_at", { ascending: false })

  if (!courses?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No courses yet.{" "}
        <Link href="/protected/instructor/courses/new" className="underline">
          Create your first course
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {courses.map((course) => {
        return (
          <Card key={course.id} className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{course.title}</span>
                <Badge variant={course.published ? "default" : "secondary"}>
                  {course.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/protected/courses/${course.slug}`}>Preview</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/protected/instructor/courses/${course.id}`}>
                  Edit
                </Link>
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default async function InstructorCoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your courses</p>
        </div>
        <Button asChild>
          <Link href="/protected/instructor/courses/new">
            <Plus size={16} />
            New Course
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading courses…</div>}>
        <CourseList />
      </Suspense>
    </div>
  )
}
