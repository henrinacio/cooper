import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { back: string; moduleLabel: string; title: string }> = {
  en: { back: "Back to course", moduleLabel: "Module:", title: "New Lesson" },
  pt: { back: "Voltar ao curso", moduleLabel: "Módulo:", title: "Nova Aula" },
  es: { back: "Volver al curso", moduleLabel: "Módulo:", title: "Nueva Lección" },
}
