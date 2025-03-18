import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            email?: string;
        }
    }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
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
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) return null;

                const validPwd = await bcrypt.compare(credentials.password, user.password)
                if (!validPwd) return null;

                return {
                    id: user.id,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id && session.user) {
                session.user.id = token.id as string,
                    session.user.email = token.email as string
            }

            return session;
        }
    },
    pages: {
        signIn: '/login',
        newUser: '/signup'
    }
})