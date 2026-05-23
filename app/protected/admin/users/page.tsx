import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { UserManagement } from "./components/user-management/user-management"
import { BackButton } from "@/components/back-button"

export const metadata = { title: "User Management | Admin" }

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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  await assertAdmin()

  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.search ?? ""
  const pageParam = resolvedSearchParams.page ?? "1"
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1)

  return (
    <div className="flex flex-col gap-8">
      <BackButton href={'/protected/admin'} />

      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage roles and access for all users.
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <UserManagement searchQuery={searchQuery} page={currentPage} />
      </Suspense>
    </div>
  )
}
