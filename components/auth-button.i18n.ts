import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { greeting: string; signIn: string }> = {
  en: { greeting: "Hey, {name}!", signIn: "Sign in" },
  pt: { greeting: "Olá, {name}!", signIn: "Entrar" },
  es: { greeting: "¡Hola, {name}!", signIn: "Iniciar sesión" },
}
