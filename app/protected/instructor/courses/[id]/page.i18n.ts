import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  preview: string
  curriculum: string
  noModules: string
  lessonsLabel: string
  addLesson: string
  students: string
  enrolled: string
  previewMode: string
  viewProgress: string
}> = {
  en: {
    preview: "Preview",
    curriculum: "Curriculum",
    noModules: "No modules yet. Add one above.",
    lessonsLabel: "lessons",
    addLesson: "Add lesson",
    students: "Students",
    enrolled: "Enrolled",
    previewMode: "Preview Mode",
    viewProgress: "Progress",
  },
  pt: {
    preview: "Visualizar",
    curriculum: "Currículo",
    noModules: "Nenhum módulo ainda. Adicione um acima.",
    lessonsLabel: "aulas",
    addLesson: "Adicionar aula",
    students: "Alunos",
    enrolled: "Matriculado em",
    previewMode: "Modo Visualização",
    viewProgress: "Progresso",
  },
  es: {
    preview: "Vista previa",
    curriculum: "Plan de estudios",
    noModules: "Aún no hay módulos. Agrega uno arriba.",
    lessonsLabel: "lecciones",
    addLesson: "Agregar lección",
    students: "Estudiantes",
    enrolled: "Matriculado el",
    previewMode: "Modo vista previa",
    viewProgress: "Progreso",
  },
}
