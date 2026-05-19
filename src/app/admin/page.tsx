import { readContent } from '@/lib/content'
import Link from 'next/link'

type ServiceItem = { id: string; title: string }
type TestimonialItem = { id: string; customerName: string }
type OfferItem = { id: string; title: string }
type HeroContent = { heading: string }
type SettingsContent = { name: string }
type GalleryImage = { src: string; alt: string }

const CARDS = [
  { href: '/admin/hero', label: 'Hero Section', description: 'Edit hero text, image and CTA' },
  { href: '/admin/services', label: 'Services', description: 'Manage services and images' },
  { href: '/admin/testimonials', label: 'Testimonials', description: 'Manage customer reviews' },
  { href: '/admin/offers', label: 'Offers', description: 'Create and manage offers' },
  { href: '/admin/stats', label: 'Stats Bar', description: 'Edit the three headline stats' },
  { href: '/admin/process', label: 'Process Steps', description: 'Edit the how-it-works steps' },
  { href: '/admin/gallery', label: 'Gallery', description: 'Add and remove garage photos' },
  { href: '/admin/settings', label: 'Settings', description: 'Business info and contact' },
] as const

export default function AdminDashboard() {
  let serviceCount = 0
  let testimonialCount = 0
  let offerCount = 0
  let galleryCount = 0

  try {
    serviceCount = readContent<ServiceItem[]>('services').length
    testimonialCount = readContent<TestimonialItem[]>('testimonials').length
    offerCount = readContent<OfferItem[]>('offers').length
    galleryCount = readContent<GalleryImage[]>('gallery').length
    readContent<HeroContent>('hero')
    readContent<SettingsContent>('settings')
  } catch {
    // Content files may not exist yet
  }

  return (
    <div>
      <h1 className="text-[28px] font-bold text-dark mb-2">Dashboard</h1>
      <p className="text-[16px] text-muted mb-8">
        Manage your website content, images, and settings.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{serviceCount}</p>
          <p className="text-[14px] text-muted">Services</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{testimonialCount}</p>
          <p className="text-[14px] text-muted">Testimonials</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{offerCount}</p>
          <p className="text-[14px] text-muted">Active Offers</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{galleryCount}</p>
          <p className="text-[14px] text-muted">Gallery Photos</p>
        </div>
      </div>

      {/* Quick links */}
      <h2 className="text-[18px] font-bold text-dark mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-border p-5 hover:border-primary/45 hover:shadow-md transition-all duration-200 group"
          >
            <h3 className="text-[16px] font-bold text-dark group-hover:text-primary-dark transition-colors">
              {label}
            </h3>
            <p className="text-[14px] text-muted mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
