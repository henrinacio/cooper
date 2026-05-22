import Link from "next/link"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart2, Award } from "lucide-react"
import { Suspense } from "react"
import { AuthButton } from "@/components/auth-button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

async function AuthRedirect() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (data) {
    const userId = data.claims.sub as string
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    const roleRedirectMap: Record<string, string> = {
      instructor: "/protected/instructor/courses",
      student: "/protected/dashboard",
      admin: "/protected/admin",
    }

    if (profile) {
      const redirectPath = roleRedirectMap[profile.role]

      if (redirectPath) {
        redirect(redirectPath)
      }
    }
  }

  return null
}

export default async function Home() {
  const locale = await getLocale()
  const t = translations[locale]

  const features = [
    { icon: <BookOpen size={20} />, title: t.curriculumTitle, body: t.curriculumBody },
    { icon: <BarChart2 size={20} />, title: t.progressTitle, body: t.progressBody },
    { icon: <Award size={20} />, title: t.accessTitle, body: t.accessBody },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Suspense>
        <AuthRedirect />
      </Suspense>
      <nav className="w-full border-b border-b-foreground/10 h-16 flex justify-center">
        <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
          <div className="flex gap-6 items-center font-semibold">
            <Link href="/">Cooper</Link>
          </div>
          <div className="flex items-center gap-4">
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center text-center gap-6 px-5 py-24">
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          {t.headline}{" "}
          <span className="text-primary">{t.headlineHighlight}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">{t.description}</p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/auth/login">{t.getStarted}</Link>
          </Button>
        </div>
      </section>

      <section className="flex justify-center px-5 pb-24">
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map(({ icon, title, body }) => (
            <div key={title} className="flex flex-col gap-3 rounded-xl border p-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto w-full border-t flex items-center justify-center gap-8 py-8 text-xs text-muted-foreground">
        <span>© 2026 Cooper</span>
        <Link href="/about" className="hover:underline">{t.about}</Link>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </footer>
    </main>
  )
}
