'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BUSINESS, NAV_LINKS } from '@/config/constants'

export function Footer() {
  const pathname = usePathname()

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="px-9 md:px-[10%] py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <p className="text-[#1ED760] text-[22px] font-bold tracking-tight leading-none">
              {BUSINESS.name.toUpperCase()}
            </p>
            <p className="text-[#999999] text-[16px] leading-relaxed">
              {BUSINESS.tagline}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4 md:items-center md:text-center">
            <h3 className="text-[17px] font-semibold text-white">Contact Us</h3>
            <address className="not-italic flex flex-col gap-3 md:items-center">
              <p className="text-[#999999] text-[16px] leading-relaxed">
                {BUSINESS.address}
              </p>
              <a
                href={BUSINESS.phoneTel}
                className="text-[16px] text-[#cccccc] hover:text-[#1ED760] transition-colors font-medium"
              >
                {BUSINESS.phone}
              </a>
              <a
                href={BUSINESS.emailHref}
                className="text-[16px] text-[#cccccc] hover:text-[#1ED760] transition-colors font-medium break-all"
              >
                {BUSINESS.email}
              </a>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] text-[#1ED760] hover:text-white transition-colors font-medium"
              >
                Find Us on Maps ↗
              </a>
            </address>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <h3 className="text-[17px] font-semibold text-white">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3 md:items-end">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive =
                    href === '/' ? pathname === '/' : pathname.startsWith(href)

                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`text-[16px] transition-colors ${
                          isActive
                            ? 'text-[#1ED760] font-semibold'
                            : 'text-[#999999] hover:text-[#1ED760]'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#333333]">
          <p className="text-[#666666] text-[14px] text-center">
            © 2025 {BUSINESS.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
