import type { Metadata } from 'next'
import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'
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
            MOT checks, servicing, air con and tyres — all handled by experienced mechanics in Gravesend.
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
              <Phone size={16} aria-hidden="true" />
              {BUSINESS.phone}
            </a>
          </div>
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center justify-center gap-2 text-[14px] font-medium text-white/55 hover:text-white transition-colors"
          >
            <MapPin size={16} aria-hidden="true" />
            {BUSINESS.address}
          </a>
        </div>
      </section>
    </>
  )
}
