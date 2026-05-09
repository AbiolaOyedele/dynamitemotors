'use client'

import { useState } from 'react'
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

const EMPTY: FormFields = { name: '', email: '', phone: '', service: '', message: '' }

const SERVICES = [
  'MOT Testing',
  'Full Service',
  'Interim Service',
  'Brake Repair',
  'Tyre Fitting',
  'Exhaust Repair',
  'General Repair',
  'Other',
]

const inputCls =
  'w-full h-[52px] rounded-xl bg-white/5 border border-white/30 text-white text-[16px] px-4 ' +
  'placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] focus:bg-white/10 ' +
  'hover:border-white/50 transition-all duration-200'

const selectCls =
  'w-full h-[52px] rounded-xl bg-white/5 border border-white/30 text-white text-[16px] px-4 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] focus:bg-white/10 ' +
  'hover:border-white/50 transition-all duration-200 appearance-none cursor-pointer ' +
  '[&>option]:bg-[#1a1a1a] [&>option]:text-white'

const textareaCls =
  'w-full rounded-xl bg-white/5 border border-white/30 text-white text-[16px] px-4 py-3 ' +
  'placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#1ED760] focus:border-[#1ED760] focus:bg-white/10 ' +
  'hover:border-white/50 transition-all duration-200 resize-none'

export function HeroQuoteForm() {
  const [fields, setFields] = useState<FormFields>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function setField(key: keyof FormFields) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      if (fields.message.trim()) body['message'] = fields.message.trim()

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
      setErrorMsg(`Something went wrong. Please try again or call us on ${BUSINESS.phone}.`)
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="text-center py-12">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a1a] mx-auto mb-5"
          aria-hidden="true"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-[22px] font-bold text-white mb-3">Quote request sent!</h3>
        <p className="text-[16px] text-white/70 leading-relaxed mb-6">
          We&apos;ll be in touch shortly. Need us straight away?
        </p>
        <a
          href={BUSINESS.phoneTel}
          className="inline-flex items-center gap-2 text-[#1ED760] text-[17px] font-semibold hover:text-white transition-colors"
        >
          Call {BUSINESS.phone}
        </a>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-[14px] text-white/50 hover:text-white transition-colors underline underline-offset-2"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          className={inputCls}
          type="text"
          name="name"
          placeholder="Name"
          autoComplete="name"
          required
          value={fields.name}
          onChange={setField('name')}
          aria-label="Your name"
        />
        <input
          className={inputCls}
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={fields.email}
          onChange={setField('email')}
          aria-label="Email address"
          suppressHydrationWarning
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          className={inputCls}
          type="tel"
          name="phone"
          placeholder="Phone number"
          autoComplete="tel"
          required
          value={fields.phone}
          onChange={setField('phone')}
          aria-label="Phone number"
        />
        <div className="relative">
          <select
            className={selectCls}
            name="service"
            required
            value={fields.service}
            onChange={setField('service')}
            aria-label="Service required"
          >
            <option value="" disabled>Select Service</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <textarea
        className={textareaCls}
        name="message"
        placeholder="Tell us about your vehicle and what needs attention…"
        rows={3}
        value={fields.message}
        onChange={setField('message')}
        aria-label="Additional details"
      />

      {status === 'error' && (
        <div role="alert" className="rounded-xl bg-red-950/50 border border-red-500/30 px-4 py-3">
          <p className="text-[15px] text-red-400">{errorMsg}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="green"
        size="lg"
        className="w-full"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : 'Get a Free Quote'}
      </Button>

      <p className="text-[13px] text-white/40 text-center">
        We typically respond within 2 hours during business hours.
      </p>
    </form>
  )
}
