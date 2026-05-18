import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { home: string; account: string; calendar: string }> = {
  en: {
    home: "Home",
    account: "My Account",
    calendar: "Calendar"
  },
  pt: {
    home: "Início",
    account: "Minha Conta",
    calendar: "Calendário"
  },
  es: {
    home: "Inicio",
    account: "Mi Cuenta",
    calendar: "Calendario"
  },
}
