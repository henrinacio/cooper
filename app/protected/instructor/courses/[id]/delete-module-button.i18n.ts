import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { title: string; confirm: string; yes: string; no: string }> = {
  en: {
    title: "Delete module",
    confirm: "This will permanently delete the module and all its lessons. This action cannot be undone.",
    yes: "Delete",
    no: "Cancel"
  },
  pt: {
    title: "Excluir módulo",
    confirm: "Isso excluirá permanentemente o módulo e todas as suas aulas. Esta ação não pode ser desfeita.",
    yes: "Excluir",
    no: "Cancelar"
  },
  es: {
    title: "Eliminar módulo",
    confirm: "Esto eliminará permanentemente el módulo y todas sus lecciones. Esta acción no se puede deshacer.",
    yes: "Eliminar",
    no: "Cancelar"
  },
}
