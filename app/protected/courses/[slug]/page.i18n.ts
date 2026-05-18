import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  lessonsCount: string
  startLearning: string
  curriculum: string
  previewMode: string
  lastUpdated: string
}> = {
  en: { lessonsCount: "lessons", startLearning: "Start Learning", curriculum: "Curriculum", previewMode: "Preview Mode", lastUpdated: "Last updated" },
  pt: { lessonsCount: "aulas", startLearning: "Começar a Aprender", curriculum: "Currículo", previewMode: "Modo Visualização", lastUpdated: "Atualizado em" },
  es: { lessonsCount: "lecciones", startLearning: "Comenzar a Aprender", curriculum: "Plan de estudios", previewMode: "Modo vista previa", lastUpdated: "Última actualización" },
}
