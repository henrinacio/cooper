"use server"

import { cookies } from "next/headers"
import type { Locale } from "./locale"

const VALID = ["en", "pt", "es"]

export async function setLocale(locale: Locale) {
  if (!VALID.includes(locale)) return
  const store = await cookies()
  store.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" })
}
