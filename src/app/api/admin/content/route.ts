import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readContent, writeContent } from '@/lib/content'

const VALID_SECTIONS = ['hero', 'services', 'testimonials', 'offers', 'stats', 'settings'] as const
type Section = (typeof VALID_SECTIONS)[number]

function isValidSection(s: string): s is Section {
  return (VALID_SECTIONS as readonly string[]).includes(s)
}

/** GET /api/admin/content?section=hero */
export async function GET(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const section = request.nextUrl.searchParams.get('section')
  if (!section || !isValidSection(section)) {
    return NextResponse.json(
      { error: `Invalid section. Valid: ${VALID_SECTIONS.join(', ')}` },
      { status: 400 },
    )
  }

  try {
    const data = readContent(section)
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
  }
}

/** PUT /api/admin/content?section=hero */
export async function PUT(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const section = request.nextUrl.searchParams.get('section')
  if (!section || !isValidSection(section)) {
    return NextResponse.json(
      { error: `Invalid section. Valid: ${VALID_SECTIONS.join(', ')}` },
      { status: 400 },
    )
  }

  try {
    const body = await request.json()
    writeContent(section, body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to write content' }, { status: 500 })
  }
}
