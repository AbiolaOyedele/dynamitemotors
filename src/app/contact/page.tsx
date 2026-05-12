import type { Metadata } from 'next'
import { QuoteForm } from '@/components/features/QuoteForm'
import { BUSINESS } from '@/config/constants'
import { getServices } from '@/repositories/sanity.repository'

export const metadata: Metadata = {
  title: 'Contact Us & Get a Quote — Dynamite Motors',
  description:
    'Get a free quote from Dynamite Motors in Gravesend. Call 01474 643488, email us, or fill in our quick online form.',
  alternates: { canonical: 'https://www.dynamitemotors.com/contact' },
  openGraph: {
    url: 'https://www.dynamitemotors.com/contact',
    title: 'Contact Us & Get a Quote — Dynamite Motors',
    description:
      'Get a free quote from Dynamite Motors in Gravesend. Call 01474 643488, email us, or fill in our quick online form.',
  },
}

export default async function ContactPage() {
  const services = await getServices()
  const serviceNames = services.map((s) => s.title)

  return (
    <>
      {/* Page hero */}
      <section className="bg-dark pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[36px] md:text-[52px] font-bold text-white leading-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-[18px] text-white/65 leading-relaxed max-w-2xl mx-auto">
            Fill in the form below or give us a call — we&apos;re happy to help
            with any questions.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-light-bg py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* ── Left column: contact info + map ── */}
            <div className="flex flex-col gap-8">

              {/* Contact details card */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="text-[24px] md:text-[28px] font-bold text-dark mb-6">
                  Contact Details
                </h2>
                <address className="not-italic flex flex-col gap-6">

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-dark text-primary shrink-0 mt-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-muted uppercase tracking-wide mb-1">
                        Address
                      </p>
                      <a
                        href={BUSINESS.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[17px] text-dark hover:text-primary transition-colors leading-relaxed"
                      >
                        {BUSINESS.address}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-dark text-primary shrink-0 mt-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-muted uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href={BUSINESS.phoneTel}
                        className="text-[20px] font-bold text-primary hover:text-primary-dark transition-colors"
                      >
                        {BUSINESS.phone}
                      </a>
                      <p className="text-[14px] text-muted mt-0.5">
                        Tap to call
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-dark text-primary shrink-0 mt-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-muted uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <a
                        href={BUSINESS.emailHref}
                        className="text-[17px] text-primary hover:text-primary-dark transition-colors font-medium break-all"
                      >
                        {BUSINESS.email}
                      </a>
                    </div>
                  </div>

                </address>
              </div>

              {/* Google Maps embed */}
              <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
                <iframe
                  title="Dynamite Motors location on Google Maps"
                  src={BUSINESS.mapsEmbed}
                  width="100%"
                  height="300"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>

            {/* ── Right column: quote form ── */}
            <div className="bg-white rounded-2xl border border-border p-8">
              <h2 className="text-[24px] md:text-[28px] font-bold text-dark mb-2">
                Request a Free Quote
              </h2>
              <p className="text-[17px] text-muted leading-relaxed mb-8">
                Fill in the form and we&apos;ll get back to you with a price.
                No obligation.
              </p>
              <QuoteForm serviceNames={serviceNames} />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
