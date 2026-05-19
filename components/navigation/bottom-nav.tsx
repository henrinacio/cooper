"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getNavItems } from "@/components/navigation/nav-items"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./nav-items.i18n"

export default function BottomNav({ role, unreadCount = 0 }: { role: string | null; unreadCount?: number }) {
  const pathname = usePathname()
  const locale = useLocale()
  const NAV_ITEMS = getNavItems(role, translations[locale])

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-background">
      <div className="flex h-full items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon, showBadge }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          const badgeCount = showBadge ? unreadCount : 0
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={active ? 2.5 : 1.75} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground rounded-full px-1 min-w-[1rem] text-center leading-tight">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
