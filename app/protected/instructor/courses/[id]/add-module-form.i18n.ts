import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  addModule: string
  placeholder: string
  adding: string
  add: string
}> = {
  en: { addModule: "Add Module", placeholder: "Module title", adding: "Adding…", add: "Add" },
  pt: { addModule: "Adicionar Módulo", placeholder: "Título do módulo", adding: "Adicionando…", add: "Adicionar" },
  es: { addModule: "Agregar Módulo", placeholder: "Título del módulo", adding: "Agregando…", add: "Agregar" },
}
