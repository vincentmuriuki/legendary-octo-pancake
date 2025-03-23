'use client'

import { UsersTable } from '@/components/admin/UsersTable'
import { useAdminUsers } from '@/app/hooks/useAdminUsers'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminUsersPage() {
  const { users, isLoading, error } = useAdminUsers()

  if (error) return <div>Error loading users: {error.message}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  )
}