import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { home: string; notifications: string; account: string }> = {
  en: { home: "Home", notifications: "Notifications", account: "My Account" },
  pt: { home: "Início", notifications: "Notificações", account: "Minha Conta" },
  es: { home: "Inicio", notifications: "Notificaciones", account: "Mi Cuenta" },
}
