import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const year = searchParams.get('year') || new Date().getFullYear()


    const entries: any = await prisma.journalEntry.findMany({
        where: {
            userId: userId || '',
            date: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${Number(year) + 1}-01-01`)
            }
        },
        select: { date: true }
    })


    const heatmapData = entries.reduce((acc: any, entry: any) => {
        const date = entry.date.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})


    return NextResponse.json(heatmapData, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}