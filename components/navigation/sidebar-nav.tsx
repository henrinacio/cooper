"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getNavItems } from "@/components/navigation/nav-items"

export default function SidebarNav({ role }: { role: string | null }) {
  const pathname = usePathname()
  const NAV_ITEMS = getNavItems(role)

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 border-r border-border bg-background z-40 px-3 py-6 gap-1">
      <div className="px-3 mb-6 font-semibold text-lg tracking-tight">
        Cooper
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
