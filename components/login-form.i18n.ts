import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  welcome: string
  description: string
  signInGoogle: string
  redirecting: string
}> = {
  en: {
    welcome: "Welcome",
    description: "Sign in to your account",
    signInGoogle: "Sign in with Google",
    redirecting: "Redirecting...",
  },
  pt: {
    welcome: "Bem-vindo",
    description: "Entre na sua conta",
    signInGoogle: "Entrar com Google",
    redirecting: "Redirecionando...",
  },
  es: {
    welcome: "Bienvenido",
    description: "Inicia sesión en tu cuenta",
    signInGoogle: "Iniciar sesión con Google",
    redirecting: "Redirigiendo...",
  },
}
