import NextAuth, { getServerSession, NextAuthOptions } from 'next-auth'
import prisma from './prisma'

import { getServerSession as getServerSessionInner } from 'next-auth'
import bcrypt from 'bcryptjs'

import CredentialsProviderRaw from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';
const CredentialsProvider = CredentialsProviderRaw as unknown as (options: any) => any;

declare module 'next-auth/jwt' {
    interface JWT {
        id: string,
        email: string,
        name: string | null
        role: string
    }
}
declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            email?: string;
            name?: string | null;
            role?: string;
        }
    }

    interface User {
        id: string,
        email: string,
        name: string | null
        role: string
    }
}


export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                }, password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials.password) return null

                const user: any = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) return null;

                const validPwd = await bcrypt.compare(credentials.password, user.password)
                if (!validPwd) return null;
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name || '',
                    role: user.role || 'USER'
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.name = token.name
            }
            session.user.role = token.role;
            return session;
        },
    },
    pages: {
        signIn: '/login',
        newUser: '/signup'
    },
    secret: process.env.NEXTAUTH_SECRET
}

export const getServerAuthSession = () => getServerSession(authOptions);


export async function getServerSessionData() {
    return await getServerSessionInner(authOptions)
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function requireRole(
    session: any | null,
    requiredRole: any = 'USER'
) {
    if (!session?.user) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    })

    if (!user || (user.role !== requiredRole && requiredRole !== 'USER')) {
        redirect('/unauthorized')
    }
}

export function checkAdminAccess(user?: any): boolean {
    return user?.role === 'ADMIN'
}