import { sanityClient } from '@/lib/sanity'
import type { Service } from '@/types/service.types'
import type { Offer } from '@/types/offer.types'
import type { Testimonial } from '@/types/testimonial.types'

const CACHE = { next: { revalidate: 3600 } } as const

const SERVICE_FIELDS = `
  _id,
  title,
  slug,
  description,
  icon,
  features
`

export async function getServices(): Promise<Service[]> {
  return sanityClient.fetch<Service[]>(
    `*[_type == "service"] | order(_createdAt asc) { ${SERVICE_FIELDS} }`,
    {},
    CACHE,
  )
}

export async function getServicesPreview(): Promise<Service[]> {
  return sanityClient.fetch<Service[]>(
    `*[_type == "service"] | order(_createdAt asc)[0...4] { ${SERVICE_FIELDS} }`,
    {},
    CACHE,
  )
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return sanityClient.fetch<Service | null>(
    `*[_type == "service" && slug.current == $slug][0] { ${SERVICE_FIELDS} }`,
    { slug },
    CACHE,
  )
}

export async function getActiveOffers(): Promise<Offer[]> {
  return sanityClient.fetch<Offer[]>(
    `*[_type == "offer" && active == true] | order(_createdAt desc) {
      _id,
      title,
      description,
      badge,
      expiresAt,
      active
    }`,
    {},
    CACHE,
  )
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return sanityClient.fetch<Testimonial[]>(
    `*[_type == "testimonial"] | order(_createdAt desc) {
      _id,
      customerName,
      review,
      rating,
      vehicleType
    }`,
    {},
    CACHE,
  )
}
