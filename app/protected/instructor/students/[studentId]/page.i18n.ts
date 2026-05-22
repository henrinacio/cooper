import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  backLabel: string
  notFound: string
  noEnrollments: string
  courses: string
  lessons: string
  overall: string
  lastActive: string
  neverActive: string
  activeToday: string
  daysAgo: string
}> = {
  en: {
    backLabel: "Back",
    notFound: "Student not found.",
    noEnrollments: "This student is not enrolled in any of your courses.",
    courses: "courses",
    lessons: "lessons",
    overall: "overall",
    lastActive: "Last active",
    neverActive: "Never active",
    activeToday: "today",
    daysAgo: "d ago",
  },
  pt: {
    backLabel: "Voltar",
    notFound: "Aluno não encontrado.",
    noEnrollments: "Este aluno não está matriculado em nenhum dos seus cursos.",
    courses: "cursos",
    lessons: "aulas",
    overall: "geral",
    lastActive: "Última atividade",
    neverActive: "Nunca ativo",
    activeToday: "hoje",
    daysAgo: "d atrás",
  },
  es: {
    backLabel: "Volver",
    notFound: "Estudiante no encontrado.",
    noEnrollments: "Este estudiante no está matriculado en ninguno de tus cursos.",
    courses: "cursos",
    lessons: "lecciones",
    overall: "general",
    lastActive: "Última actividad",
    neverActive: "Nunca activo",
    activeToday: "hoy",
    daysAgo: "d atrás",
  },
}
