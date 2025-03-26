import { seedDefaultCategories } from '../../lib/seed'
import prisma from '../../lib/prisma'

jest.mock('../../lib/prisma', () => ({
    user: {
        upsert: jest.fn(),
    },
    category: {
        createMany: jest.fn(),
    },
}))

describe('Database Seed', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('creates default categories and admin user', async () => {
        const userId = 'test-user-id'

        await seedDefaultCategories(userId)

        expect(prisma.user.upsert).toHaveBeenCalledWith({
            where: { email: 'admin@journal.com' },
            update: {},
            create: expect.objectContaining({
                email: 'admin@journal.com',
                role: 'ADMIN',
            }),
        })

        expect(prisma.category.createMany).toHaveBeenCalledWith({
            data: expect.arrayContaining([
                { name: 'Personal', isDefault: true, userId },
                { name: 'Work', isDefault: true, userId },
                { name: 'Travel', isDefault: true, userId },
            ]),
        })
    })
})