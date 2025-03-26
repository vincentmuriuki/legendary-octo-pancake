import { PrismaClient } from "@prisma/client"

jest.mock('@/lib/prisma', () => {
    const original = jest.requireActual('@prisma/client')
    return {
        ...original,
        PrismaClient: jest.fn(() => ({
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn()
            }
        }))
    }
})

export const mockPrisma = prisma as jest.Mocked<PrismaClient>