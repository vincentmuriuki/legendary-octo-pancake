
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { title, content, date, categoryIds } = await request.json()
        const { id } = await params;

        const updatedEntry = await prisma.journalEntry.update({
            where: { id: id },
            data: {
                title,
                content,
                date: new Date(date),
                categories: {
                    set: categoryIds.map((id: string) => ({ id }))
                }
            },
            include: { categories: true }
        })

        // Update sentiment analysis if content changed
        if (content !== updatedEntry.content) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aianalysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entryId: updatedEntry.id, content })
            })
                .catch((error) => {
                    console.error('Failed to trigger sentiment analysis:', error);
                });
        }

        return NextResponse.json(updatedEntry)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update entry' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.journalEntry.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ 'message': 'Entry deleted' })
    } catch (error) {

    }
}