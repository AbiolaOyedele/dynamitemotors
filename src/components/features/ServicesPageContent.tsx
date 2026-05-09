'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Check,
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
}

type DisplayService = {
  id: string
  title: string
  description: string | null
  features: string[]
  goodFor: string[]
  Icon: LucideIcon
}

const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'servicing',
    aliases: ['servicing', 'service', 'oil'],
    title: 'Servicing',
    description:
      'Routine maintenance that keeps your car healthy, efficient and ready for daily use.',
    features: [
      'Oil and oil filter change',
      'Air filter change',
      'Fluid level checks',
      'General safety inspection',
    ],
    goodFor: ['Annual maintenance', 'High mileage cars', 'Pre-trip checks'],
    Icon: Wrench,
  },
  {
    id: 'aircon',
    aliases: ['aircon', 'air con', 'air conditioning', 'ac'],
    title: 'Air Con Gas & Repair',
    description:
      'Regassing, leak checks and repairs for cleaner, cooler air through every season.',
    features: [
      'Air con regas',
      'Leak detection',
      'Compressor inspection',
      'System diagnosis',
    ],
    goodFor: ['Weak cooling', 'Bad smells', 'Noisy AC systems'],
    Icon: Fan,
  },
  {
    id: 'brakes',
    aliases: ['brake', 'brakes'],
    title: 'Brake Repairs',
    description:
      'Brake checks, pads, discs and repair advice for confident stopping power.',
    features: [
      'Brake pad checks',
      'Disc inspection',
      'Fluid checks',
      'Repair advice',
    ],
    goodFor: ['Squeaking brakes', 'Brake warning lights', 'Soft pedals'],
    Icon: ShieldCheck,
  },
  {
    id: 'tyres',
    aliases: ['tyres', 'tyre', 'tires', 'tire', 'wheel'],
    title: 'Tyre Repair & Replacement',
    description:
      'Puncture repairs, fitting and balancing for safer grip and smoother journeys.',
    features: [
      'Puncture repairs',
      'Supply and fit all sizes',
      'Wheel balancing',
      'TPMS reset',
    ],
    goodFor: ['Slow punctures', 'Uneven wear', 'Replacement tyres'],
    Icon: CircleDot,
  },
  {
    id: 'mot',
    aliases: ['mot', 'test'],
    title: 'MOT Checks & Repairs',
    description:
      'Straightforward MOT preparation and repairs to help keep your vehicle road legal.',
    features: [
      'MOT checks',
      'Repair advice',
      'Same-day support where possible',
      'Clear pass or fail guidance',
    ],
    goodFor: ['MOT due soon', 'Warning lights', 'Roadworthiness checks'],
    Icon: ClipboardCheck,
  },
]

const EXPECTATIONS = [
  {
    title: 'Clear diagnosis',
    text: 'We explain what we find before any work starts.',
    Icon: ClipboardCheck,
  },
  {
    title: 'Practical timing',
    text: 'Book ahead or call us if the issue is urgent.',
    Icon: Clock3,
  },
  {
    title: 'Trusted local team',
    text: 'Experienced mechanics working on all makes and models.',
    Icon: ShieldCheck,
  },
]

function findServiceDetail(service: Service) {
  return SERVICE_DETAILS.find((detail) => {
    const slug = service.slug.current.toLowerCase()
    const title = service.title.toLowerCase()

    return detail.aliases.some((alias) => slug.includes(alias) || title.includes(alias))
  })
}

function getDisplayServices(services: Service[]): DisplayService[] {
  if (services.length === 0) {
    return SERVICE_DETAILS.map(({ id, title, description, features, goodFor, Icon }) => ({
      id,
      title,
      description,
      features,
      goodFor,
      Icon,
    }))
  }

  return services.map((service) => {
    const detail = findServiceDetail(service)

    return {
      id: service.slug.current,
      title: service.title,
      description: service.description ?? detail?.description ?? null,
      features: service.features?.length ? service.features : detail?.features ?? [],
      goodFor: detail?.goodFor ?? [],
      Icon: detail?.Icon ?? Wrench,
    }
  })
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
          <ul role="list" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {displayServices.map(({ id, title, description, features, goodFor, Icon }) => {

              return (
                <li
                  key={id}
                  id={id}
                  className="scroll-mt-28 bg-white border border-border rounded-lg p-6 md:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center justify-center w-[52px] h-[52px] rounded-lg bg-dark text-primary shrink-0">
                      <Icon size={26} strokeWidth={2.2} aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-primary/10 border border-primary/40 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-dark">
                      Available
                    </span>
                  </div>

                  <h3 className="mt-7 text-[25px] md:text-[30px] font-bold leading-tight text-dark">
                    {title}
                  </h3>

                  {description && (
                    <p className="mt-4 text-[16px] leading-relaxed text-muted">
                      {description}
                    </p>
                  )}

                  <ul className="mt-6 grid gap-3" aria-label={`${title} includes`}>
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[15px] text-body">
                        <Check
                          className="mt-[2px] shrink-0 text-primary"
                          size={18}
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-2" aria-label={`${title} is good for`}>
                    {goodFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-light-bg px-3 py-1.5 text-[13px] font-medium text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button
                      variant="primary"
                      size="md"
                      aria-label={`Book ${title}`}
                      onClick={() => setActiveService(title)}
                    >
                      Book This Service
                    </Button>
                  </div>
                </li>
              )
            })}
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
