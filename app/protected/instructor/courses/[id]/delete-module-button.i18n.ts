import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { confirm: string; yes: string; no: string }> = {
  en: { confirm: "Delete module and all lessons?", yes: "Yes", no: "No" },
  pt: { confirm: "Excluir módulo e todas as aulas?", yes: "Sim", no: "Não" },
  es: { confirm: "¿Eliminar módulo y todas las lecciones?", yes: "Sí", no: "No" },
}
