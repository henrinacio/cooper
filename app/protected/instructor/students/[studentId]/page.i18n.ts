import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  backLabel: string
  noNotes: string
  notFound: string
  enrolledIn: string
  noteCount: string
  pinnedLabel: string
  editedAt: string
}> = {
  en: {
    backLabel: "Back",
    noNotes: "No notes about this student yet.",
    notFound: "Student not found.",
    enrolledIn: "Enrolled in",
    noteCount: "note",
    pinnedLabel: "Pinned",
    editedAt: "Updated",
  },
  pt: {
    backLabel: "Voltar",
    noNotes: "Nenhuma anotação sobre este aluno ainda.",
    notFound: "Aluno não encontrado.",
    enrolledIn: "Matriculado em",
    noteCount: "anotação",
    pinnedLabel: "Fixada",
    editedAt: "Atualizado",
  },
  es: {
    backLabel: "Volver",
    noNotes: "Aún no hay notas sobre este estudiante.",
    notFound: "Estudiante no encontrado.",
    enrolledIn: "Matriculado en",
    noteCount: "nota",
    pinnedLabel: "Fijada",
    editedAt: "Actualizado",
  },
}
