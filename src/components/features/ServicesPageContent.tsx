'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import {
  CircleDot,
  ClipboardCheck,
  Clock3,
  Fan,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ServiceQuoteModal } from './ServiceQuoteModal'
import type { Service } from '@/types/service.types'

type Props = {
  services: Service[]
}

type ServiceDetail = {
  id: string
  aliases: string[]
  title: string
  description: string
  features: string[]
  goodFor: string[]
  Icon: LucideIcon
  image?: string
}

type DisplayService = {
  id: string
  title: string
  description: string | null
  features: string[]
  goodFor: string[]
  Icon: LucideIcon
  image?: string
}

const EASE = [0.25, 0.1, 0.25, 1] as const

const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'servicing',
    aliases: ['servicing', 'service', 'oil'],
    title: 'Servicing',
    description: 'Routine maintenance that keeps your car healthy, efficient and ready for daily use.',
    features: ['Oil and oil filter change', 'Air filter change', 'Fluid level checks', 'General safety inspection'],
    goodFor: ['Annual maintenance', 'High mileage cars', 'Pre-trip checks'],
    Icon: Wrench,
    image: '/servicing.jpg',
  },
  {
    id: 'aircon',
    aliases: ['aircon', 'air con', 'air conditioning', 'ac'],
    title: 'Air Con Gas & Repair',
    description: 'Regassing, leak checks and repairs for cleaner, cooler air through every season.',
    features: ['Air con regas', 'Leak detection', 'Compressor inspection', 'System diagnosis'],
    goodFor: ['Weak cooling', 'Bad smells', 'Noisy AC systems'],
    Icon: Fan,
    image: '/aircon.jpg',
  },
  {
    id: 'brakes',
    aliases: ['brake', 'brakes'],
    title: 'Brake Repairs',
    description: 'Brake checks, pads, discs and repair advice for confident stopping power.',
    features: ['Brake pad checks', 'Disc inspection', 'Fluid checks', 'Repair advice'],
    goodFor: ['Squeaking brakes', 'Brake warning lights', 'Soft pedals'],
    Icon: ShieldCheck,
    image: '/brake-repairs.jpg',
  },
  {
    id: 'tyres',
    aliases: ['tyres', 'tyre', 'tires', 'tire', 'wheel'],
    title: 'Tyre Repair & Replacement',
    description: 'Puncture repairs, fitting and balancing for safer grip and smoother journeys.',
    features: ['Puncture repairs', 'Supply and fit all sizes', 'Wheel balancing', 'TPMS reset'],
    goodFor: ['Slow punctures', 'Uneven wear', 'Replacement tyres'],
    Icon: CircleDot,
    image: '/tyres.jpg',
  },
  {
    id: 'mot',
    aliases: ['mot', 'test'],
    title: 'MOT Checks & Repairs',
    description: 'Straightforward MOT preparation and repairs to help keep your vehicle road legal.',
    features: ['MOT checks', 'Repair advice', 'Same-day support where possible', 'Clear pass or fail guidance'],
    goodFor: ['MOT due soon', 'Warning lights', 'Roadworthiness checks'],
    Icon: ClipboardCheck,
    image: '/mot-testing.jpg',
  },
]

const EXPECTATIONS = [
  { title: 'Clear diagnosis', text: 'We explain what we find before any work starts.', Icon: ClipboardCheck },
  { title: 'Practical timing', text: 'Book ahead or call us if the issue is urgent.', Icon: Clock3 },
  { title: 'Trusted local team', text: 'Experienced mechanics working on all makes and models.', Icon: ShieldCheck },
]

function splitIntoLines(text: string, charsPerLine = 38): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > charsPerLine && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function findServiceDetail(service: Service) {
  return SERVICE_DETAILS.find((detail) => {
    const slug = service.slug.current.toLowerCase()
    const title = service.title.toLowerCase()
    return detail.aliases.some((alias) => slug.includes(alias) || title.includes(alias))
  })
}

function getDisplayServices(services: Service[]): DisplayService[] {
  if (services.length === 0) {
    return SERVICE_DETAILS.map(({ id, title, description, features, goodFor, Icon, image }) => ({
      id, title, description, features, goodFor, Icon,
      ...(image !== undefined ? { image } : {}),
    }))
  }
  return services.map((service) => {
    const detail = findServiceDetail(service)
    const image = detail?.image
    return {
      id: service.slug.current,
      title: service.title,
      description: service.description ?? detail?.description ?? null,
      features: service.features?.length ? service.features : detail?.features ?? [],
      goodFor: detail?.goodFor ?? [],
      Icon: detail?.Icon ?? Wrench,
      ...(image !== undefined ? { image } : {}),
    }
  })
}

const CARD_BAR_DEFAULT = 68
const CARD_BAR_HOVER = 396

function ServiceCard({
  id, title, description, image, onBook,
}: {
  id: string
  title: string
  description: string | null
  image?: string
  onBook: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const expanded = hovered || open
  const lines = description ? splitIntoLines(description) : []

  return (
    <motion.li
      id={id}
      role="listitem"
      className="scroll-mt-28 relative h-[420px] rounded-2xl overflow-hidden cursor-pointer select-none bg-dark"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setOpen(false) }}
      onClick={() => setOpen((prev) => !prev)}
    >
      {/* Background image */}
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
      )}

      {/* Rectangle — inset on all sides, grows upward */}
      <motion.div
        className="absolute inset-x-3 bottom-3 rounded-2xl bg-dark/85 backdrop-blur-sm overflow-hidden flex flex-col justify-between"
        initial={{ height: CARD_BAR_DEFAULT }}
        animate={{ height: expanded ? CARD_BAR_HOVER : CARD_BAR_DEFAULT }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Top — title + description */}
        <div className="px-5 pt-4">
          <h3 className="text-[17px] font-semibold text-white leading-snug">
            {title}
          </h3>

          <div className="mt-3 overflow-hidden">
            {lines.map((line, i) => (
              <motion.span
                key={i}
                className="block text-[14px] text-white/65 leading-relaxed"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: expanded ? 0 : 16, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3, delay: expanded ? 0.18 + i * 0.07 : 0, ease: EASE }}
              >
                {line}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom — CTA always anchored here */}
        <div className="px-5 pb-4 shrink-0">
          <Button
            variant="green"
            size="md"
            showArrow
            onClick={(e) => { e.stopPropagation(); onBook() }}
            aria-label={`Book ${title}`}
          >
            Book This Service
          </Button>
        </div>
      </motion.div>
    </motion.li>
  )
}

export function ServicesPageContent({ services }: Props) {
  const displayServices = getDisplayServices(services)
  const [activeService, setActiveService] = useState<string | null>(null)

  return (
    <>
      <section aria-labelledby="services-heading" className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <span className="text-primary text-[12px] font-bold tracking-widest uppercase">
                What we handle
              </span>
              <h2
                id="services-heading"
                className="mt-3 text-[32px] md:text-[44px] font-bold leading-tight text-dark"
              >
                Choose the job your car needs.
              </h2>
            </div>
            <p className="text-[17px] md:text-[18px] leading-relaxed text-muted max-w-2xl lg:ml-auto">
              From routine servicing to MOT-related repairs, each visit starts with a straightforward conversation about the issue, the likely fix and the next best step.
            </p>
          </div>

          <nav aria-label="Jump to service" className="mt-9 flex gap-3 overflow-x-auto pb-2">
            {displayServices.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="shrink-0 rounded-full border border-border px-4 py-2 text-[14px] font-semibold text-body hover:border-primary hover:text-dark transition-colors"
              >
                {service.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-light-bg py-8 md:py-12" aria-label="Service details">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul role="list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayServices.map(({ id, title, description, image }) => (
              <ServiceCard
                key={id}
                id={id}
                title={title}
                description={description}
                {...(image !== undefined ? { image } : {})}
                onBook={() => setActiveService(title)}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-start">
            <div>
              <span className="text-primary text-[12px] font-bold tracking-widest uppercase">
                What to expect
              </span>
              <h2 className="mt-3 text-[30px] md:text-[40px] font-bold leading-tight text-dark">
                A simple garage visit, handled properly.
              </h2>
            </div>

            <ul role="list" className="grid gap-4">
              {EXPECTATIONS.map(({ title, text, Icon }) => (
                <li key={title} className="flex gap-4 border-b border-border pb-5 last:border-b-0">
                  <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-dark shrink-0">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-dark">{title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ServiceQuoteModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  )
}
