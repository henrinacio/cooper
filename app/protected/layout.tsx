import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import BottomNav from "@/components/navigation/bottom-nav"
import SidebarNav from "@/components/navigation/sidebar-nav"

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

  return (
    <>
      <SidebarNav role={role} />
        <div className="flex-1 flex flex-col md:ml-56">
          <div className="flex-1 p-5 pb-20 md:pb-5">
            {children}
          </div>
        </div>
      <BottomNav role={role} />
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
