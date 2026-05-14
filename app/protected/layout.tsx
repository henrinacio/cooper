
import { ThemeSwitcher } from "@/components/theme-switcher"
import TopbarNavigation from "@/components/topbar-navigation"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <TopbarNavigation />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl p-5">
          {children}
        </div>
      </div>
      <footer className="w-full border-t flex items-center justify-center gap-8 py-8 text-xs text-muted-foreground">
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
