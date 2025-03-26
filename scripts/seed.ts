import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

export async function seedDefaultCategories() {
  // Upsert admin user and get their ID
  const user = await prisma.user.upsert({
    where: { email: 'admin@journal.com' },
    update: {}, // Prevent updates if user exists
    create: {
      email: 'admin@journal.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: await bcrypt.hash('securepassword', 12)
    }
  })

  // Check if default categories already exist for this user
  const existingCategories = await prisma.category.findMany({
    where: {
      userId: user.id,
      isDefault: true
    }
  })

  // Only create categories if they don't exist
  if (existingCategories.length === 0) {
    await prisma.category.createMany({
      data: [
        { name: "Personal", isDefault: true, userId: user.id },
        { name: "Work", isDefault: true, userId: user.id },
        { name: "Travel", isDefault: true, userId: user.id },
      ]
    })
  }
}