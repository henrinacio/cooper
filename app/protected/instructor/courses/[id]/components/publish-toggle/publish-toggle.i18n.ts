import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { unpublish: string; publish: string; publishedSuccess: string; unpublishedSuccess: string; error: string }> = {
  en: {
    unpublish: "Unpublish",
    publish: "Publish",
    publishedSuccess: "Course published!",
    unpublishedSuccess: "Course unpublished.",
    error: "Something went wrong."
  },
  pt: {
    unpublish: "Despublicar",
    publish: "Publicar",
    publishedSuccess: "Curso publicado!",
    unpublishedSuccess: "Curso despublicado.",
    error: "Algo deu errado."
  },
  es: {
    unpublish: "Despublicar",
    publish: "Publicar",
    publishedSuccess: "¡Curso publicado!",
    unpublishedSuccess: "Curso despublicado.",
    error: "Algo salió mal."
  },
}
