import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  titleLabel: string
  titlePlaceholder: string
  descriptionLabel: string
  descriptionPlaceholder: string
  publishImmediately: string
  creating: string
  createCourse: string
  successTitle: string
  errorTitle: string
}> = {
  en: {
    titleLabel: "Title",
    titlePlaceholder: "Introduction to TypeScript",
    descriptionLabel: "Description",
    descriptionPlaceholder: "A short description of the course",
    publishImmediately: "Publish immediately",
    creating: "Creating…",
    createCourse: "Create Course",
    successTitle: "Course created",
    errorTitle: "Failed to create course",
  },
  pt: {
    titleLabel: "Título",
    titlePlaceholder: "Introdução ao TypeScript",
    descriptionLabel: "Descrição",
    descriptionPlaceholder: "Uma breve descrição do curso",
    publishImmediately: "Publicar imediatamente",
    creating: "Criando…",
    createCourse: "Criar Curso",
    successTitle: "Curso criado",
    errorTitle: "Erro ao criar curso",
  },
  es: {
    titleLabel: "Título",
    titlePlaceholder: "Introducción a TypeScript",
    descriptionLabel: "Descripción",
    descriptionPlaceholder: "Una breve descripción del curso",
    publishImmediately: "Publicar inmediatamente",
    creating: "Creando…",
    createCourse: "Crear Curso",
    successTitle: "Curso creado",
    errorTitle: "Error al crear curso",
  },
}
