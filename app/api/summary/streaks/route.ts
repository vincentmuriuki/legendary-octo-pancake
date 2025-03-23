// src/app/api/summary/streaks/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { eachDayOfInterval, isSameDay, subDays } from 'date-fns'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const session = await getServerSession(authOptions)
    const userId = searchParams.get('userId') || session?.user.id

    const entries = await prisma.journalEntry.findMany({
        where: { userId: userId || '' },
        select: { date: true }
    })

    const dates = entries.map(e => e.date.toISOString().split('T')[0])

    let currentStreak = 0
    let longestStreak = 0
    let currentRun = 0
    const today = new Date()

    eachDayOfInterval({ start: subDays(today, 365), end: today }).reverse()
        .forEach(day => {
            const dateStr = day.toISOString().split('T')[0]
            if (dates.includes(dateStr)) {
                currentRun++
                longestStreak = Math.max(longestStreak, currentRun)
                currentStreak = currentRun
            } else {
                currentRun = 0
            }
        })

    return NextResponse.json({
        currentStreak,
        longestStreak
    }, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}