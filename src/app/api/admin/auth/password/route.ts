import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import {
  isAuthenticated,
  verifyPassword,
  hashPassword,
  generateSalt,
  destroySession,
  ADMIN_CONFIG_CACHE_TAG,
} from '@/lib/admin-auth'
import { env } from '@/config/env'

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = env.NEXT_PUBLIC_SANITY_DATASET
const TOKEN      = env.SANITY_API_TOKEN
const API_BASE   = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data`

async function saveAdminConfig(passwordHash: string, passwordSalt: string): Promise<void> {
  // Check whether an adminConfig doc already exists
  const query = encodeURIComponent(`*[_type == "adminConfig"][0]{ _id }`)
  const res = await fetch(
    `${API_BASE}/query/${DATASET}?query=${query}`,
    { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' },
  )
  const data = await res.json() as { result: { _id: string } | null }
  const existingId = data.result?._id

  const mutations = existingId
    ? [{ patch: { id: existingId, set: { passwordHash, passwordSalt } } }]
    : [{ createOrReplace: { _type: 'adminConfig', passwordHash, passwordSalt } }]

  const mutRes = await fetch(`${API_BASE}/mutate/${DATASET}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })

  if (!mutRes.ok) {
    const errText = await mutRes.text()
    throw new Error(`Sanity mutation failed: ${errText}`)
  }
}

/**
 * PATCH /api/admin/auth/password
 * Changes the admin password. Requires the current password for verification.
 * Destroys the active session after a successful change — client must re-login.
 */
export async function PATCH(request: Request) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as {
      currentPassword?: string
      newPassword?: string
    }

    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are both required' },
        { status: 400 },
      )
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 },
      )
    }

    if (!await verifyPassword(body.currentPassword)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const salt = generateSalt()
    const hash = hashPassword(body.newPassword, salt)

    await saveAdminConfig(hash, salt)

    // Bust the cache so the new hash takes effect on the very next request
    revalidateTag(ADMIN_CONFIG_CACHE_TAG, 'max')

    // Destroy the current session — the token is now invalid since the hash changed
    await destroySession()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Password change error:', err)
    return NextResponse.json({ error: 'Failed to update password. Please try again.' }, { status: 500 })
  }
}
