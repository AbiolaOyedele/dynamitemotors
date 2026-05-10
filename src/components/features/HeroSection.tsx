'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { HeroQuoteForm } from './HeroQuoteForm'
import { BUSINESS, NAV_LINKS } from '@/config/constants'
import { cn } from '@/utils/cn'

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '100vh' }}
        aria-label="Welcome to Dynamite Motors"
      >
        <div className="relative flex flex-col h-full">

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

          {/* ── Floating pill nav ── */}
          <div className="relative z-50 w-full flex justify-center items-center py-4 px-6">

            {/* Desktop: floating white pill */}
            <div className="hidden md:flex items-center gap-6 bg-white px-6 py-2" style={{ borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>

                {/* Logo */}
                <Link href="/" onClick={close} className="flex items-center shrink-0">
                  <span className="text-dark text-[15px] font-bold tracking-tight leading-none whitespace-nowrap">
                    {BUSINESS.name.toUpperCase()}
                  </span>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1" aria-label="Main navigation">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'text-[15px] font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap',
                        pathname === href
                          ? 'bg-light-bg text-dark font-semibold'
                          : 'text-[#333] hover:text-dark hover:bg-light-bg',
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* CTA */}
                <ButtonLink href="/contact" variant="green" size="md" showArrow={false}>
                  Get a Quote
                </ButtonLink>
            </div>

            {/* Mobile: logo left + hamburger right */}
            <div className="md:hidden flex items-center justify-between w-full">
              <Link href="/" onClick={close} className="flex items-center gap-2">
                <span className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-dark border border-white/20" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </span>
                <span className="text-white text-[16px] font-bold tracking-tight">{BUSINESS.name.toUpperCase()}</span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex flex-col justify-center items-center w-[44px] h-[44px] gap-[5px] rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <span className="block w-[22px] h-[2px] bg-white rounded-full" />
                <span className="block w-[22px] h-[2px] bg-white rounded-full" />
                <span className="block w-[22px] h-[2px] bg-white rounded-full" />
              </button>
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex-1 flex items-center px-5">
            <div className="w-full max-w-7xl mx-auto py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Left — text */}
                <div>
                  <h1 className="text-[40px] sm:text-[52px] md:text-[62px] font-bold text-white leading-[1.05] tracking-tight mb-8">
                    Your Trusted<br />
                    Local Garage<br />
                    <span className="text-primary">in Gravesend</span>
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

        </div>
      </section>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed inset-0 z-50 md:hidden transition-opacity duration-300',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full max-w-sm bg-white flex flex-col transition-transform duration-300 ease-out',
            menuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-lg bg-primary" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-dark" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span className="text-dark text-[18px] font-bold tracking-tight">{BUSINESS.name.toUpperCase()}</span>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center w-[44px] h-[44px] rounded-lg hover:bg-light-bg transition-colors text-dark"
              aria-label="Close navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col px-6 pt-4 gap-1 grow" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  'flex items-center h-[56px] text-[18px] font-semibold tracking-wider uppercase rounded-xl px-4 transition-colors',
                  pathname === href
                    ? 'text-dark bg-primary'
                    : 'text-muted hover:bg-light-bg hover:text-dark',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-10 pt-4 shrink-0">
            <ButtonLink href="/contact" variant="filled" size="lg" className="w-full" onClick={close}>
              Get a Quote
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}
