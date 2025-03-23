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
        include: { categories: true }
    })

    const categoryData = entries.reduce((acc, entry) => {
        const wordCount = entry.content.split(/\s+/).length
        entry.categories.forEach(category => {
            acc[category.name] = acc[category.name] || { total: 0, count: 0 }
            acc[category.name].total += wordCount
            acc[category.name].count++
        })
        return acc
    }, {} as Record<string, { total: number; count: number }>)

    const data = Object.entries(categoryData).map(([name, stats]) => ({
        name,
        average: Math.round(stats.total / stats.count)
    }))

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}