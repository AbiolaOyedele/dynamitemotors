import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/lib/admin-auth'
import { readContent, writeContent } from '@/lib/content'

// Map each section to the pages it affects
const SECTION_PATHS: Record<string, string[]> = {
  hero:         ['/', '/dynamite'],
  services:     ['/', '/services', '/dynamite/services'],
  testimonials: ['/', '/dynamite/testimonials'],
  offers:       ['/', '/offers', '/dynamite/offers'],
  stats:        ['/', '/dynamite/stats'],
  gallery:      ['/', '/dynamite/gallery'],
  process:      ['/', '/dynamite/process'],
  settings:     ['/', '/services', '/contact', '/about', '/dynamite/settings'],
}

const VALID_SECTIONS = ['hero', 'services', 'testimonials', 'offers', 'stats', 'settings', 'gallery', 'process'] as const
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

    // Bust Next.js cache for every page this section affects
    const paths = SECTION_PATHS[section] ?? ['/']
    for (const p of paths) {
      revalidatePath(p)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to write content' }, { status: 500 })
  }
}
