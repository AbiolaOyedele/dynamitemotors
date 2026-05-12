import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import { env } from '@/config/env'

const COOKIE_NAME = 'dm_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

function generateToken(): string {
  return createHash('sha256').update(`dm-admin-${env.ADMIN_PASSWORD}-session`).digest('hex')
}

export function verifyPassword(password: string): boolean {
  return password === env.ADMIN_PASSWORD
}

/** Create an admin session by setting a cookie */
export async function createSession(): Promise<void> {
  const token = generateToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // NODE_ENV is a Next.js built-in, not a secret
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/** Destroy the admin session */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/** Check if the current request has a valid admin session */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)
  if (!sessionCookie) return false
  return sessionCookie.value === generateToken()
}
