import { HardHat } from "lucide-react"
import { cn } from "@/lib/utils"

interface UnderConstructionProps {
  message?: string;
  className?: string;
}

export function UnderConstruction({
  message = "This page is under construction. Some features may not be available yet.",
  className,
}: UnderConstructionProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
        className,
      )}
    >
      <HardHat size={16} className="mt-0.5 shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
