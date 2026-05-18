import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  titleLabel: string
  titlePlaceholder: string
  typeLabel: string
  video: string
  text: string
  quiz: string
  videoUrl: string
  duration: string
  content: string
  quizPlaceholder: string
  textPlaceholder: string
  saving: string
  saveChanges: string
  createLesson: string
  cancel: string
}> = {
  en: {
    titleLabel: "Title",
    titlePlaceholder: "Lesson title",
    typeLabel: "Type",
    video: "Video",
    text: "Text",
    quiz: "Quiz",
    videoUrl: "Video URL",
    duration: "Duration (seconds)",
    content: "Content",
    quizPlaceholder: "JSON quiz definition or question text…",
    textPlaceholder: "Lesson content (Markdown supported)",
    saving: "Saving…",
    saveChanges: "Save Changes",
    createLesson: "Create Lesson",
    cancel: "Cancel",
  },
  pt: {
    titleLabel: "Título",
    titlePlaceholder: "Título da aula",
    typeLabel: "Tipo",
    video: "Vídeo",
    text: "Texto",
    quiz: "Quiz",
    videoUrl: "URL do Vídeo",
    duration: "Duração (segundos)",
    content: "Conteúdo",
    quizPlaceholder: "Definição do quiz em JSON ou texto da questão…",
    textPlaceholder: "Conteúdo da aula (Markdown suportado)",
    saving: "Salvando…",
    saveChanges: "Salvar Alterações",
    createLesson: "Criar Aula",
    cancel: "Cancelar",
  },
  es: {
    titleLabel: "Título",
    titlePlaceholder: "Título de la lección",
    typeLabel: "Tipo",
    video: "Video",
    text: "Texto",
    quiz: "Quiz",
    videoUrl: "URL del Video",
    duration: "Duración (segundos)",
    content: "Contenido",
    quizPlaceholder: "Definición del quiz en JSON o texto de la pregunta…",
    textPlaceholder: "Contenido de la lección (Markdown compatible)",
    saving: "Guardando…",
    saveChanges: "Guardar Cambios",
    createLesson: "Crear Lección",
    cancel: "Cancelar",
  },
}
