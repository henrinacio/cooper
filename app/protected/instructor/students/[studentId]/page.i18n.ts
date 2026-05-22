import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  backLabel: string
  notFound: string
  noEnrollments: string
}> = {
  en: {
    backLabel: "Back",
    notFound: "Student not found.",
    noEnrollments: "This student is not enrolled in any of your courses.",
  },
  pt: {
    backLabel: "Voltar",
    notFound: "Aluno não encontrado.",
    noEnrollments: "Este aluno não está matriculado em nenhum dos seus cursos.",
  },
  es: {
    backLabel: "Volver",
    notFound: "Estudiante no encontrado.",
    noEnrollments: "Este estudiante no está matriculado en ninguno de tus cursos.",
  },
}
