import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missig email or password' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user) {
            return NextResponse.json({ error: 'User exists!' }, { status: 400 })
        }

        const pwdHash = await bcrypt.hash(password, 12)

        const newUser = await prisma.user.create({
            data: {
                email,
                password: pwdHash,
                categories: {
                    create: [
                        { name: 'Personal', isDefault: true },
                        { name: 'Work', isDefault: true },
                        { name: 'Travel', isDefault: true },
                    ]
                }
            }
        })

        return NextResponse.json({
            message: 'User created successfully', userId: newUser.id
        })
    } catch (e) {
        return NextResponse.json(
            { error: 'Internal server error' }, { status: 500 }
        )
    }
}