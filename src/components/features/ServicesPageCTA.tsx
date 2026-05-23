'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ServiceQuoteModal } from './ServiceQuoteModal'
import { BUSINESS } from '@/config/constants'

export function ServicesPageCTA() {
  const [modalService, setModalService] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="green" size="lg" onClick={() => setModalService('')}>
          Book a Service
        </Button>
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

      <ServiceQuoteModal
        service={modalService}
        onClose={() => setModalService(null)}
      />
    </>
  )
}
