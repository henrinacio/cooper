import { Home, User, CalendarDays } from "lucide-react"

type NavLabels = {
  home: string;
  account: string;
  calendar: string
}

const DEFAULT_LABELS: NavLabels = {
  home: "Home",
  account: "My Account",
  calendar: "Calendar"
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
      icon: Home
    },
    {
      href: "/protected/calendar",
      label: labels.calendar,
      icon: CalendarDays
    },
    {
      href: "/protected/account",
      label: labels.account,
      icon: User
    },
  ]
}
