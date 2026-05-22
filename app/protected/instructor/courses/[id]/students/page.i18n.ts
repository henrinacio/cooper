import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  students: string
  enrolled: string
  enrolledCount: string
  enrollmentList: string
  viewProfile: string
  viewProgress: string
  viewAnalytics: string
  noStudents: string
}> = {
  en: {
    students: "Students",
    enrolled: "Enrolled",
    enrolledCount: "Enrolled",
    enrollmentList: "Enrollments",
    viewProfile: "View Profile",
    viewProgress: "Progress",
    viewAnalytics: "Analytics",
    noStudents: "No students enrolled yet.",
  },
  pt: {
    students: "Alunos",
    enrolled: "Matriculado em",
    enrolledCount: "Matriculados",
    enrollmentList: "Matrículas",
    viewProfile: "Ver Perfil",
    viewProgress: "Progresso",
    viewAnalytics: "Análises",
    noStudents: "Nenhum aluno matriculado ainda.",
  },
  es: {
    students: "Estudiantes",
    enrolled: "Matriculado el",
    enrolledCount: "Matriculados",
    enrollmentList: "Matrículas",
    viewProfile: "Ver Perfil",
    viewProgress: "Progreso",
    viewAnalytics: "Análisis",
    noStudents: "Aún no hay estudiantes matriculados.",
  },
}
