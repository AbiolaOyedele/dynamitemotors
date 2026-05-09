import { cookies } from 'next/headers'
import { createHash } from 'crypto'

const COOKIE_NAME = 'dm_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'dynamite2025'
}

/** Generate a session token from the admin password */
function generateToken(): string {
  const password = getAdminPassword()
  return createHash('sha256').update(`dm-admin-${password}-session`).digest('hex')
}

/** Check if the provided password matches the admin password */
export function verifyPassword(password: string): boolean {
  return password === getAdminPassword()
}

/** Create an admin session by setting a cookie */
export async function createSession(): Promise<void> {
  const token = generateToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
