import { sanityClient } from '@/lib/sanity'
import { readContent } from '@/lib/content'
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

type LocalService = {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

type LocalOffer = {
  id: string
  title: string
  description: string
  badge: string
  expiresAt: string
  active: boolean
}

type LocalTestimonial = {
  id: string
  customerName: string
  review: string
  rating: number
  vehicleType: string
}

function readLocalContent<T>(section: Parameters<typeof readContent>[0]): T | null {
  try {
    return readContent<T>(section)
  } catch {
    return null
  }
}

function mapLocalService(service: LocalService): Service {
  return {
    _id: service.id,
    title: service.title,
    slug: { current: service.id },
    description: service.description || null,
    icon: service.icon || null,
    features: service.features.length > 0 ? service.features : null,
  }
}

export async function getServices(): Promise<Service[]> {
  const localServices = readLocalContent<LocalService[]>('services')
  if (localServices) {
    return localServices.map(mapLocalService)
  }

  return sanityClient.fetch<Service[]>(
    `*[_type == "service"] | order(_createdAt asc) { ${SERVICE_FIELDS} }`,
    {},
    CACHE,
  )
}

export async function getServicesPreview(): Promise<Service[]> {
  const services = await getServices()
  return services.slice(0, 4)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const localServices = readLocalContent<LocalService[]>('services')
  const localMatch = localServices
    ?.map(mapLocalService)
    .find((service) => service.slug.current === slug)

  if (localMatch) {
    return localMatch
  }

  return sanityClient.fetch<Service | null>(
    `*[_type == "service" && slug.current == $slug][0] { ${SERVICE_FIELDS} }`,
    { slug },
    CACHE,
  )
}

export async function getActiveOffers(): Promise<Offer[]> {
  const localOffers = readLocalContent<LocalOffer[]>('offers')
  if (localOffers) {
    return localOffers
      .filter((offer) => offer.active)
      .map((offer) => ({
        _id: offer.id,
        title: offer.title,
        description: offer.description || null,
        badge: offer.badge || null,
        expiresAt: offer.expiresAt || null,
        active: offer.active,
      }))
  }

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
  const localTestimonials = readLocalContent<LocalTestimonial[]>('testimonials')
  if (localTestimonials) {
    return localTestimonials.map((testimonial) => ({
      _id: testimonial.id,
      customerName: testimonial.customerName,
      review: testimonial.review,
      rating: testimonial.rating,
      vehicleType: testimonial.vehicleType || null,
    }))
  }

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
