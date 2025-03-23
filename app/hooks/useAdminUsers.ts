'use client'

import { useEffect, useState } from 'react'
import { User } from '@prisma/client'

export function useAdminUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/users')
                if (!response.ok) throw new Error('Failed to fetch users')
                const data = await response.json()
                setUsers(data)
            } catch (err) {
                console.error('Error fetching users:', err)
                setError(err as Error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return { users, isLoading, error }
}