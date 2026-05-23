import { createAdminClient } from "@/lib/supabase/admin"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserRoleSelect } from "./components/user-role-select/user-role-select"
import { DeactivateButton } from "./components/deactivate-button/deactivate-button"
import { UserSearchInput } from "./components/user-search-input/user-search-input"

export async function UserManagement({ searchQuery }: { searchQuery: string }) {
  const adminClient = createAdminClient()

  const [profilesResult, authUsersResult] = await Promise.all([
    adminClient
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false }),
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const authUserMap = new Map(
    authUsersResult.data.users.map((authUser) => [authUser.id, authUser]),
  )

  const normalizedQuery = searchQuery.toLowerCase().trim()

  const allProfiles = profilesResult.data ?? []

  const filteredProfiles = normalizedQuery
    ? allProfiles.filter((profile) => {
        const authUser = authUserMap.get(profile.id)
        const nameMatches = profile.full_name?.toLowerCase().includes(normalizedQuery)
        const emailMatches = authUser?.email?.toLowerCase().includes(normalizedQuery)
        return nameMatches || emailMatches
      })
    : allProfiles

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">User Management</h2>
      <UserSearchInput />
      <div className="flex flex-col gap-2 mt-3">
        {filteredProfiles.length === 0 && (
          <p className="text-muted-foreground text-sm">No users found.</p>
        )}
        {filteredProfiles.map((profile) => {
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
                  currentRole={profile.role}
                />
                <DeactivateButton userId={profile.id} isBanned={isBanned} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
