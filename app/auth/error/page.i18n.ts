import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  title: string
  codeError: string
  unspecified: string
}> = {
  en: {
    title: "Sorry, something went wrong.",
    codeError: "Code error:",
    unspecified: "An unspecified error occurred.",
  },
  pt: {
    title: "Desculpe, algo deu errado.",
    codeError: "Erro:",
    unspecified: "Um erro não especificado ocorreu.",
  },
  es: {
    title: "Lo sentimos, algo salió mal.",
    codeError: "Error:",
    unspecified: "Ocurrió un error no especificado.",
  },
}
