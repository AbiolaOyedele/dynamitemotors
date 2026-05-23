import type { Metadata } from 'next'
import Image from 'next/image'

export const revalidate = 3600
import { ServicesPageContent } from '@/components/features/ServicesPageContent'
import { ServicesPageCTA } from '@/components/features/ServicesPageCTA'
import { fetchServices } from '@/services/content.service'

export const metadata: Metadata = {
  title: 'Our Services | Dynamite Motors',
  description:
    'MOT checks, full service, tyres, brakes, air con, clutches, exhausts and more. All handled by experienced mechanics at Dynamite Motors in Gravesend.',
  alternates: { canonical: 'https://www.dynamitemotors.com/services' },
  openGraph: {
    url: 'https://www.dynamitemotors.com/services',
    title: 'Our Services | Dynamite Motors',
    description:
      'MOT checks, full service, tyres, brakes, air con, clutches, exhausts and more. All handled by experienced mechanics at Dynamite Motors in Gravesend.',
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Dynamite Motors',
  url: 'https://www.dynamitemotors.com',
  telephone: '01474 643488',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2 Vale Rd, Northfleet',
    addressLocality: 'Gravesend',
    postalCode: 'DA11 9RE',
    addressCountry: 'GB',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Our Services',
    itemListElement: [
      'Full Service',
      'Tyre Sale & Repair',
      'Air Conditioning',
      'Brakes',
      'Clutches',
      'Engine & Gear Repair',
      'Full Diagnostic',
      'Suspension',
      'Exhausts',
      'MOT Repairs',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
    })),
  },
}

export default async function ServicesPage() {
  const services = await fetchServices()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <section className="relative overflow-hidden pt-28 md:pt-32 pb-16 md:pb-20" aria-label="Services hero">
        <Image
          src="/services-hero.jpg"
          alt="Mechanic working on a car at Dynamite Motors"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[36px] md:text-[52px] font-bold text-white leading-tight mb-4">
            Our Services
          </h1>
          <p className="text-[18px] text-white/65 leading-relaxed max-w-2xl mx-auto">
            MOT checks, servicing, air con and tyres. All handled by experienced mechanics in Gravesend.
          </p>
        </div>
      </section>

      <ServicesPageContent services={services} />

      <section className="bg-dark py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4">
            Not sure what your car needs?
          </h2>
          <p className="text-[16px] text-white/65 mb-8">
            Call us or drop in, our team will take a look and give you an honest, no-obligation assessment.
          </p>
          <ServicesPageCTA />
        </div>
      </section>
    </>
  )
}
