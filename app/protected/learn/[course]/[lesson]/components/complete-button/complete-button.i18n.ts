import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  completed: string
  saving: string
  markComplete: string
  undo: string
  previous: string
  next: string
  markedComplete: string
  markedIncomplete: string
}> = {
  en: { completed: "Completed", saving: "Saving…", markComplete: "Mark Complete", undo: "Undo", previous: "Previous Lesson", next: "Next Lesson", markedComplete: "Lesson marked as complete!", markedIncomplete: "Lesson marked as incomplete." },
  pt: { completed: "Concluída", saving: "Salvando…", markComplete: "Marcar como Concluída", undo: "Desfazer", previous: "Aula Anterior", next: "Próxima Aula", markedComplete: "Aula marcada como concluída!", markedIncomplete: "Aula marcada como não concluída." },
  es: { completed: "Completada", saving: "Guardando…", markComplete: "Marcar como completada", undo: "Deshacer", previous: "Lección anterior", next: "Siguiente lección", markedComplete: "¡Lección marcada como completada!", markedIncomplete: "Lección marcada como no completada." },
}
