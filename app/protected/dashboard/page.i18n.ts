import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  title: string
  subtitle: string
  noCourses: string
  browseCourses: string
  lessons: string
  reviewCourse: string
  continue: string
  loading: string
}> = {
  en: {
    title: "My Learning",
    subtitle: "Your enrolled courses",
    noCourses: "No courses yet.",
    browseCourses: "Browse Courses",
    lessons: "lessons",
    reviewCourse: "Review Course",
    continue: "Continue",
    loading: "Loading courses…",
  },
  pt: {
    title: "Meu Aprendizado",
    subtitle: "Seus cursos matriculados",
    noCourses: "Nenhum curso ainda.",
    browseCourses: "Explorar Cursos",
    lessons: "aulas",
    reviewCourse: "Revisar Curso",
    continue: "Continuar",
    loading: "Carregando cursos…",
  },
  es: {
    title: "Mi Aprendizaje",
    subtitle: "Tus cursos matriculados",
    noCourses: "Aún no hay cursos.",
    browseCourses: "Explorar Cursos",
    lessons: "lecciones",
    reviewCourse: "Revisar Curso",
    continue: "Continuar",
    loading: "Cargando cursos…",
  },
}
