import { NextResponse } from 'next/server'
import { verifyPassword, createSession, destroySession } from '@/lib/admin-auth'

/** POST /api/admin/auth — Login */
export async function POST(request: Request) {
  try {
    const body = await request.json() as { password?: string }

    if (!body.password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    if (!verifyPassword(body.password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    await createSession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

/** DELETE /api/admin/auth — Logout */
export async function DELETE() {
  await destroySession()
  return NextResponse.json({ success: true })
}
