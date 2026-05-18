import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  title: string
  subtitle: string
  newCourse: string
  noCourses: string
  createFirst: string
  published: string
  draft: string
  preview: string
  edit: string
  loading: string
}> = {
  en: {
    title: "My Courses",
    subtitle: "Manage your courses",
    newCourse: "New Course",
    noCourses: "No courses yet.",
    createFirst: "Create your first course",
    published: "Published",
    draft: "Draft",
    preview: "Preview",
    edit: "Edit",
    loading: "Loading courses…",
  },
  pt: {
    title: "Meus Cursos",
    subtitle: "Gerencie seus cursos",
    newCourse: "Novo Curso",
    noCourses: "Nenhum curso ainda.",
    createFirst: "Crie seu primeiro curso",
    published: "Publicado",
    draft: "Rascunho",
    preview: "Visualizar",
    edit: "Editar",
    loading: "Carregando cursos…",
  },
  es: {
    title: "Mis Cursos",
    subtitle: "Administra tus cursos",
    newCourse: "Nuevo Curso",
    noCourses: "Aún no hay cursos.",
    createFirst: "Crea tu primer curso",
    published: "Publicado",
    draft: "Borrador",
    preview: "Vista previa",
    edit: "Editar",
    loading: "Cargando cursos…",
  },
}
