import type { Locale } from "@/lib/locale"

export const translations: Record<
  Locale,
  {
    title: string
    scheduleClass: string
    noSessions: string
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
    sun: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    jan: string
    feb: string
    mar: string
    apr: string
    may: string
    jun: string
    jul: string
    aug: string
    sep: string
    oct: string
    nov: string
    dec: string
  }
> = {
  en: {
    title: "Calendar",
    scheduleClass: "Schedule Class",
    noSessions: "No sessions scheduled.",
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
    sun: "Sun",mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat",
    jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June",
    jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December",
  },
  pt: {
    title: "Calendário",
    scheduleClass: "Agendar Aula",
    noSessions: "Nenhuma aula agendada.",
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
    sun: "Dom", mon: "Seg", tue: "Ter", wed: "Qua", thu: "Qui", fri: "Sex", sat: "Sáb",
    jan: "Janeiro", feb: "Fevereiro", mar: "Março", apr: "Abril", may: "Maio", jun: "Junho",
    jul: "Julho", aug: "Agosto", sep: "Setembro", oct: "Outubro", nov: "Novembro", dec: "Dezembro",
  },
  es: {
    title: "Calendario",
    scheduleClass: "Programar Clase",
    noSessions: "No hay sesiones programadas.",
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
    sun: "Dom", mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb",
    jan: "Enero", feb: "Febrero", mar: "Marzo", apr: "Abril", may: "Mayo", jun: "Junio",
    jul: "Julio", aug: "Agosto", sep: "Septiembre", oct: "Octubre", nov: "Noviembre", dec: "Diciembre",
  },
}
