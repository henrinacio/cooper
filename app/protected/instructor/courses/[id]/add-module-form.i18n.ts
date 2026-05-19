import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  addModule: string
  placeholder: string
  adding: string
  add: string
  addedSuccess: string
}> = {
  en: { addModule: "Add Module", placeholder: "Module title", adding: "Adding…", add: "Add", addedSuccess: "Module added" },
  pt: { addModule: "Adicionar Módulo", placeholder: "Título do módulo", adding: "Adicionando…", add: "Adicionar", addedSuccess: "Módulo adicionado" },
  es: { addModule: "Agregar Módulo", placeholder: "Título del módulo", adding: "Agregando…", add: "Agregar", addedSuccess: "Módulo agregado" },
}
