import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { developer: string; builtWith: string }> = {
  en: {
    developer: "Developer",
    builtWith: "Built with Next.js, Supabase, and Tailwind CSS.",
  },
  pt: {
    developer: "Desenvolvedor",
    builtWith: "Desenvolvido com Next.js, Supabase e Tailwind CSS.",
  },
  es: {
    developer: "Desarrollador",
    builtWith: "Desarrollado con Next.js, Supabase y Tailwind CSS.",
  },
}
