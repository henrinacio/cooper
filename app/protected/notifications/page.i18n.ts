import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  title: string;
  markAllRead: string;
  clearHistory: string;
  empty: string;
  classScheduled: string;
  classConfirmed: string;
  classCancelled: string;
  confirmClass: string;
  confirmed: string;
  courseEnrolled: string;
  courseCompleted: string;
  unknown: string;
}> = {
  en: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    clearHistory: "Clear history",
    empty: "No notifications yet.",
    classScheduled: "A class was scheduled for you",
    classConfirmed: "A student confirmed a class",
    classCancelled: "A class was cancelled",
    confirmClass: "Confirm",
    confirmed: "Confirmed",
    courseEnrolled: "You were enrolled in a course",
    courseCompleted: "A student completed your course",
    unknown: "New notification",
  },
  pt: {
    title: "Notificações",
    markAllRead: "Marcar tudo como lido",
    clearHistory: "Limpar histórico",
    empty: "Nenhuma notificação ainda.",
    classScheduled: "Uma aula foi agendada para você",
    classConfirmed: "Um aluno confirmou uma aula",
    classCancelled: "Uma aula foi cancelada",
    confirmClass: "Confirmar",
    confirmed: "Confirmado",
    courseEnrolled: "Você foi matriculado em um curso",
    courseCompleted: "Um aluno concluiu seu curso",
    unknown: "Nova notificação",
  },
  es: {
    title: "Notificaciones",
    markAllRead: "Marcar todo como leído",
    clearHistory: "Borrar historial",
    empty: "Aún no hay notificaciones.",
    classScheduled: "Se programó una clase para ti",
    classConfirmed: "Un estudiante confirmó una clase",
    classCancelled: "Una clase fue cancelada",
    confirmClass: "Confirmar",
    confirmed: "Confirmado",
    courseEnrolled: "Te inscribieron en un curso",
    courseCompleted: "Un estudiante completó tu curso",
    unknown: "Nueva notificación",
  },
}
