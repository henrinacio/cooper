import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  completed: string
  saving: string
  markComplete: string
  undo: string
  previous: string
  next: string
}> = {
  en: { completed: "Completed", saving: "Saving…", markComplete: "Mark Complete", undo: "Undo", previous: "Previous Lesson", next: "Next Lesson" },
  pt: { completed: "Concluída", saving: "Salvando…", markComplete: "Marcar como Concluída", undo: "Desfazer", previous: "Aula Anterior", next: "Próxima Aula" },
  es: { completed: "Completada", saving: "Guardando…", markComplete: "Marcar como completada", undo: "Deshacer", previous: "Lección anterior", next: "Siguiente lección" },
}
