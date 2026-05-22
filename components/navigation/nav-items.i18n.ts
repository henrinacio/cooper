import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { home: string; account: string; calendar: string; notifications: string; admin: string }> = {
  en: {
    home: "Home",
    account: "My Account",
    calendar: "Calendar",
    notifications: "Notifications",
    admin: "Admin",
  },
  pt: {
    home: "Início",
    account: "Minha Conta",
    calendar: "Calendário",
    notifications: "Notificações",
    admin: "Admin",
  },
  es: {
    home: "Inicio",
    account: "Mi Cuenta",
    calendar: "Calendario",
    notifications: "Notificaciones",
    admin: "Admin",
  },
}
