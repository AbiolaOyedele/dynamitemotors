import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import type { Service } from '@/types/service.types'

/** Full-page services layout — only used on /services. Never import on home page. */

type Props = {
  services: Service[]
}

const STATIC_SERVICES = [
  {
    id: 'servicing',
    title: 'Servicing',
    description: 'Dependable servicing and honest advice from a team that truly knows your car. Oil & oil filter change, air filter change.',
    features: ['Oil & oil filter change', 'Air filter change', 'All makes & models', 'Honest, transparent advice'],
    image: '/images/servicing.jpg',
  },
  {
    id: 'aircon',
    title: 'Air Con Gas & Repair',
    description: 'Breathe cleaner air and beat the heat with our comprehensive air con service. From simple regassing to complex system repairs, we ensure your comfort all year round.',
    features: ['AC regas', 'Leak detection & repair', 'Compressor inspection', 'Full system diagnosis'],
    image: '/images/aircon.jpg',
  },
  {
    id: 'tyres',
    title: 'Tyres Repair & Replacement',
    description: 'We supply and fit a wide range of tyres at competitive prices. Whether you need a puncture repair or a full set of new tyres, we have you covered.',
    features: ['Puncture repairs', 'Supply & fit all sizes', 'Wheel balancing', 'TPMS reset'],
    image: '/images/tyres.jpg',
  },
  {
    id: 'mot',
    title: 'MOT Checks & Repairs',
    description: 'MOT checks and repairs to ensure your vehicle is in the best condition possible. We are an authorised test station — same-day certificates issued.',
    features: ['Authorised test station', 'Same-day certificate', 'Free advisory retest', 'Repair & retest available'],
    image: '/images/mot-bay.jpg',
  },
]

const FACILITIES = [
  {
    image: '/images/reception.jpg',
    label: 'A clean & tidy reception room to ensure your comfort while your car gets attended to.',
  },
  {
    image: '/images/parking.jpg',
    label: 'On site parking for queries & appointments.',
  },
]

function ServiceIcon({ id }: { id: string }) {
  if (id === 'mot')
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  if (id === 'servicing')
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    )
  if (id === 'tyres')
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    )
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.7 7.7a2.5 2.5 0 0 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 0 1 11 8H2" /><path d="M12.6 19.4A2 2 0 0 0 14 16H2" />
    </svg>
  )
}

export function ServicesPageContent({ services }: Props) {
  // Prefer Sanity data if available, otherwise fall back to static content
  const hasSanityData = services.length > 0

  return (
    <>
      {/* Service cards */}
      <section aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">Our Services</h2>
        <ul role="list">
          {STATIC_SERVICES.map((svc, index) => {
            const imageRight = index % 2 === 0
            // Use Sanity description if we have it and it matches
            const sanityMatch = hasSanityData
              ? services.find((s) => s.slug.current === svc.id || s.title.toLowerCase().includes(svc.id))
              : null
            const description = sanityMatch?.description ?? svc.description
            const features = (sanityMatch?.features ?? svc.features) ?? []

            return (
              <li key={svc.id} className="border-b border-[#E8E8E8] last:border-b-0">
                <div className={`grid grid-cols-1 lg:grid-cols-2`}>

                  {/* Image */}
                  <div className={`relative min-h-[280px] lg:min-h-[420px] bg-[#ebebeb] ${imageRight ? 'lg:order-2' : 'lg:order-1'}`}>
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center gap-6 px-8 py-12 md:px-14 md:py-16 bg-white ${imageRight ? 'lg:order-1' : 'lg:order-2'}`}>

                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a1a1a] text-[#1ED760] shrink-0">
                      <ServiceIcon id={svc.id} />
                    </div>

                    <h3 className="text-[28px] md:text-[36px] font-bold text-[#1a1a1a] leading-tight">
                      {svc.title}
                    </h3>

                    <p className="text-[16px] md:text-[17px] text-[#555555] leading-relaxed">
                      {description}
                    </p>

                    <ul className="flex flex-col gap-2.5" aria-label={`${svc.title} includes`}>
                      {features.map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-[15px] text-[#333333]">
                          <svg className="shrink-0 text-[#1ED760]" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                          </svg>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <ButtonLink
                        href="/contact"
                        variant="primary"
                        size="lg"
                        aria-label={`Book ${svc.title}`}
                      >
                        Book Now
                      </ButtonLink>
                    </div>
                  </div>

                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Facilities */}
      <section className="bg-[#F5F5F5] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[22px] md:text-[26px] font-bold text-[#1a1a1a] mb-8 text-center">
            Our Facilities
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto" role="list">
            {FACILITIES.map(({ image, label }) => (
              <li key={label} className="overflow-hidden rounded-2xl bg-white border border-[#E8E8E8]">
                <div className="relative h-[220px] bg-[#ebebeb]">
                  <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="px-6 py-5 text-[15px] text-[#444444] leading-snug font-medium text-center">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
