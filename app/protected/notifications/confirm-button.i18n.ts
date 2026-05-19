import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  success: string
  error: string
}> = {
  en: {
    success: "Class confirmed!",
    error: "Failed to confirm class."
  },
  pt: {
    success: "Aula confirmada!",
    error: "Erro ao confirmar a aula."
  },
  es: {
    success: "¡Clase confirmada!",
    error: "Error al confirmar la clase."
  },
}
