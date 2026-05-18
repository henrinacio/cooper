import Link from "next/link"
import { Button } from "./ui/button"
import { createClient } from "@/lib/supabase/server"
import { getLocale } from "@/lib/locale"
import { translations } from "./auth-button.i18n"

export async function AuthButton() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  const userName = data?.claims.user_metadata?.full_name.split(' ')[0]

  const locale = await getLocale()
  const t = translations[locale]

  return user ? (
    <div className="flex items-center gap-4">
      {t.greeting.replace("{name}", userName ?? "")}
    </div>
  ) : (
    <Button asChild size="sm" variant={"default"}>
      <Link href="/auth/login">{t.signIn}</Link>
    </Button>
  )
}
