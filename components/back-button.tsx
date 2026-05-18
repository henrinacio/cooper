import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getLocale } from "@/lib/locale"
import { translations } from "./back-button.i18n"

interface Props {
  href: string
}

export async function BackButton({ href }: Props) {
  const locale = await getLocale()
  const t = translations[locale]

  return (
    <Button variant="ghost" size="sm" className="w-fit" asChild>
      <Link href={href}>
        <ArrowLeft size={14} />
        {t.back}
      </Link>
    </Button>
  )
}
