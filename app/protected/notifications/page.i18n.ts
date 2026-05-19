import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  title: string;
  markAllRead: string;
  empty: string;
  classScheduled: string;
  courseEnrolled: string;
  courseCompleted: string;
  unknown: string;
}> = {
  en: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    empty: "No notifications yet.",
    classScheduled: "A class was scheduled for you",
    courseEnrolled: "You were enrolled in a course",
    courseCompleted: "A student completed your course",
    unknown: "New notification",
  },
  pt: {
    title: "Notificações",
    markAllRead: "Marcar tudo como lido",
    empty: "Nenhuma notificação ainda.",
    classScheduled: "Uma aula foi agendada para você",
    courseEnrolled: "Você foi matriculado em um curso",
    courseCompleted: "Um aluno concluiu seu curso",
    unknown: "Nova notificação",
  },
  es: {
    title: "Notificaciones",
    markAllRead: "Marcar todo como leído",
    empty: "Aún no hay notificaciones.",
    classScheduled: "Se programó una clase para ti",
    courseEnrolled: "Te inscribieron en un curso",
    courseCompleted: "Un estudiante completó tu curso",
    unknown: "Nueva notificación",
  },
}
