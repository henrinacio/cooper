import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  lessons: string
  showProgress: string
  hideProgress: string
  enrolledAt: string
  lastCompleted: string
  activeToday: string
  daysInactiveSuffix: string
  lessonsPerWeek: string
  stuckOn: string
  timeRemaining: string
  sessions: string
  noUpcomingSessions: string
  pastSession: string
  pastSessions: string
}> = {
  en: {
    lessons: "lessons",
    showProgress: "Show progress",
    hideProgress: "Hide progress",
    enrolledAt: "Enrolled",
    lastCompleted: "Last completed",
    activeToday: "Active today",
    daysInactiveSuffix: "d inactive",
    lessonsPerWeek: "lessons/week",
    stuckOn: "Stuck on",
    timeRemaining: "remaining",
    sessions: "Sessions",
    noUpcomingSessions: "No upcoming sessions",
    pastSession: "past session",
    pastSessions: "past sessions",
  },
  pt: {
    lessons: "aulas",
    showProgress: "Ver progresso",
    hideProgress: "Ocultar progresso",
    enrolledAt: "Matriculado",
    lastCompleted: "Última conclusão",
    activeToday: "Ativo hoje",
    daysInactiveSuffix: "d inativo",
    lessonsPerWeek: "aulas/semana",
    stuckOn: "Parado em",
    timeRemaining: "restante",
    sessions: "Sessões",
    noUpcomingSessions: "Sem sessões agendadas",
    pastSession: "sessão anterior",
    pastSessions: "sessões anteriores",
  },
  es: {
    lessons: "lecciones",
    showProgress: "Ver progreso",
    hideProgress: "Ocultar progreso",
    enrolledAt: "Inscrito",
    lastCompleted: "Última finalización",
    activeToday: "Activo hoy",
    daysInactiveSuffix: "d inactivo",
    lessonsPerWeek: "lecciones/semana",
    stuckOn: "Atascado en",
    timeRemaining: "restante",
    sessions: "Sesiones",
    noUpcomingSessions: "Sin sesiones próximas",
    pastSession: "sesión pasada",
    pastSessions: "sesiones pasadas",
  },
}
