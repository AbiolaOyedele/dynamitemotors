import Image from 'next/image'
import { HeroQuoteForm } from './HeroQuoteForm'

export function HeroSection() {
  return (
    <section aria-label="Welcome to Dynamite Motors" className="relative min-h-[700px] md:min-h-[760px] overflow-hidden flex flex-col">

      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Mechanic working on a car engine"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay for text legibility */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

      {/* Subtle green tint on left */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content — aligned to bottom */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full pl-9 md:pl-12 pr-9 md:pr-12 pb-12 md:pb-16 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">

            {/* Left — text */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-[3px] bg-[#1ED760] rounded-full" aria-hidden="true" />
                <span className="text-[#1ED760] text-[12px] font-bold tracking-widest uppercase">
                  Dynamite Motors&apos; Services
                </span>
              </div>

              <h1 className="text-[40px] sm:text-[52px] md:text-[62px] font-bold text-white leading-[1.05] tracking-tight mb-5">
                Your Trusted<br />
                Local Garage<br />
                <span className="text-[#1ED760]">in Gravesend</span>
              </h1>

              <p className="text-[17px] md:text-[18px] text-white/65 leading-relaxed mb-8 max-w-md">
                Expert servicing, MOTs and repairs for all makes and models.
                Honest advice, fair prices — no jargon.
              </p>

            </div>

            {/* Right — quote form */}
            <div>
              <div className="w-full lg:w-[90%] mx-auto lg:ml-auto lg:mr-0 bg-white/[0.08] backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-7">
                <h2 className="text-[20px] font-bold text-white mb-5">Request a Quote</h2>
                <HeroQuoteForm />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
