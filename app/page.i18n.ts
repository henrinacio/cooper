import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  headline: string
  headlineHighlight: string
  description: string
  getStarted: string
  curriculumTitle: string
  curriculumBody: string
  progressTitle: string
  progressBody: string
  accessTitle: string
  accessBody: string
  about: string
}> = {
  en: {
    headline: "Learn anything.",
    headlineHighlight: "At your own pace.",
    description: "Cooper is a private learning platform. Instructors curate courses and invite students — so every learner gets a focused, distraction-free experience.",
    getStarted: "Get started",
    curriculumTitle: "Structured curriculum",
    curriculumBody: "Courses are organized into modules and lessons so you always know what comes next.",
    progressTitle: "Progress tracking",
    progressBody: "Mark lessons complete and see exactly how far you've come in each course.",
    accessTitle: "Invite-only access",
    accessBody: "Instructors hand-pick their students, keeping every cohort focused and high quality.",
    about: "About",
  },
  pt: {
    headline: "Aprenda qualquer coisa.",
    headlineHighlight: "No seu próprio ritmo.",
    description: "Cooper é uma plataforma de aprendizado privada. Instrutores organizam cursos e convidam alunos — para que cada aluno tenha uma experiência focada e sem distrações.",
    getStarted: "Começar",
    curriculumTitle: "Currículo estruturado",
    curriculumBody: "Os cursos são organizados em módulos e aulas para que você sempre saiba o que vem a seguir.",
    progressTitle: "Acompanhamento de progresso",
    progressBody: "Marque as aulas como concluídas e veja exatamente o quanto você avançou em cada curso.",
    accessTitle: "Acesso por convite",
    accessBody: "Os instrutores escolhem seus alunos a dedo, mantendo cada turma focada e de alta qualidade.",
    about: "Sobre",
  },
  es: {
    headline: "Aprende cualquier cosa.",
    headlineHighlight: "A tu propio ritmo.",
    description: "Cooper es una plataforma de aprendizaje privada. Los instructores organizan cursos e invitan a los estudiantes — para que cada alumno tenga una experiencia enfocada y sin distracciones.",
    getStarted: "Empezar",
    curriculumTitle: "Plan de estudios estructurado",
    curriculumBody: "Los cursos están organizados en módulos y lecciones para que siempre sepas qué viene a continuación.",
    progressTitle: "Seguimiento del progreso",
    progressBody: "Marca las lecciones como completadas y ve exactamente cuánto has avanzado en cada curso.",
    accessTitle: "Acceso solo por invitación",
    accessBody: "Los instructores eligen a sus alumnos, manteniendo cada grupo enfocado y de alta calidad.",
    about: "Acerca de",
  },
}
