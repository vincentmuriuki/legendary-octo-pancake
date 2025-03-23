import { authenticator } from 'otplib'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const { code, secret } = await req.json()

    const isValid = authenticator.verify({
        token: code,
        secret
    })

    if (!isValid) {
        return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () =>
        Math.random().toString(36).slice(2, 10).toUpperCase()
    )

    await prisma.user.update({
        where: { id: session?.user.id },
        data: {
            twoFactorEnabled: true,
            twoFactorSecret: secret,
            backupCodes: backupCodes.map(bc => bc)
        }
    })

    return NextResponse.json({ backupCodes })
}