"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./logout-button.i18n"

export function LogoutButton() {
  const router = useRouter()
  const locale = useLocale()
  const t = translations[locale]

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return <Button variant="outline" onClick={logout}>{t.logout}</Button>
}
