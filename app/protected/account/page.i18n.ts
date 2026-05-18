import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  title: string
  profile: string
  name: string
  email: string
  joined: string
  preferences: string
  theme: string
  language: string
  dateLocale: string
}> = {
  en: {
    title: "Account",
    profile: "Profile",
    name: "Name",
    email: "Email",
    joined: "Joined",
    preferences: "Preferences",
    theme: "Theme",
    language: "Language",
    dateLocale: "en-US",
  },
  pt: {
    title: "Conta",
    profile: "Perfil",
    name: "Nome",
    email: "E-mail",
    joined: "Membro desde",
    preferences: "Preferências",
    theme: "Tema",
    language: "Idioma",
    dateLocale: "pt-BR",
  },
  es: {
    title: "Cuenta",
    profile: "Perfil",
    name: "Nombre",
    email: "Correo electrónico",
    joined: "Miembro desde",
    preferences: "Preferencias",
    theme: "Tema",
    language: "Idioma",
    dateLocale: "es-ES",
  },
}
