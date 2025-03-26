import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import bcrypt from "bcryptjs";

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing email or password' },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            return NextResponse.json({ error: 'User exists!' }, { status: 400 });
        }

        const pwdHash = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: pwdHash,
                categories: {
                    create: [
                        { name: 'Personal', isDefault: true },
                        { name: 'Work', isDefault: true },
                        { name: 'Travel', isDefault: true },
                    ],
                },
            },
        });

        return NextResponse.json({
            message: 'User created successfully', userId: newUser.id,
        }, { status: 201 });
    } catch (e: any) {
        console.error('Error creating user', e.message);
        return NextResponse.json(
            { error: 'Internal server error', details: e.message },
            { status: 500 }
        );
    }
}