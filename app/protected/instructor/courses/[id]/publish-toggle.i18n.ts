import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, { unpublish: string; publish: string }> = {
  en: { unpublish: "Unpublish", publish: "Publish" },
  pt: { unpublish: "Despublicar", publish: "Publicar" },
  es: { unpublish: "Despublicar", publish: "Publicar" },
}
