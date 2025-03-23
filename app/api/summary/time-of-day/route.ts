import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const session = await getServerSession(authOptions)
    const userId = searchParams.get('userId') || session?.user.id

    const entries = await prisma.journalEntry.findMany({
        where: { userId: userId || '' },
        select: { createdAt: true }
    })

    const timeData = entries.reduce((acc, entry) => {
        const hour = new Date(entry.createdAt).getHours()
        acc[hour] = (acc[hour] || 0) + 1
        return acc
    }, {} as Record<number, number>)

    const data = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: timeData[i] || 0
    }))

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}