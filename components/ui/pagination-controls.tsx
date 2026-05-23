import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  prevHref: string | null
  nextHref: string | null
}

export function PaginationControls({
  currentPage,
  totalPages,
  prevHref,
  nextHref,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {prevHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={prevHref}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
        {nextHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={nextHref}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
