import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stopwords } from '@/lib/stopwords'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const session = await getServerSession(authOptions)

    const userId = searchParams.get('userId') || session?.user.id

    const entries = await prisma.journalEntry.findMany({
        where: { userId: userId || '' },
        select: { content: true }
    })

    const words = entries.flatMap(entry =>
        entry.content
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopwords.includes(word)))

    const frequencyMap = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const data = Object.entries(frequencyMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([text, value]) => ({ text, value }))

    // console.log('wordcloud datatta', data)
    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}