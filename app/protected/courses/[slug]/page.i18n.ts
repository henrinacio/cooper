import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  lessonsCount: string
  startLearning: string
  curriculum: string
  previewMode: string
}> = {
  en: { lessonsCount: "lessons", startLearning: "Start Learning", curriculum: "Curriculum", previewMode: "Preview Mode" },
  pt: { lessonsCount: "aulas", startLearning: "Começar a Aprender", curriculum: "Currículo", previewMode: "Modo Visualização" },
  es: { lessonsCount: "lecciones", startLearning: "Comenzar a Aprender", curriculum: "Plan de estudios", previewMode: "Modo vista previa" },
}
