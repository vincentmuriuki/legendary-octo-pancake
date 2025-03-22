import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const cursor = searchParams.get('cursor')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const limit = 9

  const where: any = { userId }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (category) {
    where.categories = { some: { id: category } }
  }

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  }

  const entries = await prisma.journalEntry.findMany({
    where,
    include: { categories: true, sentiment: true },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { date: 'desc' }
  })

  const hasNextPage = entries.length > limit
  const data = entries.slice(0, limit)

  return NextResponse.json({
    data,
    nextCursor: hasNextPage ? data[data.length - 1]?.id : null
  })
}

export async function POST(request: Request) {
  const { title, content, date, userId, categoryIds } = await request.json()

  const entry = await prisma.journalEntry.create({
    data: {
      title,
      content,
      date: new Date(date),
      categories: {
        connect: categoryIds.map((id: string) => ({ id }))
      },
      user: {
        connect: { id: userId }
      }
    }
  })

  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aianalysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId: entry.id, content })
  })
    .catch((error) => {
      console.error('Failed to trigger sentiment analysis:', error);
    });

  return NextResponse.json(entry)
}