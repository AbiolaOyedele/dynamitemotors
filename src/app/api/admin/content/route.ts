import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/lib/admin-auth'
import { env } from '@/config/env'

// ── Sanity config ─────────────────────────────────────────────────────────────

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = env.NEXT_PUBLIC_SANITY_DATASET
const TOKEN      = env.SANITY_API_TOKEN
const API_BASE   = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data`

// ── Section → Sanity type mapping ────────────────────────────────────────────

type Section = 'hero' | 'services' | 'testimonials' | 'offers' | 'stats' | 'settings' | 'gallery' | 'process'

const VALID_SECTIONS: Section[] = ['hero', 'services', 'testimonials', 'offers', 'stats', 'settings', 'gallery', 'process']

// Sections with a single document (singletons) vs multiple documents
const SINGLETON_TYPES: Record<string, string> = {
  hero:     'hero',
  stats:    'stats',
  gallery:  'gallery',
  process:  'process',
  settings: 'siteSettings',
}

// Sections with multiple documents
const MULTI_TYPES: Record<string, string> = {
  services:     'service',
  testimonials: 'testimonial',
  offers:       'offer',
}

// Pages to revalidate after each section save
const SECTION_PATHS: Record<string, string[]> = {
  hero:         ['/'],
  services:     ['/', '/services'],
  testimonials: ['/'],
  offers:       ['/', '/offers'],
  stats:        ['/'],
  gallery:      ['/'],
  process:      ['/'],
  settings:     ['/', '/services', '/contact'],
}

function isValidSection(s: string): s is Section {
  return VALID_SECTIONS.includes(s as Section)
}

// ── Sanity helpers ────────────────────────────────────────────────────────────

async function sanityQuery(query: string, params: Record<string, string> = {}): Promise<unknown> {
  const encoded = encodeURIComponent(query)
  const paramStr = Object.entries(params).map(([k, v]) => `&$${k}=${encodeURIComponent(JSON.stringify(v))}`).join('')
  const res = await fetch(`${API_BASE}/query/${DATASET}?query=${encoded}${paramStr}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: 'no-store',
  })
  const data = await res.json() as { result: unknown }
  return data.result
}

async function sanityMutate(mutations: unknown[]): Promise<void> {
  await fetch(`${API_BASE}/mutate/${DATASET}?returnIds=true`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const section = request.nextUrl.searchParams.get('section')
  if (!section || !isValidSection(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  try {
    if (SINGLETON_TYPES[section]) {
      const type = SINGLETON_TYPES[section]
      const data = await sanityQuery(`*[_type == $type][0]`, { type })
      return NextResponse.json({ data: data ?? {} })
    } else {
      const type = MULTI_TYPES[section]
      const data = await sanityQuery(`*[_type == $type] | order(_createdAt asc)`, { type })
      return NextResponse.json({ data: data ?? [] })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
  }
}

// ── PUT ───────────────────────────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const section = request.nextUrl.searchParams.get('section')
  if (!section || !isValidSection(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  try {
    const body = await request.json() as Record<string, unknown> | unknown[]

    if (SINGLETON_TYPES[section]) {
      // Singleton: find existing doc ID or create new one
      const type = SINGLETON_TYPES[section]
      const existing = await sanityQuery(`*[_type == $type][0]{ _id }`, { type }) as { _id: string } | null

      const { _id, _type, _rev, _createdAt, _updatedAt, ...fields } = body as Record<string, unknown>
      void _id; void _type; void _rev; void _createdAt; void _updatedAt

      if (existing?._id) {
        await sanityMutate([{
          patch: { id: existing._id, set: fields, unset: [] },
        }])
        // Publish the draft created by the patch
        await sanityMutate([{ publish: { id: existing._id } }])
      } else {
        await sanityMutate([{
          createOrReplace: { _type: type, ...fields },
        }])
      }
    } else {
      // Multi-document section: replace all documents of this type
      const type = MULTI_TYPES[section]
      const items = Array.isArray(body) ? body : []

      // Get existing IDs to delete
      const existing = await sanityQuery(`*[_type == $type]{ _id }`, { type }) as { _id: string }[]
      const existingIds = (existing ?? []).map((d) => d._id)

      const mutations: unknown[] = []

      // Delete all existing
      for (const id of existingIds) {
        mutations.push({ delete: { id } })
      }

      // Create new ones
      for (const item of items) {
        const { _id, _type: t, _rev, _createdAt, _updatedAt, ...fields } = item as Record<string, unknown>
        void _id; void t; void _rev; void _createdAt; void _updatedAt
        mutations.push({ create: { _type: type, ...fields } })
      }

      if (mutations.length > 0) {
        await sanityMutate(mutations)
      }
    }

    // Bust Next.js page cache
    const paths = SECTION_PATHS[section] ?? ['/']
    for (const p of paths) revalidatePath(p)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin content PUT error:', err)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
