'use client'

import { useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

// ── Types ─────────────────────────────────────────────────────────────────────

type Settings = {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  mapsUrl: string
  hoursMonFri: string
  hoursSat: string
  hoursSun: string
  servicesHeroImage: string
  colorPrimary: string
  colorPrimaryDark: string
  colorDark: string
  colorBody: string
  colorMuted: string
  colorLightBg: string
  colorBorder: string
}

type SectionKey = 'business' | 'hours' | 'images' | 'colours' | 'security'

const COLOUR_FIELDS: {
  key: keyof Settings
  label: string
  description: string
}[] = [
  { key: 'colorPrimary',     label: 'Brand',          description: 'Main accent — buttons, highlights' },
  { key: 'colorPrimaryDark', label: 'Brand (hover)',   description: 'Darker shade on hover states' },
  { key: 'colorDark',        label: 'Dark',            description: 'Dark backgrounds and headings' },
  { key: 'colorBody',        label: 'Body Text',       description: 'Main paragraph text' },
  { key: 'colorMuted',       label: 'Muted',           description: 'Secondary / subdued text' },
  { key: 'colorLightBg',     label: 'Light BG',        description: 'Light section backgrounds' },
  { key: 'colorBorder',      label: 'Border',          description: 'Dividers and input outlines' },
]

// ── Shared input class ────────────────────────────────────────────────────────

const INPUT = 'w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white'

// ── Accordion panel ───────────────────────────────────────────────────────────

function SectionPanel({
  title,
  description,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  description: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-light-bg/60 transition-colors"
      >
        <div>
          <p className="text-[15px] font-bold text-dark">{title}</p>
          <p className="text-[12px] text-muted mt-0.5">{description}</p>
        </div>
        <svg
          className={`w-4 h-4 text-muted shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 pt-4 border-t border-border/60">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Compact colour swatch + hex input ─────────────────────────────────────────

function CompactColorField({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 bg-light-bg rounded-lg border border-border">
      {/* Colour swatch — clicking opens the native colour picker */}
      <label className="relative shrink-0 cursor-pointer" title={description}>
        <span
          className="block w-8 h-8 rounded-md ring-1 ring-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          aria-label={label}
        />
      </label>

      {/* Label + hex input */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wide leading-none mb-1.5">
          {label}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          placeholder="#000000"
          className="w-full h-[28px] rounded-md border border-border px-2 text-[12px] font-mono text-body focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
        />
      </div>
    </div>
  )
}

// ── Change password form ──────────────────────────────────────────────────────

function ChangePasswordForm() {
  const router = useRouter()
  const [current, setCurrent]   = useState('')
  const [next, setNext]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!success) return
    timerRef.current = setTimeout(() => { router.push('/dynamite') }, 2500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [success, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (next !== confirm) { setError('New passwords do not match.'); return }
    if (next.length < 8)  { setError('New password must be at least 8 characters.'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) { setError(json.error ?? 'Failed to update password.'); return }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <div>
          <p className="text-[14px] font-semibold text-green-800">Password updated successfully.</p>
          <p className="text-[13px] text-green-700 mt-0.5">Logging you out — please sign in with your new password.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Current Password</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password" required className={INPUT} />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">New Password</label>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password" minLength={8} required className={INPUT} />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Confirm Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password" required className={INPUT} />
        </div>
      </div>

      <p className="text-[12px] text-muted">Minimum 8 characters. Changing your password logs out all active sessions.</p>

      {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}

      <button type="submit" disabled={saving}
        className="h-[40px] px-5 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50">
        {saving ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsAdmin() {
  const [data, setData]     = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const { setDirty }        = useUnsavedChanges()

  // All sections collapsed by default except Business Info
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    business: true,
    hours:    false,
    images:   false,
    colours:  false,
    security: false,
  })

  function toggle(key: SectionKey) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    fetch('/api/admin/content?section=settings')
      .then((r) => r.json())
      .then((r: { data: Settings }) => setData(r.data))
      .catch(() => setError('Failed to load content'))
  }, [])

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev))
    setDirty(true)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/content?section=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!data && !error) return <div className="text-muted">Loading…</div>
  if (!data) return <div className="text-red-500 text-[14px]">{error}</div>

  return (
    <div>
      <h1 className="text-[28px] font-bold text-dark mb-1">Settings</h1>
      <p className="text-[15px] text-muted mb-6">
        Open a section to edit it, then save when done.
      </p>

      <form onSubmit={handleSave} className="space-y-3 max-w-2xl">

        {/* ── Business Info ── */}
        <SectionPanel
          title="Business Info"
          description="Name, contact details, address"
          isOpen={open.business}
          onToggle={() => toggle('business')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Business Name</label>
                <input type="text" value={data.name}
                  onChange={(e) => update('name', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Tagline</label>
                <input type="text" value={data.tagline}
                  onChange={(e) => update('tagline', e.target.value)} className={INPUT} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Phone</label>
                <input type="tel" value={data.phone}
                  onChange={(e) => update('phone', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Email</label>
                <input type="email" value={data.email}
                  onChange={(e) => update('email', e.target.value)} className={INPUT} />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Address</label>
              <input type="text" value={data.address}
                onChange={(e) => update('address', e.target.value)} className={INPUT} />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Google Maps URL</label>
              <input type="url" value={data.mapsUrl}
                onChange={(e) => update('mapsUrl', e.target.value)} className={INPUT} />
            </div>
          </div>
        </SectionPanel>

        {/* ── Opening Hours ── */}
        <SectionPanel
          title="Opening Hours"
          description="Mon – Fri, Saturday, Sunday"
          isOpen={open.hours}
          onToggle={() => toggle('hours')}
        >
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Mon – Fri</label>
              <input type="text" value={data.hoursMonFri} placeholder="e.g. 9am – 6pm"
                onChange={(e) => update('hoursMonFri', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Saturday</label>
              <input type="text" value={data.hoursSat} placeholder="e.g. 9am – 3pm"
                onChange={(e) => update('hoursSat', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Sunday</label>
              <input type="text" value={data.hoursSun} placeholder="e.g. Closed"
                onChange={(e) => update('hoursSun', e.target.value)} className={INPUT} />
            </div>
          </div>
        </SectionPanel>

        {/* ── Page Images ── */}
        <SectionPanel
          title="Page Images"
          description="Hero images used on interior pages"
          isOpen={open.images}
          onToggle={() => toggle('images')}
        >
          <ImageUploader
            context="services"
            currentImage={data.servicesHeroImage || undefined}
            customFilename="services-hero.jpg"
            label="Services Page Hero Image"
            onUpload={(path) => update('servicesHeroImage', path)}
          />
        </SectionPanel>

        {/* ── Brand Colours ── */}
        <SectionPanel
          title="Brand Colours"
          description="Click a swatch or type a hex code — changes apply site-wide"
          isOpen={open.colours}
          onToggle={() => toggle('colours')}
        >
          <div className="grid grid-cols-2 gap-2">
            {COLOUR_FIELDS.map(({ key, label, description }) => (
              <CompactColorField
                key={key}
                label={label}
                description={description}
                value={(data[key] as string) || '#000000'}
                onChange={(v) => update(key, v as Settings[typeof key])}
              />
            ))}
          </div>
        </SectionPanel>

        {/* ── Save ── */}
        <div className="flex items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-[14px] text-green-600 font-medium">Saved successfully!</span>}
          {error && <span className="text-[14px] text-red-500 font-medium">{error}</span>}
        </div>
      </form>

      {/* ── Security — separate form, never triggers main save ── */}
      <div className="mt-3 max-w-2xl">
        <SectionPanel
          title="Security"
          description="Change your admin password"
          isOpen={open.security}
          onToggle={() => toggle('security')}
        >
          <ChangePasswordForm />
        </SectionPanel>
      </div>
    </div>
  )
}
