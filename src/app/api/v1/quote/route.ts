import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendQuoteEmail } from '@/services/email.service'
import { isAppError } from '@/lib/errors'
import { BUSINESS } from '@/config/constants'

// ── Schema (matches CLAUDE.md spec exactly) ──────────────────────────────────

const quoteSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().min(7).max(20),
  service: z.string().min(1),
  message: z.string().max(1000).optional(),
})

// ── In-memory sliding-window rate limiter ─────────────────────────────────────
// 5 requests per IP per minute.
// NOTE: replace with @upstash/ratelimit + Redis for multi-instance production.

type RateEntry = { count: number; resetAt: number }
const rateStore = new Map<string, RateEntry>()

const WINDOW_MS  = 60_000
const MAX_REQS   = 5

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now   = Date.now()
  const entry = rateStore.get(ip)

  if (!entry || now >= entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= MAX_REQS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true, retryAfter: 0 }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function errorResponse(
  status: number,
  code: string,
  message: string,
  headers?: Record<string, string>,
) {
  const init = headers ? { status, headers } : { status }
  return NextResponse.json({ error: { code, message } }, init)
}

function getIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  )
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Rate limit
  const { allowed, retryAfter } = checkRateLimit(getIp(request))
  if (!allowed) {
    return errorResponse(
      429,
      'RATE_LIMITED',
      'Too many requests. Please wait a minute before trying again.',
      { 'Retry-After': String(retryAfter) },
    )
  }

  // 2. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse(400, 'INVALID_REQUEST', 'Request body could not be read.')
  }

  // 3. Validate
  const parsed = quoteSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(
      422,
      'VALIDATION_ERROR',
      'Please check your details and try again.',
    )
  }

  // 4. Build email data — construct explicitly to satisfy exactOptionalPropertyTypes
  const { name, email, phone, service, message } = parsed.data
  const emailData = message
    ? { name, email, phone, service, message }
    : { name, email, phone, service }

  // 5. Send email
  try {
    await sendQuoteEmail(emailData)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (isAppError(error)) {
      return errorResponse(
        error.statusCode,
        error.code,
        `We couldn't send your request. Please call us on ${BUSINESS.phone}.`,
      )
    }
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      `Something went wrong on our end. Please call us on ${BUSINESS.phone}.`,
    )
  }
}
