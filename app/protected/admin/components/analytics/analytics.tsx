import { createAdminClient } from "@/lib/supabase/admin"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Activity, BarChart2 } from "lucide-react"

export async function Analytics() {
  const adminClient = createAdminClient()

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    totalUsersResult,
    totalEnrollmentsResult,
    publishedCoursesResult,
    recentProgressResult,
    allCoursesResult,
  ] = await Promise.all([
    adminClient.from("profiles").select("*", { count: "exact", head: true }),
    adminClient.from("enrollments").select("*", { count: "exact", head: true }),
    adminClient.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    adminClient.from("progress").select("user_id").gte("completed_at", thirtyDaysAgo),
    adminClient.from("courses").select("id, title, published, enrollments(count)"),
  ])

  const activeUsers = new Set(
    recentProgressResult.data?.map((progressRow) => progressRow.user_id) ?? [],
  ).size

  const popularCourses = [...(allCoursesResult.data ?? [])]
    .map((course) => ({
      ...course,
      enrollmentCount:
        (course.enrollments as unknown as { count: number }[])?.[0]?.count ?? 0,
    }))
    .sort((courseA, courseB) => courseB.enrollmentCount - courseA.enrollmentCount)
    .slice(0, 5)

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsersResult.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollments
            </CardTitle>
            <BookOpen size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalEnrollmentsResult.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users (30d)
            </CardTitle>
            <Activity size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Courses
            </CardTitle>
            <BarChart2 size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{publishedCoursesResult.count ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Popular Courses</h2>
        <div className="flex flex-col gap-2">
          {popularCourses.length === 0 && (
            <p className="text-muted-foreground text-sm">No courses yet.</p>
          )}
          {popularCourses.map((course, index) => (
            <Card
              key={course.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-5 shrink-0">
                  {index + 1}
                </span>
                <p className="font-medium">{course.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={course.published ? "default" : "secondary"}>
                  {course.published ? "Published" : "Draft"}
                </Badge>
                <span className="text-sm text-muted-foreground shrink-0">
                  {course.enrollmentCount} enrollments
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
