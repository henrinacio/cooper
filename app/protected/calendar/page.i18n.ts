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
    sun: "Sun",mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat",
    jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June",
    jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December",
  },
  pt: {
    title: "Calendário",
    scheduleClass: "Agendar Aula",
    noSessions: "Nenhuma sessão agendada.",
    studentLabel: "Aluno",
    instructorLabel: "Instrutor",
    confirmClass: "Confirmar",
    confirmed: "Confirmado",
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
    sun: "Dom", mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb",
    jan: "Enero", feb: "Febrero", mar: "Marzo", apr: "Abril", may: "Mayo", jun: "Junio",
    jul: "Julio", aug: "Agosto", sep: "Septiembre", oct: "Octubre", nov: "Noviembre", dec: "Diciembre",
  },
}
