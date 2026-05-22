import { Home, User, CalendarDays, Bell, ShieldCheck, LucideIcon } from "lucide-react"

type NavLabels = {
  home: string;
  account: string;
  calendar: string;
  notifications: string;
  admin: string;
}

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
}

type Role = "admin" | "instructor" | "student"

const DEFAULT_LABELS: NavLabels = {
  home: "Home",
  account: "My Account",
  calendar: "Calendar",
  notifications: "Notifications",
  admin: "Admin",
}

const ITEMS_BY_ROLE: Record<Role, (labels: NavLabels) => NavItem[]> = {
  admin: (labels) => [
    { href: "/protected/admin",   label: labels.admin,   icon: ShieldCheck },
    { href: "/protected/account", label: labels.account, icon: User        },
  ],
  instructor: (labels) => [
    { href: "/protected/instructor/courses", label: labels.home,          icon: Home         },
    { href: "/protected/calendar",           label: labels.calendar,      icon: CalendarDays },
    { href: "/protected/notifications",      label: labels.notifications, icon: Bell         },
    { href: "/protected/account",            label: labels.account,       icon: User         },
  ],
  student: (labels) => [
    { href: "/protected/dashboard",     label: labels.home,          icon: Home         },
    { href: "/protected/calendar",      label: labels.calendar,      icon: CalendarDays },
    { href: "/protected/notifications", label: labels.notifications, icon: Bell         },
    { href: "/protected/account",       label: labels.account,       icon: User         },
  ],
}

export function getNavItems(role: string | null, labels: NavLabels = DEFAULT_LABELS) {
  const resolvedRole = (role as Role) in ITEMS_BY_ROLE ? (role as Role) : "student"
  return ITEMS_BY_ROLE[resolvedRole](labels)
}
