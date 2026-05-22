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
  },
}
