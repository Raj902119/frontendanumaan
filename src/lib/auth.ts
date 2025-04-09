import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

export async function getUserFromToken(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string }
    return await prisma.user.findUnique({ where: { id: decoded.id } })
  } catch {
    return null
  }
} 