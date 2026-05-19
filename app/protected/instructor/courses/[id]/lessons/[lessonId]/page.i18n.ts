import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { back: string; moduleLabel: string; title: string }> = {
  en: {
    back: "Back to course",
    moduleLabel: "Module:",
    title: "Edit Lesson"
  },
  pt: {
    back: "Voltar ao curso",
    moduleLabel: "Módulo:",
    title: "Editar Aula"
  },
  es: {
    back: "Volver al curso",
    moduleLabel: "Módulo:",
    title: "Editar Lección"
  },
}
