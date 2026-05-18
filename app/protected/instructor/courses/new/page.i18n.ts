import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { title: string; subtitle: string }> = {
  en: { title: "New Course", subtitle: "Create a new course" },
  pt: { title: "Novo Curso", subtitle: "Crie um novo curso" },
  es: { title: "Nuevo Curso", subtitle: "Crea un nuevo curso" },
}
