import { Home, Bell, User } from "lucide-react";

export function getNavItems(role: string | null) {
  const homeHref =
    role === "instructor" || role === "admin"
      ? "/protected/instructor/courses"
      : "/protected/dashboard";

  return [
    { href: homeHref, label: "Home", icon: Home },
    { href: "/protected/notifications", label: "Notifications", icon: Bell },
    { href: "/protected/account", label: "My Account", icon: User },
  ];
}
