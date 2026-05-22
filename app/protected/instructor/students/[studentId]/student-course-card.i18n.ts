import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  lessons: string
  showProgress: string
  hideProgress: string
}> = {
  en: {
    lessons: "lessons",
    showProgress: "Show progress",
    hideProgress: "Hide progress",
  },
  pt: {
    lessons: "aulas",
    showProgress: "Ver progresso",
    hideProgress: "Ocultar progresso",
  },
  es: {
    lessons: "lecciones",
    showProgress: "Ver progreso",
    hideProgress: "Ocultar progreso",
  },
}
