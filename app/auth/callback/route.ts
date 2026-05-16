import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (["instructor", "admin"].includes(profile?.role)) {
        redirect("/protected/instructor/courses")
      }

      redirect("/protected/dashboard")
    }

    redirect(`/auth/error?error=${error.message}`)
  }

  redirect(`/auth/error?error=No code provided`)
}
