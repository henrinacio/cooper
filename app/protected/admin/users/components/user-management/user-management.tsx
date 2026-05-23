import { createAdminClient } from "@/lib/supabase/admin"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserRoleSelect } from "./components/user-role-select/user-role-select"
import { DeactivateButton } from "./components/deactivate-button/deactivate-button"
import { UserSearchInput } from "./components/user-search-input/user-search-input"
import { PaginationControls } from "@/components/ui/pagination-controls"

type UserRole = "student" | "instructor" | "admin"

const PAGE_SIZE = 5

export async function UserManagement({
  searchQuery,
  page,
}: {
  searchQuery: string
  page: number
}) {
  const adminClient = createAdminClient()
  const normalizedQuery = searchQuery.toLowerCase().trim()

  const authUsersResult = await adminClient.auth.admin.listUsers({ perPage: 1000 })
  const authUserMap = new Map(
    authUsersResult.data.users.map((authUser) => [authUser.id, authUser]),
  )

  let paginatedProfiles: { id: string; full_name: string | null; role: string | null; created_at: string }[]
  let totalCount: number

  if (normalizedQuery) {
    const profilesResult = await adminClient
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false })

    const allProfiles = profilesResult.data ?? []

    const filteredProfiles = allProfiles.filter((profile) => {
      const authUser = authUserMap.get(profile.id)
      const nameMatches = profile.full_name?.toLowerCase().includes(normalizedQuery)
      const emailMatches = authUser?.email?.toLowerCase().includes(normalizedQuery)
      return nameMatches || emailMatches
    })

    totalCount = filteredProfiles.length
    const startIndex = (page - 1) * PAGE_SIZE
    paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + PAGE_SIZE)
  } else {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const profilesResult = await adminClient
      .from("profiles")
      .select("id, full_name, role, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    paginatedProfiles = profilesResult.data ?? []
    totalCount = profilesResult.count ?? 0
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  function buildPageUrl(targetPage: number) {
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set("search", searchQuery)
    }
    params.set("page", String(targetPage))
    return `/protected/admin/users?${params.toString()}`
  }

  const prevHref = safePage > 1 ? buildPageUrl(safePage - 1) : null
  const nextHref = safePage < totalPages ? buildPageUrl(safePage + 1) : null

  return (
    <div>
      <UserSearchInput />
      <div className="flex flex-col gap-2 mt-3">
        {paginatedProfiles.length === 0 && (
          <p className="text-muted-foreground text-sm">No users found.</p>
        )}
        {paginatedProfiles.map((profile) => {
          const authUser = authUserMap.get(profile.id)
          const email = authUser?.email ?? "—"
          const isBanned = !!authUser?.banned_until

          return (
            <Card
              key={profile.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-medium truncate">
                  {profile.full_name ?? "Unnamed"}
                </p>
                <p className="text-sm text-muted-foreground truncate">{email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {isBanned && (
                  <Badge variant="destructive">Deactivated</Badge>
                )}
                <UserRoleSelect
                  userId={profile.id}
                  currentRole={(profile.role as UserRole) ?? "student"}
                />
                <DeactivateButton userId={profile.id} isBanned={isBanned} />
              </div>
            </Card>
          )
        })}
      </div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={safePage}
          totalPages={totalPages}
          prevHref={prevHref}
          nextHref={nextHref}
        />
      )}
    </div>
  )
}
