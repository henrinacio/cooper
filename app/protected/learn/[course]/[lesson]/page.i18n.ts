import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  backToCourse: string
  previewMode: string
  submitQuiz: string
  score: string
  correct: string
  incorrect: string
  openEnded: string
  retake: string
}> = {
  en: {
    backToCourse: "Back to course",
    previewMode: "Preview Mode",
    submitQuiz: "Submit",
    score: "Score",
    correct: "Correct",
    incorrect: "Incorrect",
    openEnded: "Reflect on this question — no graded answer.",
    retake: "Retake",
  },
  pt: {
    backToCourse: "Voltar ao curso",
    previewMode: "Modo Visualização",
    submitQuiz: "Enviar",
    score: "Pontuação",
    correct: "Correto",
    incorrect: "Incorreto",
    openEnded: "Reflita sobre esta questão — sem resposta avaliada.",
    retake: "Tentar novamente",
  },
  es: {
    backToCourse: "Volver al curso",
    previewMode: "Modo vista previa",
    submitQuiz: "Enviar",
    score: "Puntuación",
    correct: "Correcto",
    incorrect: "Incorrecto",
    openEnded: "Reflexiona sobre esta pregunta — sin respuesta calificada.",
    retake: "Reintentar",
  },
}
