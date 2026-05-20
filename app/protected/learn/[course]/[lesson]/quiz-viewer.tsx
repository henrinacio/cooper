"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface QuizQuestion {
  question: string
  options?: string[]
  answer?: number
}

interface QuizTranslations {
  submitQuiz: string
  score: string
  correct: string
  incorrect: string
  openEnded: string
  retake: string
}

interface Props {
  content: string
  t: QuizTranslations
}

function parseQuiz(content: string): QuizQuestion[] | null {
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as QuizQuestion[]
    }
    return null
  } catch {
    return null
  }
}

export function QuizViewer({ content, t }: Props) {
  const questions = parseQuiz(content)

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    () => questions ? questions.map(() => null) : []
  )
  const [submitted, setSubmitted] = useState(false)

  if (!questions) {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    )
  }

  const gradableCount = questions.filter(
    (question) => question.options && question.answer !== undefined
  ).length

  const score = questions.filter(
    (question, questionIndex) =>
      question.options &&
      question.answer !== undefined &&
      selectedAnswers[questionIndex] === question.answer
  ).length

  function handleOptionChange(questionIndex: number, optionIndex: number) {
    if (submitted) {
      return
    }
    setSelectedAnswers((previous) =>
      previous.map((answer, index) => (index === questionIndex ? optionIndex : answer))
    )
  }

  function handleRetake() {
    setSelectedAnswers(questions!.map(() => null))
    setSubmitted(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, questionIndex) => {
        const hasOptions = question.options && question.options.length > 0
        const selectedOption = selectedAnswers[questionIndex]

        return (
          <div key={questionIndex} className="flex flex-col gap-3">
            <p className="font-medium">{question.question}</p>

            {hasOptions && (
              <div className="flex flex-col gap-2">
                {question.options!.map((option, optionIndex) => {
                  const isSelected = selectedOption === optionIndex
                  const isCorrect = question.answer === optionIndex

                  let optionClassName = "flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors"

                  if (!submitted) {
                    if (isSelected) {
                      optionClassName += " border-primary bg-primary/10"
                    } else {
                      optionClassName += " border-border hover:bg-accent"
                    }
                  } else {
                    if (isCorrect) {
                      optionClassName += " border-green-500 bg-green-500/10"
                    } else if (isSelected && !isCorrect) {
                      optionClassName += " border-destructive bg-destructive/10"
                    } else {
                      optionClassName += " border-border opacity-60"
                    }
                  }

                  return (
                    <label key={optionIndex} className={optionClassName}>
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={isSelected}
                        onChange={() => handleOptionChange(questionIndex, optionIndex)}
                        disabled={submitted}
                        className="shrink-0"
                      />
                      <span className="text-sm">{option}</span>
                      {submitted && isCorrect && (
                        <span className="ml-auto text-xs text-green-600 font-medium">{t.correct}</span>
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <span className="ml-auto text-xs text-destructive font-medium">{t.incorrect}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            )}

            {!hasOptions && (
              <p className="text-sm text-muted-foreground italic">{t.openEnded}</p>
            )}
          </div>
        )
      })}

      {!submitted ? (
        <Button onClick={() => setSubmitted(true)} className="w-fit">
          {t.submitQuiz}
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          {gradableCount > 0 && (
            <p className="text-sm font-medium">
              {t.score}: {score}/{gradableCount}
            </p>
          )}
          <Button variant="outline" size="sm" onClick={handleRetake}>
            {t.retake}
          </Button>
        </div>
      )}
    </div>
  )
}
