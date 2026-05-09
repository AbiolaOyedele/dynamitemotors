import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import type { Offer } from '@/types/offer.types'

type Props = {
  offers: Offer[]
}

function formatExpiry(isoDate: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate))
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardBody className="flex flex-col gap-4 flex-1">
        {/* Badge */}
        {offer.badge && (
          <div>
            <Badge variant="green">{offer.badge}</Badge>
          </div>
        )}

        {/* Title */}
        <h3 className="text-[22px] md:text-[24px] font-bold text-[#1a1a1a] leading-snug">
          {offer.title}
        </h3>

        {/* Description */}
        {offer.description && (
          <p className="text-[17px] text-[#666666] leading-relaxed flex-1">
            {offer.description}
          </p>
        )}

        {/* Expiry */}
        {offer.expiresAt && (
          <p className="flex items-center gap-2 text-[14px] text-[#666666]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>
              <span className="font-semibold">Expires:</span>{' '}
              {formatExpiry(offer.expiresAt)}
            </span>
          </p>
        )}
      </CardBody>

      <CardFooter>
        <ButtonLink
          href="/contact"
          size="md"
          className="w-full"
          aria-label={`Claim this offer — ${offer.title}`}
        >
          Claim This Offer
        </ButtonLink>
      </CardFooter>
    </Card>
  )
}

export function OffersGrid({ offers }: Props) {
  if (offers.length === 0) {
    return (
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#1a1a1a]">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1ED760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div>
              <p className="text-[20px] font-bold text-[#1a1a1a] mb-2">
                No current offers
              </p>
              <p className="text-[17px] text-[#666666] leading-relaxed">
                Check back soon — we regularly run promotions on MOTs,
                servicing, and more.
              </p>
            </div>
            <ButtonLink href="/contact" size="lg" variant="outline">
              Ask About Discounts
            </ButtonLink>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="offers-grid-heading" className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Current offers"
        >
          {offers.map((offer) => (
            <li key={offer._id}>
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
