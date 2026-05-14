import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10 h-16 flex justify-center">
        <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
          <div className="flex gap-6 items-center font-semibold">
            <Link href="/">Cooper</Link>
            <Link href="/courses" className="font-normal text-foreground/70 hover:text-foreground">
              Courses
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl p-5">{children}</div>
      </div>
      <footer className="w-full border-t flex items-center justify-center gap-8 py-8 text-xs text-muted-foreground">
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
