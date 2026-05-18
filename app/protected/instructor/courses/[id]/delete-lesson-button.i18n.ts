import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { title: string; confirm: string; yes: string; no: string }> = {
  en: {
    title: "Delete lesson",
    confirm: "This will permanently delete the lesson and all its content. This action cannot be undone.",
    yes: "Delete",
    no: "Cancel" },
  pt: {
    title: "Excluir aula",
    confirm: "Isso excluirá permanentemente a aula e todo o seu conteúdo. Esta ação não pode ser desfeita.",
    yes: "Excluir",
    no: "Cancelar"
  },
  es: {
    title: "Eliminar lección",
    confirm: "Esto eliminará permanentemente la lección y todo su contenido. Esta acción no se puede deshacer.",
    yes: "Eliminar",
    no: "Cancelar"
  },
}
