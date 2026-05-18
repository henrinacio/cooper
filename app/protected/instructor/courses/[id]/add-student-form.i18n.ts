import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  label: string
  adding: string
  add: string
  enrolledSuccess: string
}> = {
  en: { label: "Add student by email", adding: "Adding…", add: "Add", enrolledSuccess: "enrolled successfully" },
  pt: { label: "Adicionar aluno por e-mail", adding: "Adicionando…", add: "Adicionar", enrolledSuccess: "matriculado com sucesso" },
  es: { label: "Agregar alumno por correo", adding: "Agregando…", add: "Agregar", enrolledSuccess: "matriculado con éxito" },
}
