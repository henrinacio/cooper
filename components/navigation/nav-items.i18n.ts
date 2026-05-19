import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { home: string; account: string; calendar: string; notifications: string }> = {
  en: {
    home: "Home",
    account: "My Account",
    calendar: "Calendar",
    notifications: "Notifications",
  },
  pt: {
    home: "Início",
    account: "Minha Conta",
    calendar: "Calendário",
    notifications: "Notificações",
  },
  es: {
    home: "Inicio",
    account: "Mi Cuenta",
    calendar: "Calendario",
    notifications: "Notificaciones",
  },
}
