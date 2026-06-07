import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'
import { unstable_cache } from 'next/cache'
import { env } from '@/config/env'

const COOKIE_NAME   = 'dm_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export const ADMIN_CONFIG_CACHE_TAG = 'admin-config'

type AdminConfig = {
  passwordHash: string
  passwordSalt: string
}

// ── Sanity helpers ────────────────────────────────────────────────────────────

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = env.NEXT_PUBLIC_SANITY_DATASET
const TOKEN      = env.SANITY_API_TOKEN

async function fetchAdminConfig(): Promise<AdminConfig | null> {
  try {
    const query = encodeURIComponent(`*[_type == "adminConfig"][0]{ passwordHash, passwordSalt }`)
    const res = await fetch(
      `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=${query}`,
      { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' },
    )
    const data = await res.json() as { result: AdminConfig | null }
    return data.result?.passwordHash ? data.result : null
  } catch {
    return null
  }
}

// 5-minute cache — busted immediately on password change via revalidateTag
const getCachedAdminConfig = unstable_cache(
  fetchAdminConfig,
  ['admin-config'],
  { revalidate: 300, tags: [ADMIN_CONFIG_CACHE_TAG] },
)

// ── Password hashing ──────────────────────────────────────────────────────────

/** Generate a cryptographically random 32-char salt */
export function generateSalt(): string {
  return randomBytes(16).toString('hex')
}

/** SHA-256 of `salt:password` */
export function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex')
}

// ── Session token ─────────────────────────────────────────────────────────────
// The session token is derived from the "session secret", which is either:
//   - The stored password hash in Sanity (if a custom password has been set)
//   - The ADMIN_PASSWORD env var (factory default / fallback)
//
// This guarantees that changing the password changes the token, which
// immediately invalidates all existing sessions without needing a token store.

async function getSessionSecret(): Promise<string> {
  const config = await getCachedAdminConfig()
  return config?.passwordHash ?? env.ADMIN_PASSWORD
}

async function generateToken(): Promise<string> {
  const secret = await getSessionSecret()
  return createHash('sha256').update(`dm-admin-${secret}-session`).digest('hex')
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns true if the given password matches the active credential */
export async function verifyPassword(password: string): Promise<boolean> {
  const config = await getCachedAdminConfig()
  if (config) {
    return hashPassword(password, config.passwordSalt) === config.passwordHash
  }
  // Fall back to env var (no custom password has been set yet)
  return password === env.ADMIN_PASSWORD
}

/** Create an admin session by setting a cookie */
export async function createSession(): Promise<void> {
  const token = await generateToken()
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
  const token = await generateToken()
  return sessionCookie.value === token
}
