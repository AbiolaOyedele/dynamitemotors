import type { Metadata } from 'next'
import { ServicesPageContent } from '@/components/features/ServicesPageContent'
import { ButtonLink } from '@/components/ui/Button'
import { getServices } from '@/repositories/sanity.repository'
import { BUSINESS } from '@/config/constants'

export const metadata: Metadata = {
  title: 'Our Services — Dynamite Motors',
  description:
    'MOT checks, servicing, air con gas & repair, and tyres — all handled by experienced mechanics at Dynamite Motors in Gravesend.',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[36px] md:text-[56px] font-bold text-white leading-tight mb-5">
            Our Services
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#b0b0b0] leading-relaxed max-w-2xl mx-auto mb-8">
            Everything your car needs, handled by experienced mechanics you can trust.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact" variant="green" size="lg">
              Book a Service
            </ButtonLink>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[100px] border border-white/25 text-white text-[15px] font-semibold hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      <ServicesPageContent services={services} />

      {/* Bottom CTA */}
      <section className="bg-[#1a1a1a] py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-4">
            Not sure what your car needs?
          </h2>
          <p className="text-[16px] text-[#b0b0b0] mb-8">
            Call us or drop in — our team will take a look and give you an honest, no-obligation assessment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact" variant="green" size="lg">
              Get a Free Quote
            </ButtonLink>
            <a
              href={BUSINESS.phoneTel}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[100px] border border-white/25 text-white text-[15px] font-semibold hover:bg-white/10 transition-colors"
            >
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
