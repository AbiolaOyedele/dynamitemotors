import {
  getServices,
  getServicesPreview,
  getServiceBySlug,
  getActiveOffers,
  getTestimonials,
  getSingleton,
  getAllOfType,
} from '@/repositories/sanity.repository'
import type { Service } from '@/types/service.types'
import type { Offer } from '@/types/offer.types'
import type { Testimonial } from '@/types/testimonial.types'

export type StatItem = {
  value: number
  suffix: string
  label: string
}

export type ProcessStep = {
  number: string
  title: string
  description: string
}

export type GalleryImage = {
  src: string
  alt: string
}

export type HeroData = {
  badge?: string
  heading?: string
  accentLine?: string
  subheading?: string
  image?: string
}

export type Settings = {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  mapsUrl: string
  hoursMonFri: string
  hoursSat: string
  hoursSun: string
  servicesHeroImage?: string
  colorPrimary: string
  colorPrimaryDark: string
  colorDark: string
  colorBody: string
  colorMuted: string
  colorLightBg: string
  colorBorder: string
}

const SETTINGS_FALLBACK: Settings = {
  name: 'Dynamite Motors',
  tagline: 'Your trusted local garage in Gravesend',
  address: '2 Vale Rd, Northfleet, Gravesend DA11 9RE',
  phone: '01474 643488',
  email: 'dynamitemotor@gmail.com',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=2+Vale+Rd+Northfleet+Gravesend+DA11+9RE',
  hoursMonFri: '9am – 6pm',
  hoursSat: '9am – 3pm',
  hoursSun: 'Closed',
  colorPrimary: '#1ED760',
  colorPrimaryDark: '#19b852',
  colorDark: '#1a1a1a',
  colorBody: '#333333',
  colorMuted: '#666666',
  colorLightBg: '#F5F5F5',
  colorBorder: '#E8E8E8',
}

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

export async function fetchStats(): Promise<StatItem[]> {
  const doc = await getSingleton<{ items: StatItem[] }>('stats')
  return doc?.items ?? [
    { value: 30, suffix: '+', label: 'Years Experience' },
    { value: 5, suffix: '★', label: 'Google Rating' },
    { value: 200, suffix: '+', label: 'Cars Serviced' },
  ]
}

export async function fetchProcess(): Promise<ProcessStep[]> {
  const doc = await getSingleton<{ steps: ProcessStep[] }>('process')
  return doc?.steps ?? []
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  const doc = await getSingleton<{ items: GalleryImage[] }>('gallery')
  return doc?.items ?? []
}

export async function fetchHero(): Promise<HeroData> {
  const doc = await getSingleton<HeroData>('hero')
  return doc ?? {}
}

export async function fetchSettings(): Promise<Settings> {
  const doc = await getSingleton<Settings>('siteSettings')
  return doc ?? SETTINGS_FALLBACK
}

// Used by admin to fetch all documents of a type for editing
export async function fetchAllOfType<T>(type: string): Promise<T[]> {
  return getAllOfType<T>(type)
}
