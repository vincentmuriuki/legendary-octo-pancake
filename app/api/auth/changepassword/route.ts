import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const { values } = await req.json()
    const { currentPassword, newPassword } = values

    // Validate input
    if (!currentPassword || !newPassword) {
        console.log('Current password and new password are required', {
            currentPassword,
            newPassword
        })
        return NextResponse.json(
            { error: 'Current password and new password are required' },
            { status: 400 }
        )
    }

    if (currentPassword === newPassword) {
        console.log('New password must be different from current password', {
            currentPassword,
            newPassword
        })
        return NextResponse.json(
            { error: 'New password must be different from current password' },
            { status: 400 }
        )
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        if (!user.password) {
            return NextResponse.json(
                { error: 'Password change not allowed for this account' },
                { status: 400 }
            )
        }

        const isValid = await bcrypt.compare(currentPassword, user.password)
        if (!isValid) {
            console.log('Current password is incorrect', {
                currentPassword,
                newPassword
            })
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Password change error:', error)
        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        )
    }
}