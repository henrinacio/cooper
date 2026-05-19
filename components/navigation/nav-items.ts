import { Home, User, CalendarDays, Bell } from "lucide-react"

type NavLabels = {
  home: string;
  account: string;
  calendar: string;
  notifications: string;
}

const DEFAULT_LABELS: NavLabels = {
  home: "Home",
  account: "My Account",
  calendar: "Calendar",
  notifications: "Notifications",
}

export function getNavItems(role: string | null, labels: NavLabels = DEFAULT_LABELS) {
  const homeHref =
    role === "instructor" || role === "admin"
      ? "/protected/instructor/courses"
      : "/protected/dashboard"

  return [
    {
      href: homeHref,
      label: labels.home,
      icon: Home,
      showBadge: false,
    },
    {
      href: "/protected/calendar",
      label: labels.calendar,
      icon: CalendarDays,
      showBadge: false,
    },
    {
      href: "/protected/notifications",
      label: labels.notifications,
      icon: Bell,
      showBadge: true,
    },
    {
      href: "/protected/account",
      label: labels.account,
      icon: User,
      showBadge: false,
    },
  ]
}
