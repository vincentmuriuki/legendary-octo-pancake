import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getWeek, parseISO } from 'date-fns'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const year = searchParams.get('year') || new Date().getFullYear()

    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: userId || '',
            date: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${Number(year) + 1}-01-01`)
            }
        },
        select: {
            content: true,
            date: true
        }
    })

    const weeklyData = entries.reduce((acc, entry) => {
        const weekNumber = getWeek(parseISO(entry.date.toISOString()))
        const weekKey = `Week ${weekNumber}`
        acc[weekKey] = (acc[weekKey] || 0) + entry.content.split(/\s+/).length
        return acc
    }, {} as Record<string, number>)

    const data = Object.entries(weeklyData).map(([week, count]) => ({
        week,
        count: Math.round(count / 7) // Average daily words
    }))

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}