import { sanityClient } from '@/lib/sanity'
import type { Service } from '@/types/service.types'
import type { Offer } from '@/types/offer.types'
import type { Testimonial } from '@/types/testimonial.types'

const CACHE = { next: { revalidate: 3600 } } as const
const NO_CACHE = { next: { revalidate: 0 } } as const

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  return sanityClient.fetch<Service[]>(
    `*[_type == "service"] | order(_createdAt asc) {
      _id, title, slug, description, icon, features, image
    }`,
    {},
    CACHE,
  )
}

export async function getServicesPreview(): Promise<Service[]> {
  const services = await getServices()
  return services.slice(0, 4)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return sanityClient.fetch<Service | null>(
    `*[_type == "service" && slug.current == $slug][0] {
      _id, title, slug, description, icon, features, image
    }`,
    { slug },
    CACHE,
  )
}

// ── Offers ────────────────────────────────────────────────────────────────────

export async function getActiveOffers(): Promise<Offer[]> {
  return sanityClient.fetch<Offer[]>(
    `*[_type == "offer" && active == true && (expiresAt == null || expiresAt > now())] | order(_createdAt desc) {
      _id, title, description, badge, expiresAt, active
    }`,
    {},
    CACHE,
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  return sanityClient.fetch<Testimonial[]>(
    `*[_type == "testimonial"] | order(_createdAt asc) {
      _id, customerName, review, rating, vehicleType
    }`,
    {},
    CACHE,
  )
}

// ── Singleton helpers (hero, settings, stats, gallery, process) ───────────────

export async function getSingleton<T>(type: string): Promise<T | null> {
  return sanityClient.fetch<T | null>(
    `*[_type == $type][0]`,
    { type },
    CACHE,
  )
}

export async function getSingletonFresh<T>(type: string): Promise<T | null> {
  return sanityClient.fetch<T | null>(
    `*[_type == $type][0]`,
    { type },
    NO_CACHE,
  )
}

export async function getAllOfType<T>(type: string): Promise<T[]> {
  return sanityClient.fetch<T[]>(
    `*[_type == $type] | order(_createdAt asc)`,
    { type },
    CACHE,
  )
}

export async function getAllOfTypeFresh<T>(type: string): Promise<T[]> {
  return sanityClient.fetch<T[]>(
    `*[_type == $type] | order(_createdAt asc)`,
    { type },
    NO_CACHE,
  )
}
