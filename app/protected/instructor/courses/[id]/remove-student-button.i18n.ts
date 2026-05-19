import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { title: string; confirm: string; yes: string; no: string; removedSuccess: string }> = {
  en: {
    title: "Remove student",
    confirm: "This will remove the student from the course. They will lose access to all course content.",
    yes: "Remove",
    no: "Cancel",
    removedSuccess: "Student removed",
  },
  pt: {
    title: "Remover aluno",
    confirm: "Isso removerá o aluno do curso. Ele perderá acesso a todo o conteúdo do curso.",
    yes: "Remover",
    no: "Cancelar",
    removedSuccess: "Aluno removido",
  },
  es: {
    title: "Eliminar estudiante",
    confirm: "Esto eliminará al estudiante del curso. Perderá acceso a todo el contenido del curso.",
    yes: "Eliminar",
    no: "Cancelar",
    removedSuccess: "Estudiante eliminado",
  },
}
