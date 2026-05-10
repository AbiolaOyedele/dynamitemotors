'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ClipboardCheck, Wrench, ShieldCheck, CircleDot, Fan } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceQuoteModal } from './ServiceQuoteModal'
import type { Service } from '@/types/service.types'

const SERVICE_IMAGES: Record<string, string> = {
  mot:     '/mot-testing.jpg',
  service: '/servicing.jpg',
  brake:   '/brake-repairs.jpg',
  tyre:    '/tyres.jpg',
}

function getServiceImage(icon: string | null): string | null {
  if (!icon) return null
  const key = Object.keys(SERVICE_IMAGES).find((k) => icon.toLowerCase().includes(k))
  return key ? SERVICE_IMAGES[key] : null
}

type Props = {
  services: Service[]
  showViewAll?: boolean
  limit?: number
}

function ServiceIcon({ name }: { name: string | null }) {
  const icon = name?.toLowerCase() ?? ''

  if (icon.includes('mot'))
    return <ClipboardCheck size={28} aria-hidden="true" />

  if (icon.includes('oil') || icon.includes('service'))
    return <Wrench size={28} aria-hidden="true" />

  if (icon.includes('tyre') || icon.includes('tire') || icon.includes('wheel'))
    return <CircleDot size={28} aria-hidden="true" />

  if (icon.includes('brake'))
    return <ShieldCheck size={28} aria-hidden="true" />

  if (icon.includes('aircon') || icon.includes('air con') || icon.includes('ac'))
    return <Fan size={28} aria-hidden="true" />

  return <Wrench size={28} aria-hidden="true" />
}

const FALLBACK_SERVICES: Service[] = [
  { _id: 'f1', title: 'MOT Testing',    slug: { current: 'mot-testing' },    description: 'Fast, reliable MOT testing with same-day certificates.', icon: 'mot',    features: ['Pass or fail advice', 'Retest available', 'All vehicle classes'] },
  { _id: 'f2', title: 'Car Servicing',  slug: { current: 'car-servicing' },  description: 'Full and interim services to keep your car running safely.', icon: 'service', features: ['Oil & filter change', 'Safety inspection', 'All makes & models'] },
  { _id: 'f3', title: 'Brake Repairs',  slug: { current: 'brake-repairs' },  description: 'Pads, discs and fluid checks for total stopping confidence.', icon: 'brake',   features: ['Free brake check', 'Genuine parts', 'Same-day fitting'] },
  { _id: 'f4', title: 'Tyres & Wheels', slug: { current: 'tyres-wheels' },   description: 'Supply and fitting of all major tyre brands, any size.', icon: 'tyre',    features: ['Competitive prices', 'Wheel balancing', 'TPMS reset'] },
]

const EASE = [0.25, 0.1, 0.25, 1] as const

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function ServicesGrid({ services, showViewAll = false, limit }: Props) {
  const all = services.length > 0 ? services : FALLBACK_SERVICES
  const displayServices = limit ? all.slice(0, limit) : all
  const [activeService, setActiveService] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const inView = useInView(listRef, { once: true, margin: '-80px' })

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
        <motion.ul
          ref={listRef}
          className="space-y-8"
          role="list"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {displayServices.map((service) => (
            <motion.li key={service._id} variants={itemVariants} className="bg-white rounded-3xl border border-border hover:shadow-xl transition-all duration-300">

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

                {/* Right — image */}
                <div className="relative hidden lg:block w-full aspect-square rounded-3xl overflow-hidden">
                  {getServiceImage(service.icon) ? (
                    <Image
                      src={getServiceImage(service.icon)!}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 0vw, 50vw"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20" />
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

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
