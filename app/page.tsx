import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { BookOpen, BarChart2, Award } from "lucide-react";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (data) {
    const userId = data?.claims.sub as string;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profile && ["instructor", "admin"].includes(profile.role)) {
      redirect("/protected/instructor/courses")
    }

    if (profile && profile.role === 'student') {
      redirect("/protected/dashboard")
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
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
          Learn anything.{" "}
          <span className="text-primary">At your own pace.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Cooper is a private learning platform. Instructors curate courses and
          invite students — so every learner gets a focused, distraction-free
          experience.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/auth/login">Get started</Link>
          </Button>
        </div>
      </section>

      <section className="flex justify-center px-5 pb-24">
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <BookOpen size={20} />,
              title: "Structured curriculum",
              body: "Courses are organized into modules and lessons so you always know what comes next.",
            },
            {
              icon: <BarChart2 size={20} />,
              title: "Progress tracking",
              body: "Mark lessons complete and see exactly how far you've come in each course.",
            },
            {
              icon: <Award size={20} />,
              title: "Invite-only access",
              body: "Instructors hand-pick their students, keeping every cohort focused and high quality.",
            },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-xl border p-6"
            >
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
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
