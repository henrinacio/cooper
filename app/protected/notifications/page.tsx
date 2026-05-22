import { getLocale } from "@/lib/locale"
import { translations } from "./page.i18n"
import { getNotifications, markAllAsRead, markAsRead, deleteAllNotifications } from "@/lib/notifications/actions"
import { Bell } from "lucide-react"
import { ConfirmButton } from "./confirm-button"
import { Button } from "@/components/ui/button"
import { cn, LOCALE_LANGUAGE } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import type { NotificationType } from "@/lib/supabase/types"

function formatMetadata(type: string, metadata: Record<string, unknown>, typeLabels: Record<string, string>, actorName: string | null | undefined, localeLanguage: string): string {
  if (type === "class_scheduled") {
    const title = metadata.sessionTitle as string | undefined
    const at = metadata.scheduledAt as string | undefined
    if (title && at) {
      const date = new Date(at).toLocaleDateString(localeLanguage, { dateStyle: "medium" })
      const instructorSuffix = actorName ? ` · ${actorName}` : ""
      return `"${title}" — ${date}${instructorSuffix}`
    }
  }

  if (type === "class_confirmed") {
    const title = metadata.sessionTitle as string | undefined
    const at = metadata.scheduledAt as string | undefined
    if (title && at) {
      const date = new Date(at).toLocaleDateString(localeLanguage, { dateStyle: "medium" })
      const time = new Date(at).toLocaleTimeString(localeLanguage, { timeStyle: "short" })
      const studentSuffix = actorName ? ` · ${actorName}` : ""
      return `"${title}" — ${date} ${time}${studentSuffix}`
    }
  }

  if (type === "class_cancelled") {
    const title = metadata.sessionTitle as string | undefined
    const at = metadata.scheduledAt as string | undefined
    if (title && at) {
      const date = new Date(at).toLocaleDateString(localeLanguage, { dateStyle: "medium" })
      const instructorSuffix = actorName ? ` · ${actorName}` : ""
      return `"${title}" — ${date}${instructorSuffix}`
    }
  }

  if (type === "course_enrolled" || type === "course_completed") {
    const title = metadata.courseTitle as string | undefined
    const studentName = actorName ? ` · ${actorName}` : ""
    if (title) {
      return `"${title}" ${studentName}`
    }
  }

  return typeLabels[type as NotificationType] ?? typeLabels.unknown
}

export default async function NotificationsPage() {
  const locale = await getLocale()
  const t = translations[locale]
  const { notifications } = await getNotifications()
  const localeLanguage = LOCALE_LANGUAGE[locale] ?? "en"

  const typeLabels: Record<string, string> = {
    class_scheduled: t.classScheduled,
    class_confirmed: t.classConfirmed,
    class_cancelled: t.classCancelled,
    course_enrolled: t.courseEnrolled,
    course_completed: t.courseCompleted,
    unknown: t.unknown,
  }

  const hasUnread = notifications.some((notification) => !notification.read)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <form
              action={async () => {
                "use server"
                await markAllAsRead()
                revalidatePath("/protected/notifications")
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                {t.markAllRead}
              </Button>
            </form>
          )}
          {notifications.length > 0 && (
            <form
              action={async () => {
                "use server"
                await deleteAllNotifications()
                revalidatePath("/protected/notifications")
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                {t.clearHistory}
              </Button>
            </form>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Bell size={40} strokeWidth={1.25} />
          <p>{t.empty}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {notifications.map((notification) => {
            const metadata = notification.metadata as Record<string, unknown>
            const actorName = (notification.actor as { full_name: string | null } | null)?.full_name
            const detail = formatMetadata(notification.type, metadata, typeLabels, actorName, localeLanguage)
            const label = typeLabels[notification.type as NotificationType] ?? typeLabels.unknown

            return (
              <li
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-4 py-3 transition-colors",
                  notification.read ? "bg-background" : "bg-accent/50"
                )}
              >
                <Bell size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <p className={cn("text-sm", !notification.read && "font-medium")}>{label}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString(localeLanguage, { dateStyle: "medium" })}
                  </p>
                  {notification.type === "class_scheduled" && !!metadata.sessionId && (
                    metadata.confirmed
                      ? <span className="text-xs text-muted-foreground mt-1">{t.confirmed}</span>
                      : <ConfirmButton
                          sessionId={metadata.sessionId as string}
                          labelConfirm={t.confirmClass}
                          labelConfirmed={t.confirmed}
                        />
                  )}
                </div>
                {!notification.read && (
                  <form
                    action={async () => {
                      "use server"
                      await markAsRead(notification.id)
                      revalidatePath("/protected/notifications")
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                    >
                      ✕
                    </button>
                  </form>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
