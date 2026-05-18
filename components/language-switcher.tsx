"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { setLocale } from "@/lib/set-locale"
import type { Locale } from "@/lib/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const locale = useLocale()

  async function handleChange(code: Locale) {
    await setLocale(code)
    router.refresh()
  }

  const current = LOCALES.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Globe size={16} />
          <span className="text-xs">{current?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleChange(code)}
            className={code === locale ? "font-medium" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
