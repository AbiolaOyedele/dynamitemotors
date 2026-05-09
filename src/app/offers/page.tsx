import type { Metadata } from 'next'
import { OffersGrid } from '@/components/features/OffersGrid'
import { getActiveOffers } from '@/repositories/sanity.repository'

export const metadata: Metadata = {
  title: 'Current Offers — Dynamite Motors',
  description:
    'Special promotions and discounts on MOTs, car servicing, brakes and more at Dynamite Motors in Gravesend.',
}

export default async function OffersPage() {
  const offers = await getActiveOffers()

  return (
    <>
      {/* Page hero */}
      <section className="bg-[#1a1a1a] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[36px] md:text-[52px] font-bold text-white leading-tight mb-4">
            Current Offers
          </h1>
          <p className="text-[18px] text-[#b0b0b0] leading-relaxed max-w-2xl mx-auto">
            Take advantage of our latest deals — limited availability, so don&apos;t miss out.
          </p>
        </div>
      </section>

      <OffersGrid offers={offers} />
    </>
  )
}
