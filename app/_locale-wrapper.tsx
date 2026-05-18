import { getLocale } from "@/lib/locale"
import { LocaleProvider } from "@/components/locale-provider"

export async function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>
}
