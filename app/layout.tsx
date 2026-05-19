import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import { LocaleWrapper } from "./_locale-wrapper"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: { default: "Cooper", template: "%s | Cooper" },
  description: "Cooper — Learn anything, at your own pace.",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <LocaleWrapper>{children}</LocaleWrapper>
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
