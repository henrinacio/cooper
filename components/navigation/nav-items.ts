import { Home, Bell, User } from "lucide-react"

type NavLabels = { home: string; notifications: string; account: string }

const DEFAULT_LABELS: NavLabels = { home: "Home", notifications: "Notifications", account: "My Account" }

export function getNavItems(role: string | null, labels: NavLabels = DEFAULT_LABELS) {
  const homeHref =
    role === "instructor" || role === "admin"
      ? "/protected/instructor/courses"
      : "/protected/dashboard"

  return [
    { href: homeHref, label: labels.home, icon: Home },
    { href: "/protected/notifications", label: labels.notifications, icon: Bell },
    { href: "/protected/account", label: labels.account, icon: User },
  ]
}
