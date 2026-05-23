'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { BookingCalendar } from '@/components/ui/BookingCalendar'
import { BUSINESS } from '@/config/constants'
import type { QuoteApiResponse } from '@/types/quote.types'

type Status = 'idle' | 'loading' | 'success' | 'error'

type FormFields = {
  name: string
  email: string
  phone: string
  service: string
  message: string
  preferredDate: string
  preferredTime: string
}

type FieldErrors = Partial<Record<keyof FormFields, string>>

const EMPTY: FormFields = {
  name: '', email: '', phone: '', service: '', message: '',
  preferredDate: '', preferredTime: '',
}

const ALL_TIMES = [
  { value: 'Morning (9am–12pm)',      label: 'Morning (9am–12pm)' },
  { value: 'Afternoon (12pm–3pm)',    label: 'Afternoon (12pm–3pm)' },
  { value: 'Late Afternoon (3pm–5pm)', label: 'Late Afternoon (3pm–5pm)' },
]

// Saturday: garage closes at 3pm — morning and 12pm–3pm only
const SAT_TIMES = ALL_TIMES.slice(0, 2)

type Props = {
  initialService?: string
  /** Called after a successful submission — used by ServiceQuoteModal to close itself. */
  onSuccess?: () => void
}

const SERVICES = [
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
  'Others',
]

// ── Styles ────────────────────────────────────────────────────────────────────

const inputBase =
  'w-full h-[52px] rounded-xl text-white text-[16px] px-4 ' +
  'placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all duration-200'

const inputNormal =
  inputBase +
  ' bg-white/5 border border-white/30 focus:ring-primary focus:border-primary focus:bg-white/10 hover:border-white/50'

const inputError =
  inputBase +
  ' bg-red-950/30 border border-red-400/60 focus:ring-red-400 focus:border-red-400'

const selectBase =
  'w-full h-[52px] rounded-xl text-[16px] px-4 ' +
  'focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer ' +
  '[&>option]:bg-dark [&>option]:text-white'

const selectNormal =
  selectBase +
  ' bg-white/5 border border-white/30 text-white focus:ring-primary focus:border-primary focus:bg-white/10 hover:border-white/50'

const selectError =
  selectBase +
  ' bg-red-950/30 border border-red-400/60 text-white focus:ring-red-400 focus:border-red-400'

const textareaCls =
  'w-full rounded-xl bg-white/5 border border-white/30 text-white text-[16px] px-4 py-3 ' +
  'placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/10 ' +
  'hover:border-white/50 transition-all duration-200 resize-none'

// ── Validation ────────────────────────────────────────────────────────────────

function validate(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {}
  if (!fields.name.trim())
    errors.name = 'Please enter your name'
  if (!fields.email.trim())
    errors.email = 'Please enter your email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Please enter a valid email'
  if (!fields.phone.trim())
    errors.phone = 'Please enter your phone number'
  else if (fields.phone.trim().replace(/\D/g, '').length < 7)
    errors.phone = 'Please enter a valid phone number'
  if (!fields.service)
    errors.service = 'Please select a service'
  return errors
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroQuoteForm({ initialService, onSuccess }: Props) {
  const options = initialService && !SERVICES.includes(initialService)
    ? [initialService, ...SERVICES]
    : SERVICES

  const [fields, setFields] = useState<FormFields>({ ...EMPTY, service: initialService ?? '' })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const isSaturday = selectedDate?.getDay() === 6
  const timeSlots = isSaturday ? SAT_TIMES : ALL_TIMES

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [showToast, setShowToast] = useState(false)

  function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    // If switching to Saturday, clear Late Afternoon which isn't available
    if (date?.getDay() === 6 && fields.preferredTime === 'Late Afternoon (3pm–5pm)') {
      setFields((prev) => ({ ...prev, preferredTime: '' }))
    }
  }

  function setField(key: keyof FormFields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }))
      if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')

    // Client-side validation first
    const errors = validate(fields)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setStatus('loading')

    try {
      const body: Record<string, string> = {
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        service: fields.service,
      }
      if (fields.message.trim()) body['message'] = fields.message.trim()
      if (selectedDate) body['preferredDate'] = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      if (fields.preferredTime) body['preferredTime'] = fields.preferredTime

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
      setSelectedDate(undefined)
      setShowToast(true)
      onSuccess?.()
    } catch {
      setStatus('error')
      setErrorMsg(`Something went wrong. Please try again or call us on ${BUSINESS.phone}.`)
    }
  }

  // ── Success state (shown when not inside a modal, i.e. no onSuccess) ──────
  if (status === 'success' && !onSuccess) {
    return (
      <>
        <div role="status" aria-live="polite" className="text-center py-12">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full bg-dark mx-auto mb-5"
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
            className="inline-flex items-center gap-2 text-primary text-[17px] font-semibold hover:text-white transition-colors"
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

        <Toast show={showToast} onDismiss={() => setShowToast(false)} />
      </>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-1">
            <input
              className={fieldErrors.name ? inputError : inputNormal}
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="name"
              value={fields.name}
              onChange={setField('name')}
              aria-label="Your name"
              aria-invalid={fieldErrors.name ? 'true' : undefined}
            />
            {fieldErrors.name && (
              <p role="alert" className="text-[12px] text-red-400 px-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              className={fieldErrors.email ? inputError : inputNormal}
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={fields.email}
              onChange={setField('email')}
              aria-label="Email address"
              aria-invalid={fieldErrors.email ? 'true' : undefined}
              suppressHydrationWarning
            />
            {fieldErrors.email && (
              <p role="alert" className="text-[12px] text-red-400 px-1">{fieldErrors.email}</p>
            )}
          </div>
        </div>

        {/* Row 2: Phone + Service */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-1">
            <input
              className={fieldErrors.phone ? inputError : inputNormal}
              type="tel"
              name="phone"
              placeholder="Phone number"
              autoComplete="tel"
              value={fields.phone}
              onChange={setField('phone')}
              aria-label="Phone number"
              aria-invalid={fieldErrors.phone ? 'true' : undefined}
            />
            {fieldErrors.phone && (
              <p role="alert" className="text-[12px] text-red-400 px-1">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative">
              <select
                className={fieldErrors.service ? selectError : selectNormal}
                name="service"
                value={fields.service}
                onChange={setField('service')}
                aria-label="Service required"
                aria-invalid={fieldErrors.service ? 'true' : undefined}
              >
                <option value="" disabled>Select Service</option>
                {options.map((s) => (
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
            {fieldErrors.service && (
              <p role="alert" className="text-[12px] text-red-400 px-1">{fieldErrors.service}</p>
            )}
          </div>
        </div>

        {/* Booking date + time — modal only */}
        {onSuccess && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-4 items-start">
              {/* Date picker popup */}
              <BookingCalendar selected={selectedDate} onSelect={handleDateSelect} />

              {/* Time slot */}
              <div className="relative">
                <select
                  className={selectNormal}
                  name="preferredTime"
                  value={fields.preferredTime}
                  onChange={setField('preferredTime')}
                  aria-label="Preferred time slot (optional)"
                >
                  <option value="" disabled>Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
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

            {isSaturday && (
              <p className="text-[12px] text-white/45 px-1">
                Saturday hours are 9am–3pm. Late afternoon slots are not available.
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <textarea
          className={textareaCls}
          name="message"
          placeholder="Tell us about your vehicle and what needs attention…"
          rows={3}
          value={fields.message}
          onChange={setField('message')}
          aria-label="Additional details"
        />

        {/* API error */}
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
          {status === 'loading' ? 'Sending…' : onSuccess ? 'Book a Service' : 'Get a Quote'}
        </Button>

        <p className="text-[13px] text-white/40 text-center">
          We typically respond within 1 hour during business hours.
        </p>
      </form>

      {/* Toast is only rendered here for the hero section (non-modal) use */}
      {!onSuccess && <Toast show={showToast} onDismiss={() => setShowToast(false)} />}
    </>
  )
}
