import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { format, parseISO } from 'date-fns'

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
            },
            sentiment: {
                isNot: null
            }
        },
        include: {
            sentiment: true
        }
    })

    const monthlyData = entries.reduce((acc, entry) => {
        if (!entry.sentiment) return acc
        const month = format(parseISO(entry.date.toISOString()), 'MMM')
        acc[month] = acc[month] || { sum: 0, count: 0 }
        acc[month].sum += entry.sentiment.score
        acc[month].count++
        return acc
    }, {} as Record<string, { sum: number; count: number }>)

    const data = Object.entries(monthlyData).map(([month, values]) => ({
        month,
        score: Number((values.sum / values.count).toFixed(2))
    }))

    // Ensure all months are present
    const allMonths = Array.from({ length: 12 }, (_, i) =>
        format(new Date(Number(year), i, 1), 'MMM')
    )

    const completeData = allMonths.map(month => ({
        month,
        score: data.find(d => d.month === month)?.score || 0
    }))

    return NextResponse.json(completeData, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}