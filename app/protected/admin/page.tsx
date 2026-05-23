import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Analytics } from "./components/analytics/analytics"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Users } from "lucide-react"

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

export default async function AdminPage() {
  await assertAdmin()

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

      <div>
        <h2 className="text-xl font-semibold mb-3">Management</h2>
        <Link href="/protected/admin/users">
          <Card className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            <Users size={24} className="text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium">Users</p>
              <p className="text-sm text-muted-foreground">Manage roles and access</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
