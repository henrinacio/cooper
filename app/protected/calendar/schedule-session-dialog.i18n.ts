import type { Locale } from "@/lib/locale"

export const translations: Record<
  Locale,
  {
    dialogTitle: string
    titleLabel: string
    titlePlaceholder: string
    courseLabel: string
    selectCourse: string
    studentLabel: string
    selectCourseFirst: string
    noStudents: string
    selectStudent: string
    dateTimeLabel: string
    durationLabel: string
    notesLabel: string
    notesPlaceholder: string
    scheduleButton: string
    dur30: string
    dur45: string
    dur60: string
    dur90: string
    dur120: string
  }
> = {
  en: {
    dialogTitle: "Schedule a Class",
    titleLabel: "Title",
    titlePlaceholder: "e.g. 1-on-1 Review Session",
    courseLabel: "Course",
    selectCourse: "Select a course",
    studentLabel: "Student",
    selectCourseFirst: "Select a course first",
    noStudents: "No students enrolled",
    selectStudent: "Select a student",
    dateTimeLabel: "Date & Time",
    durationLabel: "Duration",
    notesLabel: "Notes (optional)",
    notesPlaceholder: "Any notes for this session...",
    scheduleButton: "Schedule",
    dur30: "30 minutes",
    dur45: "45 minutes",
    dur60: "1 hour",
    dur90: "1.5 hours",
    dur120: "2 hours",
  },
  pt: {
    dialogTitle: "Agendar Aula",
    titleLabel: "Título",
    titlePlaceholder: "ex. Sessão de Revisão 1 a 1",
    courseLabel: "Curso",
    selectCourse: "Selecione um curso",
    studentLabel: "Aluno",
    selectCourseFirst: "Selecione um curso primeiro",
    noStudents: "Nenhum aluno matriculado",
    selectStudent: "Selecione um aluno",
    dateTimeLabel: "Data e Hora",
    durationLabel: "Duração",
    notesLabel: "Notas (opcional)",
    notesPlaceholder: "Alguma nota para esta sessão...",
    scheduleButton: "Agendar",
    dur30: "30 minutos",
    dur45: "45 minutos",
    dur60: "1 hora",
    dur90: "1h30",
    dur120: "2 horas",
  },
  es: {
    dialogTitle: "Programar Clase",
    titleLabel: "Título",
    titlePlaceholder: "ej. Sesión de revisión 1 a 1",
    courseLabel: "Curso",
    selectCourse: "Selecciona un curso",
    studentLabel: "Estudiante",
    selectCourseFirst: "Selecciona un curso primero",
    noStudents: "Sin estudiantes inscritos",
    selectStudent: "Selecciona un estudiante",
    dateTimeLabel: "Fecha y Hora",
    durationLabel: "Duración",
    notesLabel: "Notas (opcional)",
    notesPlaceholder: "Alguna nota para esta sesión...",
    scheduleButton: "Programar",
    dur30: "30 minutos",
    dur45: "45 minutos",
    dur60: "1 hora",
    dur90: "1h30",
    dur120: "2 horas",
  },
}
