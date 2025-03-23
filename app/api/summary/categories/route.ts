import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const entries = await prisma.journalEntry.findMany({
        where: { userId: userId || '' },
        select: { categories: true }
    })

    const categoryCounts = entries.flatMap(e => e.categories)
        .reduce((acc, category) => {
            acc[category.name] = (acc[category.name] || 0) + 1
            return acc
        }, {} as Record<string, number>)

    const data = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value
    }))

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}