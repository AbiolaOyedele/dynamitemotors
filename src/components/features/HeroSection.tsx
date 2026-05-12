'use client'

import Image from 'next/image'
import { Phone } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { HeroQuoteForm } from './HeroQuoteForm'
import { BUSINESS } from '@/config/constants'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-screen"
      aria-label="Welcome to Dynamite Motors"
    >
      <div className="relative flex flex-col min-h-screen">

        {/* Background image */}
        <Image
          src="/hero.jpg"
          alt="Mechanic working on a car engine"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlays */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center px-5 pt-24">
          <div className="w-full max-w-7xl mx-auto py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Left — text */}
              <div>
                <h1 className="text-[40px] sm:text-[52px] md:text-[62px] font-bold text-white leading-[1.05] tracking-tight mb-8">
                  Your Trusted<br />
                  Automotive Partner,<br />
                  <span className="text-primary">Several Years Strong.</span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-4">
                  <ButtonLink href="/contact" variant="green" size="lg">
                    Book a Service
                  </ButtonLink>
                  <a
                    href={BUSINESS.phoneTel}
                    className="inline-flex h-[60px] items-center justify-center gap-2 px-7 rounded-[100px] border border-white/30 text-white text-[16px] font-semibold hover:bg-white/10 transition-colors"
                  >
                    <Phone size={18} aria-hidden="true" />
                    {BUSINESS.phone}
                  </a>
                </div>
              </div>

              {/* Right — quote form (desktop only) */}
              <div className="hidden lg:block">
                <div className="w-full lg:w-[90%] mx-auto lg:ml-auto lg:mr-0 bg-white/[0.08] backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-7">
                  <h2 className="text-[20px] font-bold text-white mb-5">Request a Quote</h2>
                  <HeroQuoteForm />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
