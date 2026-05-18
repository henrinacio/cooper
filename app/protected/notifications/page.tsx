import { UnderConstruction } from "@/components/under-construction"
import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"

export default async function NotificationsPage() {
  const locale = await getLocale()
  const t = translations[locale]

  return (
    <>
      <UnderConstruction message={t.comingSoon} />
    </>
  )
}
