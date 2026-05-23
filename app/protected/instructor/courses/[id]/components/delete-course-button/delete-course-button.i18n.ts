import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { title: string; confirm: string; yes: string; no: string; deletedSuccess: string }> = {
  en: {
    title: "Delete course",
    confirm: "This will permanently delete the course and all its content. This action cannot be undone.",
    yes: "Delete",
    no: "Cancel",
    deletedSuccess: "Course deleted",
  },
  pt: {
    title: "Excluir curso",
    confirm: "Isso excluirá permanentemente o curso e todo o seu conteúdo. Esta ação não pode ser desfeita.",
    yes: "Excluir",
    no: "Cancelar",
    deletedSuccess: "Curso excluído",
  },
  es: {
    title: "Eliminar curso",
    confirm: "Esto eliminará permanentemente el curso y todo su contenido. Esta acción no se puede deshacer.",
    yes: "Eliminar",
    no: "Cancelar",
    deletedSuccess: "Curso eliminado",
  },
}
