import Link from 'next/link'
import { sanityClient } from '@/lib/sanity'

const CARDS = [
  { href: '/dynamite/hero',         label: 'Hero Section',   description: 'Edit hero text, image and CTA' },
  { href: '/dynamite/services',     label: 'Services',       description: 'Manage services and images' },
  { href: '/dynamite/testimonials', label: 'Testimonials',   description: 'Manage customer reviews' },
  { href: '/dynamite/offers',       label: 'Offers',         description: 'Create and manage offers' },
  { href: '/dynamite/stats',        label: 'Stats Bar',      description: 'Edit the three headline stats' },
  { href: '/dynamite/process',      label: 'Process Steps',  description: 'Edit the how-it-works steps' },
  { href: '/dynamite/gallery',      label: 'Gallery',        description: 'Add and remove garage photos' },
  { href: '/dynamite/settings',     label: 'Settings',       description: 'Business info and contact' },
] as const

export default async function AdminDashboard() {
  const counts = await sanityClient.fetch<{
    services: number
    testimonials: number
    offers: number
    gallery: number
  }>(
    `{
      "services":     count(*[_type == "service"]),
      "testimonials": count(*[_type == "testimonial"]),
      "offers":       count(*[_type == "offer"]),
      "gallery":      count(*[_type == "gallery"])
    }`,
    {},
    { next: { revalidate: 0 } },
  ).catch(() => ({ services: 0, testimonials: 0, offers: 0, gallery: 0 }))

  return (
    <div>
      <h1 className="text-[28px] font-bold text-dark mb-2">Dashboard</h1>
      <p className="text-[16px] text-muted mb-8">
        Manage your website content, images, and settings.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{counts.services}</p>
          <p className="text-[14px] text-muted">Services</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{counts.testimonials}</p>
          <p className="text-[14px] text-muted">Testimonials</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{counts.offers}</p>
          <p className="text-[14px] text-muted">Active Offers</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-[32px] font-bold text-dark">{counts.gallery}</p>
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
