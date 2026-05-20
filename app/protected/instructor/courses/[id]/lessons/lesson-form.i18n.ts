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
  textPlaceholder: string
  saving: string
  saveChanges: string
  createLesson: string
  cancel: string
  successCreate: string
  successEdit: string
  addQuestion: string
  addOption: string
  questionPlaceholder: string
  optionPlaceholder: string
  markCorrect: string
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
    textPlaceholder: "Lesson content (Markdown supported)",
    saving: "Saving…",
    saveChanges: "Save Changes",
    createLesson: "Create Lesson",
    cancel: "Cancel",
    successCreate: "Lesson created",
    successEdit: "Lesson updated",
    addQuestion: "Add question",
    addOption: "Add option",
    questionPlaceholder: "Type your question…",
    optionPlaceholder: "Option",
    markCorrect: "Mark as correct answer",
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
    textPlaceholder: "Conteúdo da aula (Markdown suportado)",
    saving: "Salvando…",
    saveChanges: "Salvar Alterações",
    createLesson: "Criar Aula",
    cancel: "Cancelar",
    successCreate: "Aula criada",
    successEdit: "Aula atualizada",
    addQuestion: "Adicionar questão",
    addOption: "Adicionar opção",
    questionPlaceholder: "Digite sua questão…",
    optionPlaceholder: "Opção",
    markCorrect: "Marcar como resposta correta",
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
    textPlaceholder: "Contenido de la lección (Markdown compatible)",
    saving: "Guardando…",
    saveChanges: "Guardar Cambios",
    createLesson: "Crear Lección",
    cancel: "Cancelar",
    successCreate: "Lección creada",
    successEdit: "Lección actualizada",
    addQuestion: "Agregar pregunta",
    addOption: "Agregar opción",
    questionPlaceholder: "Escribe tu pregunta…",
    optionPlaceholder: "Opción",
    markCorrect: "Marcar como respuesta correcta",
  },
}
