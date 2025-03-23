import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

// Usage in API route:
// export async function POST(req: Request) {
//   const { error } = await enforceRoleAccess({ allowedRoles: [UserRole.ADMIN] })
//   if (error) return NextResponse.json({ error }, { status: 401 })
  
  // Continue with admin operation
// }