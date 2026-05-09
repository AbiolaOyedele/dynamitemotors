'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceQuoteModal } from './ServiceQuoteModal'
import type { Service } from '@/types/service.types'

type Props = {
  services: Service[]
  showViewAll?: boolean
  limit?: number
}

function ServiceIcon({ name }: { name: string | null }) {
  const icon = name?.toLowerCase() ?? ''

  if (icon.includes('mot'))
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )

  if (icon.includes('oil') || icon.includes('service'))
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v6" /><path d="M5.636 5.636L7.05 7.05" /><path d="M2 12h6" /><path d="M5.636 18.364L7.05 16.95" /><path d="M12 22v-6" /><path d="M18.364 18.364L16.95 16.95" /><path d="M22 12h-6" /><path d="M18.364 5.636L16.95 7.05" />
      </svg>
    )

  if (icon.includes('tyre') || icon.includes('tire') || icon.includes('wheel'))
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    )

  if (icon.includes('brake'))
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    )

  if (icon.includes('exhaust') || icon.includes('engine'))
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="10" rx="2" /><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /><path d="M8 17v2M16 17v2" />
      </svg>
    )

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

const FALLBACK_SERVICES: Service[] = [
  { _id: 'f1', title: 'MOT Testing',    slug: { current: 'mot-testing' },    description: 'Fast, reliable MOT testing with same-day certificates.', icon: 'mot',    features: ['Pass or fail advice', 'Retest available', 'All vehicle classes'] },
  { _id: 'f2', title: 'Car Servicing',  slug: { current: 'car-servicing' },  description: 'Full and interim services to keep your car running safely.', icon: 'service', features: ['Oil & filter change', 'Safety inspection', 'All makes & models'] },
  { _id: 'f3', title: 'Brake Repairs',  slug: { current: 'brake-repairs' },  description: 'Pads, discs and fluid checks for total stopping confidence.', icon: 'brake',   features: ['Free brake check', 'Genuine parts', 'Same-day fitting'] },
  { _id: 'f4', title: 'Tyres & Wheels', slug: { current: 'tyres-wheels' },   description: 'Supply and fitting of all major tyre brands, any size.', icon: 'tyre',    features: ['Competitive prices', 'Wheel balancing', 'TPMS reset'] },
]

export function ServicesGrid({ services, showViewAll = false, limit }: Props) {
  const all = services.length > 0 ? services : FALLBACK_SERVICES
  const displayServices = limit ? all.slice(0, limit) : all
  const [activeService, setActiveService] = useState<string | null>(null)

  return (
    <section aria-labelledby="services-heading" className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          pill="What We Do"
          heading="Services We Offer"
          description="From routine maintenance to complex repairs — we handle it all under one roof."
          headingId="services-heading"
        />

        {/* Grid */}
        <ul className="space-y-8" role="list">
          {displayServices.map((service) => (
            <li key={service._id} className="bg-white rounded-3xl border border-border hover:shadow-xl transition-all duration-300">

              {/* Card — horizontal layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 md:p-12">

                {/* Left — content */}
                <div className="flex flex-col gap-6">
                  {/* Icon box */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-dark text-primary shrink-0">
                    <ServiceIcon name={service.icon} />
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-[28px] md:text-[32px] font-bold text-dark leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {service.description && (
                    <p className="text-[17px] text-muted leading-relaxed">
                      {service.description}
                    </p>
                  )}

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="flex flex-col gap-3" aria-label={`${service.title} features`}>
                      {service.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3 text-[16px] text-body">
                          <svg className="shrink-0 mt-[3px] text-primary" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                          </svg>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      aria-label={`Get a quote for ${service.title}`}
                      onClick={() => setActiveService(service.title)}
                    >
                      Get a Quote
                    </Button>
                  </div>
                </div>

                {/* Right — image placeholder */}
                <div className="relative hidden lg:flex items-center justify-center">
                  <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted/70 text-[16px] font-medium">Image coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <ServiceQuoteModal service={activeService} onClose={() => setActiveService(null)} />

        {/* View all link */}
        {showViewAll && (
          <div className="mt-12 text-center">
            <a
              href="/services"
              className="inline-flex items-center gap-2 text-primary text-[17px] font-semibold hover:text-primary-dark transition-colors underline-offset-4 hover:underline"
            >
              View All Services
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
