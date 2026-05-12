'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BUSINESS } from '@/config/constants'
import type { QuoteApiResponse } from '@/types/quote.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

type FormFields = {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

const EMPTY: FormFields = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

const DEFAULT_SERVICES = [
  'Full Service',
  'Tyre Sale & Repair',
  'Air Conditioning',
  'Brakes',
  'Clutches',
  'Engine & Gear Repair',
  'Full Diagnostic',
  'Suspension',
  'Exhausts',
  'MOT Repairs',
]

type Props = {
  serviceNames?: string[]
}

export function QuoteForm({ serviceNames }: Props) {
  const [fields, setFields] = useState<FormFields>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const services =
    serviceNames && serviceNames.length > 0 ? serviceNames : DEFAULT_SERVICES
  const options = services.map((s) => ({ value: s, label: s }))

  function setField(key: keyof FormFields) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setFields((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const body: Record<string, string> = {
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        service: fields.service,
      }
      if (fields.message.trim()) {
        body['message'] = fields.message.trim()
      }

      const res = await fetch('/api/v1/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = (await res.json()) as QuoteApiResponse

      if ('error' in data) {
        setStatus('error')
        setErrorMsg(data.error.message)
        return
      }

      setStatus('success')
      setFields(EMPTY)
    } catch {
      setStatus('error')
      setErrorMsg(
        `Something went wrong. Please try again or call us on ${BUSINESS.phone}.`,
      )
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl bg-white border border-primary p-8 md:p-10 text-center"
      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full bg-dark mx-auto mb-5"
          aria-hidden="true"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-[24px] font-bold text-dark mb-3">
          Quote request sent!
        </h3>
        <p className="text-[17px] text-body leading-relaxed mb-6">
          Thank you — we&apos;ll be in touch shortly. If you need us straight
          away, give us a call.
        </p>
        <a
          href={BUSINESS.phoneTel}
          className="inline-flex items-center gap-2 text-primary text-[17px] font-semibold hover:text-primary-dark transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {BUSINESS.phone}
        </a>
        <div className="mt-6 pt-6 border-t border-primary">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-[15px] text-muted hover:text-primary transition-colors underline underline-offset-2"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        label="Your Name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={fields.name}
        onChange={setField('name')}
        placeholder="e.g. Margaret Smith"
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={fields.email}
        onChange={setField('email')}
        placeholder="your@email.com"
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
        value={fields.phone}
        onChange={setField('phone')}
        placeholder="e.g. 07700 900000"
      />
      <Select
        label="Service Required"
        name="service"
        required
        value={fields.service}
        onChange={setField('service')}
        options={options}
        placeholder="Please select a service..."
      />
      <Textarea
        label="Additional Details"
        name="message"
        value={fields.message}
        onChange={setField('message')}
        placeholder="Make, model, mileage, or anything else we should know…"
        hint="Optional — the more detail you give, the more accurate your quote."
        rows={4}
      />

      {status === 'error' && (
        <div
          role="alert"
          className="rounded-lg bg-error/5 border border-error/30 p-4"
        >
          <p className="text-[16px] text-error font-medium">{errorMsg}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="green"
        size="lg"
        className="w-full mt-1"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : (
          <span className="relative z-[1] inline-flex items-center gap-2 -translate-x-2 group-hover/btn:translate-x-2 transition-all duration-[800ms] ease-out">
            Send Quote Request
            <ArrowRight
              aria-hidden
              className="w-4 h-4 fill-none stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/btn:translate-x-2"
            />
          </span>
        )}
      </Button>

      <p className="text-[14px] text-muted text-center leading-relaxed">
        We typically respond within 1 hour during business hours.
      </p>
    </form>
  )
}
