import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { enforceRoleAccess, UserRole } from '@/lib/access-control'

export async function GET() {
    const session = await getServerSession(authOptions)

    const { error } = await enforceRoleAccess({ allowedRoles: [UserRole.ADMIN] })

    if (error) return NextResponse.json({ error }, { status: 401 })

    // Require admin role
    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        )
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    })

    return NextResponse.json(users)
}