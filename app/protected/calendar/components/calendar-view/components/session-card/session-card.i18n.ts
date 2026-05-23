import type { Locale } from "@/lib/locale"

export const translations: Record<
  Locale,
  {
    studentLabel: string
    instructorLabel: string
    confirmClass: string
    confirmed: string
    deleteSuccess: string
    deleteError: string
    deleteConfirmTitle: string
    deleteConfirmDescription: string
    deleteCancel: string
    deleteConfirm: string
  }
> = {
  en: {
    studentLabel: "Student",
    instructorLabel: "Instructor",
    confirmClass: "Confirm",
    confirmed: "Confirmed",
    deleteSuccess: "Class deleted.",
    deleteError: "Failed to delete class.",
    deleteConfirmTitle: "Delete class?",
    deleteConfirmDescription: "This will cancel the session and notify the student.",
    deleteCancel: "Cancel",
    deleteConfirm: "Delete",
  },
  pt: {
    studentLabel: "Aluno",
    instructorLabel: "Instrutor",
    confirmClass: "Confirmar",
    confirmed: "Confirmado",
    deleteSuccess: "Aula deletada.",
    deleteError: "Erro ao deletar a aula.",
    deleteConfirmTitle: "Deletar aula?",
    deleteConfirmDescription: "A aula será cancelada e o aluno será notificado.",
    deleteCancel: "Cancelar",
    deleteConfirm: "Deletar",
  },
  es: {
    studentLabel: "Estudiante",
    instructorLabel: "Instructor",
    confirmClass: "Confirmar",
    confirmed: "Confirmado",
    deleteSuccess: "Clase eliminada.",
    deleteError: "Error al eliminar la clase.",
    deleteConfirmTitle: "¿Eliminar clase?",
    deleteConfirmDescription: "Se cancelará la sesión y se notificará al estudiante.",
    deleteCancel: "Cancelar",
    deleteConfirm: "Eliminar",
  },
}
