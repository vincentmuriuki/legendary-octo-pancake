import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function seedDefaultCategories(userId: string) {
    Promise.all([
        await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@journal.com',
                name: 'Admin User',
                role: 'ADMIN',
                password: await bcrypt.hash('securepassword', 12)
            }
        }),
        await prisma.category.createMany({
            data: [
                { name: "Personal", isDefault: true, userId },
                { name: "Work", isDefault: true, userId },
                { name: "Travel", isDefault: true, userId },
            ],
        })
    ])
}
