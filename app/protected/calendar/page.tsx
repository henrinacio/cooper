import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CalendarView } from "./calendar-view"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import type { ScheduledSessionWithDetails, CourseWithStudents } from "@/lib/supabase/types"

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/auth/login")
  }

  const userId = data.claims.sub as string

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  const role = profile?.role ?? "student"

  const { data: sessions } = await supabase
    .from("scheduled_sessions")
    .select(
      "id, title, scheduled_at, duration_min, notes, confirmed, course_id, student_id, instructor_id, courses(title), student:profiles!student_id(full_name), instructor:profiles!instructor_id(full_name)"
    )
    .order("scheduled_at")

  let courses: CourseWithStudents[] = []
  if (role === "instructor" || role === "admin") {
    const { data: instructorCourses } = await supabase
      .from("courses")
      .select("id, title, enrollments(user_id, profiles(id, full_name))")
      .eq("instructor_id", userId)
      .order("title")
    courses = (instructorCourses as unknown as CourseWithStudents[]) ?? []
  }

  const locale = await getLocale()
  const t = translations[locale]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <CalendarView
        sessions={(sessions as unknown as ScheduledSessionWithDetails[]) ?? []}
        role={role}
        courses={courses}
      />
    </div>
  )
}
