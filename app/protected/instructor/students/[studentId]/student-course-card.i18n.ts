import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  lessons: string
  showProgress: string
  hideProgress: string
  enrolledAt: string
  lastCompleted: string
}> = {
  en: {
    lessons: "lessons",
    showProgress: "Show progress",
    hideProgress: "Hide progress",
    enrolledAt: "Enrolled",
    lastCompleted: "Last completed",
  },
  pt: {
    lessons: "aulas",
    showProgress: "Ver progresso",
    hideProgress: "Ocultar progresso",
    enrolledAt: "Matriculado",
    lastCompleted: "Última conclusão",
  },
  es: {
    lessons: "lecciones",
    showProgress: "Ver progreso",
    hideProgress: "Ocultar progreso",
    enrolledAt: "Inscrito",
    lastCompleted: "Última finalización",
  },
}
