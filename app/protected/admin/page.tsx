import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Analytics } from "./components/analytics/analytics"
import { UserManagement } from "./components/user-management/user-management"

export const metadata = { title: "Admin" }

async function assertAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.claims.sub as string)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  await assertAdmin()

  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.search ?? ""

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and user management.
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <Analytics />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <UserManagement searchQuery={searchQuery} />
      </Suspense>
    </div>
  )
}
