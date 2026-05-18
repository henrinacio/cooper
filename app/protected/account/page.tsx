import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Suspense } from "react"
import { LogoutButton } from "@/components/logout-button"
import { Spinner } from "@/components/ui/spinner"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

async function AccountDetails() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    redirect("/auth/login")
  }

  const name = data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? "—"
  const joinedDate = new Date(data.user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Row label="Name" value={name} />
        <Row label="Email" value={data.user.email ?? "—"} />
        <Row label="Joined" value={joinedDate} />
      </CardContent>
    </Card>
  )
}

export default function AccountPage() {
  return (
    <div className="max-w-xl flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Account</h1>

      <Suspense fallback={<Spinner />}>
        <AccountDetails />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>

      <LogoutButton />
    </div>
  )
}

