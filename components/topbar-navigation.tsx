import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

const NAV_LINKS: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: "/protected/student/dashboard", label: "Dashboard" },
  ],
  instructor: [
    { href: "/protected/instructor/courses", label: "Teach" },
  ],
  admin: [
    { href: "/protected/student/dashboard", label: "Dashboard" },
    { href: "/protected/instructor/courses", label: "Teach" },
  ],
};

async function NavigationOptions() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub as string;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  const links = NAV_LINKS[profile.role] ?? [];

  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="font-normal text-foreground/70 hover:text-foreground">
          {link.label}
        </Link>
      ))}
    </>
  );
}

export default function TopbarNavigation() {
  return (
    <nav className="w-full border-b border-b-foreground/10 h-16 flex justify-center">
      <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
        <div className="flex gap-6 items-center font-semibold">
          <Link href="/">Cooper</Link>
          <Suspense>
            <NavigationOptions />
          </Suspense>
        </div>
        <div className="flex items-center gap-4">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  )
}