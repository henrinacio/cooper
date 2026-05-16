import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url)

    // YouTube: youtube.com/watch?v=ID or youtu.be/ID
    if (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v")
        if (id) return `https://www.youtube.com/embed/${id}`
      }
      if (u.pathname.startsWith("/embed/")) return url
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    // Google Drive: /file/d/ID/view or /open?id=ID
    if (u.hostname === "drive.google.com") {
      const fileMatch = u.pathname.match(/\/file\/d\/([^/]+)/)
      if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
      const id = u.searchParams.get("id")
      if (id) return `https://drive.google.com/file/d/${id}/preview`
    }

    return url
  } catch {
    return url
  }
}
