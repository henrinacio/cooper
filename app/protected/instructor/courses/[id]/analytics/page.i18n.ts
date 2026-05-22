import type { Locale } from "@/lib/locale"

export const translations: Record<
  Locale,
  {
    heading: string
    enrolled: string
    avgLessonsCompleted: string
    completionRate: string
    avgCompletionTime: string
    days: string
    noData: string
    heatmapTitle: string
    dropoffTitle: string
    lessonColumn: string
    completionsColumn: string
    dropoffColumn: string
    finishers: string
    of: string
  }
> = {
  en: {
    heading: "Course Analytics",
    enrolled: "Enrolled",
    avgLessonsCompleted: "Avg. lessons done",
    completionRate: "Completion rate",
    avgCompletionTime: "Avg. completion time",
    days: "days (finishers)",
    noData: "No data yet. Enroll students and track progress to see analytics.",
    heatmapTitle: "Lesson Engagement",
    dropoffTitle: "Drop-off by Lesson",
    lessonColumn: "Lesson",
    completionsColumn: "Completions",
    dropoffColumn: "Drop-off",
    finishers: "finishers",
    of: "of",
  },
  pt: {
    heading: "Análise do Curso",
    enrolled: "Matriculados",
    avgLessonsCompleted: "Média de aulas concluídas",
    completionRate: "Taxa de conclusão",
    avgCompletionTime: "Tempo médio de conclusão",
    days: "dias (concluídos)",
    noData: "Sem dados ainda. Matricule alunos e registre o progresso para ver análises.",
    heatmapTitle: "Engajamento por Aula",
    dropoffTitle: "Abandono por Aula",
    lessonColumn: "Aula",
    completionsColumn: "Conclusões",
    dropoffColumn: "Abandono",
    finishers: "concluíram",
    of: "de",
  },
  es: {
    heading: "Análisis del Curso",
    enrolled: "Matriculados",
    avgLessonsCompleted: "Promedio de lecciones hechas",
    completionRate: "Tasa de finalización",
    avgCompletionTime: "Tiempo promedio de finalización",
    days: "días (finalizadores)",
    noData: "Sin datos aún. Matricula estudiantes y registra el progreso para ver análisis.",
    heatmapTitle: "Participación por Lección",
    dropoffTitle: "Abandono por Lección",
    lessonColumn: "Lección",
    completionsColumn: "Finalizaciones",
    dropoffColumn: "Abandono",
    finishers: "finalizaron",
    of: "de",
  },
}
