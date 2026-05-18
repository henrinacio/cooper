import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { backToCourse: string; previewMode: string }> = {
  en: { backToCourse: "Back to course", previewMode: "Preview Mode" },
  pt: { backToCourse: "Voltar ao curso", previewMode: "Modo Visualização" },
  es: { backToCourse: "Volver al curso", previewMode: "Modo vista previa" },
}
