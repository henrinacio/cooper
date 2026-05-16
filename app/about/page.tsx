import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { BackButton } from "@/components/back-button";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { version } from "@/package.json";

export default function AboutPage() {
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
        <h1 className="text-5xl font-bold tracking-tight">Cooper</h1>
        <p className="text-muted-foreground text-sm">Version {version}</p>
        <BackButton />
      </section>

      <section className="flex justify-center px-5 pb-24">
        <div className="w-full max-w-md rounded-xl border p-8 flex flex-col gap-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Developer
          </p>
          <p className="text-xl font-semibold">Henrique de Godoy Inácio</p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Supabase, and Tailwind CSS.
          </p>
        </div>
      </section>

      <footer className="mt-auto w-full border-t flex items-center justify-center gap-8 py-8 text-xs text-muted-foreground">
        <span>© 2026 Cooper</span>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
