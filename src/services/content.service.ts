import {
  getServices,
  getServicesPreview,
  getServiceBySlug,
  getActiveOffers,
  getTestimonials,
} from '@/repositories/sanity.repository'
import type { Service } from '@/types/service.types'
import type { Offer } from '@/types/offer.types'
import type { Testimonial } from '@/types/testimonial.types'

export async function fetchServices(): Promise<Service[]> {
  return getServices()
}

export async function fetchServicesPreview(): Promise<Service[]> {
  return getServicesPreview()
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  return getServiceBySlug(slug)
}

export async function fetchActiveOffers(): Promise<Offer[]> {
  return getActiveOffers()
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return getTestimonials()
}
