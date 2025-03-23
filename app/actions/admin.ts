'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function updateUserRole(userId: string, role: 'ADMIN' | 'USER') {
    const session = await getServerSession(authOptions)
    const currentUser = await prisma.user.findUnique({
        where: { id: session?.user.id }
    })

    if (currentUser?.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    return prisma.user.update({
        where: { id: userId },
        data: { role }
    })
}