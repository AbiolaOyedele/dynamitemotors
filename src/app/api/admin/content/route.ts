import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/lib/admin-auth'
import { env } from '@/config/env'

// ── Sanity config ─────────────────────────────────────────────────────────────

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = env.NEXT_PUBLIC_SANITY_DATASET
const TOKEN      = env.SANITY_API_TOKEN
const API_BASE   = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data`

type Section = 'hero' | 'services' | 'testimonials' | 'offers' | 'stats' | 'settings' | 'gallery' | 'process'
const VALID_SECTIONS: Section[] = ['hero', 'services', 'testimonials', 'offers', 'stats', 'settings', 'gallery', 'process']

// Singleton types — one document per type
const SINGLETON_TYPE: Record<string, string> = {
  hero:     'hero',
  stats:    'stats',
  gallery:  'gallery',
  process:  'process',
  settings: 'siteSettings',
}

// Singletons that wrap an array in a named field
const SINGLETON_ARRAY_FIELD: Record<string, string> = {
  stats:   'items',
  gallery: 'items',
  process: 'steps',
}

// Multi-document types
const MULTI_TYPE: Record<string, string> = {
  services:     'service',
  testimonials: 'testimonial',
  offers:       'offer',
}

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

// ── Sanity REST helpers ───────────────────────────────────────────────────────

async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const encoded = encodeURIComponent(query)
  const paramStr = Object.entries(params)
    .map(([k, v]) => `&$${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join('')
  const res = await fetch(`${API_BASE}/query/${DATASET}?query=${encoded}${paramStr}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: 'no-store',
  })
  const data = await res.json() as { result: T }
  return data.result
}

async function sanityMutate(mutations: unknown[]): Promise<void> {
  const res = await fetch(`${API_BASE}/mutate/${DATASET}?returnIds=true`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Sanity mutation failed: ${err}`)
  }
}

// Strip internal Sanity fields before returning to client
function stripMeta(doc: Record<string, unknown>): Record<string, unknown> {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = doc
  void _id; void _type; void _rev; void _createdAt; void _updatedAt
  return rest
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
    if (SINGLETON_TYPE[section]) {
      const type = SINGLETON_TYPE[section]
      const doc = await sanityQuery<Record<string, unknown> | null>(`*[_type == $type][0]`, { type })

      if (!doc) return NextResponse.json({ data: SINGLETON_ARRAY_FIELD[section] ? [] : {} })

      // For array-wrapped singletons, return just the array
      const arrayField = SINGLETON_ARRAY_FIELD[section]
      if (arrayField) {
        return NextResponse.json({ data: doc[arrayField] ?? [] })
      }

      // For direct singletons (hero, settings), strip meta fields
      return NextResponse.json({ data: stripMeta(doc) })

    } else {
      // Multi-document: map _id → id for admin compatibility
      const type = MULTI_TYPE[section]
      const docs = await sanityQuery<Record<string, unknown>[]>(
        `*[_type == $type] | order(_createdAt asc)`, { type }
      )
      const data = (docs ?? []).map((doc) => ({
        id: doc._id,
        ...stripMeta(doc),
      }))
      return NextResponse.json({ data })
    }
  } catch (err) {
    console.error('Admin GET error:', err)
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

    if (SINGLETON_TYPE[section]) {
      const type = SINGLETON_TYPE[section]

      // Get existing doc ID
      const existing = await sanityQuery<{ _id: string } | null>(
        `*[_type == $type][0]{ _id }`, { type }
      )

      let fields: Record<string, unknown>

      // Array-wrapped singletons: body is an array, wrap it in the named field
      const arrayField = SINGLETON_ARRAY_FIELD[section]
      if (arrayField) {
        fields = { [arrayField]: Array.isArray(body) ? body : [] }
      } else {
        // Direct singleton: body is an object, strip any id/meta fields
        const { id, _id, _type, _rev, _createdAt, _updatedAt, ...rest } = body as Record<string, unknown>
        void id; void _id; void _type; void _rev; void _createdAt; void _updatedAt
        fields = rest
      }

      if (existing?._id) {
        // Patch existing doc and publish it
        await sanityMutate([{ patch: { id: existing._id, set: fields } }])
        // Publish the draft that was created by the patch
        await fetch(`${API_BASE}/mutate/${DATASET}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ mutations: [{ publish: { id: existing._id } }] }),
        })
      } else {
        // Create new document
        await sanityMutate([{ createOrReplace: { _type: type, ...fields } }])
      }

    } else {
      // Multi-document: delete all existing, create new
      const type = MULTI_TYPE[section]
      const items = Array.isArray(body) ? body as Record<string, unknown>[] : []

      const existing = await sanityQuery<{ _id: string }[]>(
        `*[_type == $type]{ _id }`, { type }
      )

      const mutations: unknown[] = []

      // Delete all existing documents
      for (const doc of (existing ?? [])) {
        mutations.push({ delete: { id: doc._id } })
      }

      // Create new documents (strip id/_id/meta fields — Sanity assigns new IDs)
      for (const item of items) {
        const { id, _id, _type: t, _rev, _createdAt, _updatedAt, ...fields } = item
        void id; void _id; void t; void _rev; void _createdAt; void _updatedAt
        mutations.push({ create: { _type: type, ...fields } })
      }

      if (mutations.length > 0) {
        await sanityMutate(mutations)
      }
    }

    // Bust page cache immediately
    const paths = SECTION_PATHS[section] ?? ['/']
    for (const p of paths) revalidatePath(p)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin PUT error:', err)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
