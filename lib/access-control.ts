import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

type Options = {
  allowedRoles?: UserRole[]
}

export async function enforceRoleAccess(
  options: Options = { allowedRoles: [UserRole.USER] }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: 'Unauthenticated' }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (!user || !options.allowedRoles?.includes(user.role as UserRole)) {
    return { error: 'Unauthorized' }
  }

  return { user }
}
