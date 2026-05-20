import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import BottomNav from "@/components/navigation/bottom-nav"
import SidebarNav from "@/components/navigation/sidebar-nav"
import { getUnreadCount } from "@/lib/notifications/actions"

async function DefaultLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  let role: string | null = null

  const { data } = await supabase.auth.getClaims()
  if (data?.claims?.sub) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.claims.sub)
      .single()
    role = profile?.role ?? null
  }

  const unreadCount = await getUnreadCount()

  return (
    <>
      <SidebarNav role={role} unreadCount={unreadCount} />
        <div className="flex-1 min-w-0 flex flex-col md:ml-56">
          <div className="flex-1 p-5 pb-20 md:pb-5">
            <div className="max-w-4xl w-full">
              {children}
            </div>
          </div>
        </div>
      <BottomNav role={role} unreadCount={unreadCount} />
    </>
  )
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {


  return (
    <main className="min-h-screen flex">
      <Suspense>
        <DefaultLayout>{children}</DefaultLayout>
      </Suspense>
    </main>
  )
}
