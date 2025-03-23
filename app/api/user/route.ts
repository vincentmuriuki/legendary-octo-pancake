import { authOptions } from '@/lib/auth'
import Prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url)
        const session = await getServerSession(authOptions)
        const userId: any = searchParams.get('userId') || session?.user.id;
        
        const user = await Prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                twoFactorEnabled: true
            }
        })

        return Response.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}


export async function PUT(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()

        console.log('body', body)

        const { searchParams } = new URL(request.url)
        const { name } = body;

        // update user
        await Prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name
            }
        })

        return NextResponse.json({ message: 'User updated' }, { status: 200 })

    } catch (error: any) {
        console.log('e.message', error.message)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }

}