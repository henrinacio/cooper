import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  export: string
  exporting: string
  error: string
}> = {
  en: {
    export: "Export",
    exporting: "Exporting…",
    error: "Failed to export course.",
  },
  pt: {
    export: "Exportar",
    exporting: "Exportando…",
    error: "Falha ao exportar o curso.",
  },
  es: {
    export: "Exportar",
    exporting: "Exportando…",
    error: "Error al exportar el curso.",
  },
}
