import { readContent } from '@/lib/content'
import Link from 'next/link'

type ServiceItem = { id: string; title: string }
type TestimonialItem = { id: string; customerName: string }
type OfferItem = { id: string; title: string }
type HeroContent = { heading: string }
type Settings = { name: string }

const CARDS = [
  { href: '/admin/hero', label: 'Hero Section', icon: 'image', description: 'Edit hero text, image and CTA' },
  { href: '/admin/services', label: 'Services', icon: 'wrench', description: 'Manage services and images' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'star', description: 'Manage customer reviews' },
  { href: '/admin/offers', label: 'Offers', icon: 'tag', description: 'Create and manage offers' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings', description: 'Business info and contact' },
] as const

export default function AdminDashboard() {
  let serviceCount = 0
  let testimonialCount = 0
  let offerCount = 0

  try {
    serviceCount = readContent<ServiceItem[]>('services').length
    testimonialCount = readContent<TestimonialItem[]>('testimonials').length
    offerCount = readContent<OfferItem[]>('offers').length
    readContent<HeroContent>('hero')
    readContent<Settings>('settings')
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
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
