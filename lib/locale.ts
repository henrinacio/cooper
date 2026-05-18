import { cookies } from "next/headers"

export type Locale = "en" | "pt" | "es"

const VALID: Locale[] = ["en", "pt", "es"]

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const val = store.get("NEXT_LOCALE")?.value
  return val && (VALID as string[]).includes(val) ? (val as Locale) : "en"
}
