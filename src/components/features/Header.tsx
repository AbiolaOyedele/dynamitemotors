'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatedButtonLink, ButtonLink } from '@/components/ui/Button'
import { BUSINESS, NAV_LINKS } from '@/config/constants'
import { cn } from '@/utils/cn'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              onClick={close}
            >
              {/* Green accent mark */}
              <span
                className="flex items-center justify-center w-[32px] h-[32px] rounded-lg bg-[#1ED760] shrink-0"
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span className="text-[#1a1a1a] text-[18px] font-bold tracking-tight leading-none">
                {BUSINESS.name.toUpperCase()}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-[14px] font-semibold tracking-wider uppercase transition-colors hover:text-[#1a1a1a]',
                    pathname === href
                      ? 'text-[#1a1a1a]'
                      : 'text-[#666666]',
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA + Mobile hamburger */}
            <div className="flex items-center gap-3">
              <AnimatedButtonLink
                href="/contact"
                label="Get a Quote"
                className="hidden md:inline-flex"
              />

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="md:hidden flex flex-col justify-center items-center w-[44px] h-[44px] gap-[5px] rounded-lg hover:bg-[#F5F5F5] transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <span className="block w-[22px] h-[2px] bg-[#1a1a1a] rounded-full" />
                <span className="block w-[22px] h-[2px] bg-[#1a1a1a] rounded-full" />
                <span className="block w-[22px] h-[2px] bg-[#1a1a1a] rounded-full" />
              </button>
            </div>

          </div>
        </div>
      </header>

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
        <div
          className="absolute inset-0 bg-black/50"
          onClick={close}
          aria-hidden="true"
        />

        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full max-w-sm bg-white flex flex-col transition-transform duration-300 ease-out',
            menuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#E8E8E8] shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-lg bg-[#1ED760]" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span className="text-[#1a1a1a] text-[18px] font-bold tracking-tight">
                {BUSINESS.name.toUpperCase()}
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center w-[44px] h-[44px] rounded-lg hover:bg-[#F5F5F5] transition-colors text-[#1a1a1a]"
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
                    ? 'text-[#1a1a1a] bg-[#1ED760]'
                    : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1a1a1a]',
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
