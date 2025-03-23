import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const session = await getServerSession(authOptions)
    const userId = searchParams.get('userId') || session?.user?.id


    const entries = await prisma.journalEntry.findMany({
        where: { userId: userId || '' },
        include: { categories: true, sentiment: true }
    })

    const categoryData = entries.reduce((acc, entry) => {
        entry.categories.forEach(category => {
            acc[category.name] = acc[category.name] || { sum: 0, count: 0 }
            if (entry.sentiment?.score) {
                acc[category.name].sum += entry.sentiment.score
                acc[category.name].count++
            }
        })
        return acc
    }, {} as Record<string, { sum: number; count: number }>)

    const data = Object.entries(categoryData).map(([name, stats]) => ({
        name,
        score: Number((stats.sum / stats.count).toFixed(2))
    }))

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}