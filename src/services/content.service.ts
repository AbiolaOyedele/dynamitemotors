import {
  getServices,
  getServicesPreview,
  getServiceBySlug,
  getActiveOffers,
  getTestimonials,
} from '@/repositories/sanity.repository'
import { readContent } from '@/lib/content'
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
  // Brand colours — override CSS custom properties site-wide
  colorPrimary: string
  colorPrimaryDark: string
  colorDark: string
  colorBody: string
  colorMuted: string
  colorLightBg: string
  colorBorder: string
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

export function fetchStats(): StatItem[] {
  try {
    return readContent<StatItem[]>('stats')
  } catch {
    return [
      { value: 30, suffix: '+', label: 'Years Experience' },
      { value: 5, suffix: '★', label: 'Google Rating' },
      { value: 200, suffix: '+', label: 'Cars Serviced' },
    ]
  }
}

export function fetchProcess(): ProcessStep[] {
  try {
    return readContent<ProcessStep[]>('process')
  } catch {
    return [
      {
        number: '01',
        title: 'Book Online or Call',
        description:
          "Fill in our quick quote form or give us a ring. We'll confirm your slot and answer any questions, no waiting, no hassle.",
      },
      {
        number: '02',
        title: 'Drop Your Car Off',
        description:
          "Bring your car to our Northfleet garage at the agreed time. We'll carry out a thorough inspection before any work begins.",
      },
      {
        number: '03',
        title: 'We Get to Work',
        description:
          "Our experienced technicians carry out the job to a high standard. We'll keep you updated if anything unexpected comes up, no surprises.",
      },
      {
        number: '04',
        title: 'Collect & Drive Away',
        description:
          "We'll call you as soon as your car is ready. Pay, collect, and drive away knowing the job's been done properly.",
      },
    ]
  }
}

export function fetchGallery(): GalleryImage[] {
  try {
    return readContent<GalleryImage[]>('gallery')
  } catch {
    return [
      { src: '/gallery/garage-bay.jpg', alt: 'Mechanic working under a car on the lift' },
      { src: '/gallery/aircon-regas.jpg', alt: 'Air conditioning regas with Kheos CTR machine' },
      { src: '/gallery/tyre-rack.jpg', alt: 'Tyre stock rack' },
      { src: '/gallery/garage-interior.jpg', alt: 'Garage interior with cars being serviced' },
      { src: '/gallery/building-exterior.jpg', alt: 'Dynamite Motors building exterior' },
    ]
  }
}

export function fetchHero(): HeroData {
  try {
    return readContent<HeroData>('hero')
  } catch {
    return {}
  }
}

export function fetchSettings(): Settings {
  try {
    return readContent<Settings>('settings')
  } catch {
    return {
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
  }
}
