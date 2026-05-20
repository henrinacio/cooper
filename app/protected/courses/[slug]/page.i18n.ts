import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  lessonsCount: string
  startLearning: string
  curriculum: string
  previewMode: string
  lastUpdated: string
  instructor: string
}> = {
  en: { lessonsCount: "lessons", startLearning: "Start Learning", curriculum: "Curriculum", previewMode: "Preview Mode", lastUpdated: "Last updated", instructor: "Instructor" },
  pt: { lessonsCount: "aulas", startLearning: "Começar a Aprender", curriculum: "Currículo", previewMode: "Modo Visualização", lastUpdated: "Atualizado em", instructor: "Instrutor" },
  es: { lessonsCount: "lecciones", startLearning: "Comenzar a Aprender", curriculum: "Plan de estudios", previewMode: "Modo vista previa", lastUpdated: "Última actualización", instructor: "Instructor" },
}
