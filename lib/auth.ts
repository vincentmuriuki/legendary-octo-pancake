import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'


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
                
            }
        })
    ]
})