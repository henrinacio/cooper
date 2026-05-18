import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  heading: string
  noStudents: string
  lessons: string
  lastActivity: string
}> = {
  en: {
    heading: "Student Progress",
    noStudents: "No students enrolled yet.",
    lessons: "lessons",
    lastActivity: "Last activity",
  },
  pt: {
    heading: "Progresso dos Alunos",
    noStudents: "Nenhum aluno matriculado ainda.",
    lessons: "aulas",
    lastActivity: "Última atividade",
  },
  es: {
    heading: "Progreso de Estudiantes",
    noStudents: "Aún no hay estudiantes matriculados.",
    lessons: "lecciones",
    lastActivity: "Última actividad",
  },
}
