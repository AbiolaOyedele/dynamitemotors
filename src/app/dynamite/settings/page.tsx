'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

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

const COLOUR_FIELDS: {
  key: keyof Settings
  label: string
  description: string
}[] = [
  { key: 'colorPrimary',     label: 'Brand Colour',        description: 'Main accent — buttons, headings, highlights' },
  { key: 'colorPrimaryDark', label: 'Brand Colour (hover)', description: 'Darker shade used on hover states' },
  { key: 'colorDark',        label: 'Dark',                 description: 'Dark backgrounds and strong headings' },
  { key: 'colorBody',        label: 'Body Text',            description: 'Main paragraph text colour' },
  { key: 'colorMuted',       label: 'Muted Text',           description: 'Secondary / subdued text' },
  { key: 'colorLightBg',     label: 'Light Background',     description: 'Light section backgrounds' },
  { key: 'colorBorder',      label: 'Border',               description: 'Dividers and input outlines' },
]

function ColorField({
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
      <label className="relative shrink-0 cursor-pointer">
        <span
          className="block w-12 h-12 rounded-lg border-2 border-white shadow-md ring-1 ring-border"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-dark">{label}</p>
        <p className="text-[12px] text-muted mb-2">{description}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          placeholder="#000000"
          className="w-36 h-[36px] rounded-lg border border-border px-3 text-[14px] font-mono text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  )
}

// ── Change password form ──────────────────────────────────────────────────────

function ChangePasswordForm() {
  const router = useRouter()
  const [current, setCurrent]     = useState('')
  const [next, setNext]           = useState('')
  const [confirm, setConfirm]     = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [success, setSuccess]     = useState(false)
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Redirect to login after success banner fades
  useEffect(() => {
    if (!success) return
    timerRef.current = setTimeout(() => {
      router.push('/dynamite')
    }, 2500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [success, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) {
        setError(json.error ?? 'Failed to update password.')
        return
      }
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
        <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div>
          <p className="text-[14px] font-semibold text-green-800">Password updated successfully.</p>
          <p className="text-[13px] text-green-700 mt-0.5">Logging you out — please sign in with your new password.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-[13px] font-semibold text-body mb-2">Current Password</label>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-body mb-2">New Password</label>
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <p className="text-[12px] text-muted mt-1.5">Minimum 8 characters.</p>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-body mb-2">Confirm New Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {error && (
        <p className="text-[13px] text-red-600 font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
      >
        {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsAdmin() {
  const [data, setData] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDirty } = useUnsavedChanges()

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

  if (!data && !error) return <div className="text-muted">Loading...</div>
  if (!data) return <div className="text-red-500 text-[14px]">{error}</div>

  return (
    <div>
      <h1 className="text-[28px] font-bold text-dark mb-2">Settings</h1>
      <p className="text-[16px] text-muted mb-8">
        Business information, opening hours, and brand colours.
      </p>

      <form onSubmit={handleSave} className="space-y-10 max-w-2xl">

        {/* Business Info */}
        <section className="space-y-5">
          <h2 className="text-[17px] font-bold text-dark">Business Info</h2>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Business Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Tagline</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => update('address', e.target.value)}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Phone</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Google Maps URL</label>
            <input
              type="url"
              value={data.mapsUrl}
              onChange={(e) => update('mapsUrl', e.target.value)}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </section>

        {/* Page Images */}
        <section className="space-y-5">
          <h2 className="text-[17px] font-bold text-dark">Page Images</h2>
          <ImageUploader
            context="services"
            currentImage={data.servicesHeroImage || undefined}
            customFilename="services-hero.jpg"
            label="Services Page Hero Image"
            onUpload={(path) => update('servicesHeroImage', path)}
          />
        </section>

        {/* Opening Hours */}
        <section className="space-y-4">
          <h2 className="text-[17px] font-bold text-dark">Opening Hours</h2>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Mon – Fri</label>
            <input
              type="text"
              value={data.hoursMonFri}
              onChange={(e) => update('hoursMonFri', e.target.value)}
              placeholder="e.g. 9am – 6pm"
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Saturday</label>
            <input
              type="text"
              value={data.hoursSat}
              onChange={(e) => update('hoursSat', e.target.value)}
              placeholder="e.g. 9am – 3pm"
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Sunday</label>
            <input
              type="text"
              value={data.hoursSun}
              onChange={(e) => update('hoursSun', e.target.value)}
              placeholder="e.g. Closed"
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </section>

        {/* Brand Colours */}
        <section className="space-y-3">
          <div className="mb-1">
            <h2 className="text-[17px] font-bold text-dark">Brand Colours</h2>
            <p className="text-[13px] text-muted mt-1">
              Changes apply across the entire website. Click the swatch or type a hex code.
            </p>
          </div>
          {COLOUR_FIELDS.map(({ key, label, description }) => (
            <ColorField
              key={key}
              label={label}
              description={description}
              value={(data[key] as string) || '#000000'}
              onChange={(v) => update(key, v as Settings[typeof key])}
            />
          ))}
        </section>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-[14px] text-green-600 font-medium">Saved successfully!</span>}
          {error && <span className="text-[14px] text-red-500 font-medium">{error}</span>}
        </div>
      </form>

      {/* Security — separate form so it never triggers the main settings save */}
      <div className="mt-12 pt-10 border-t border-border max-w-2xl">
        <div className="mb-6">
          <h2 className="text-[17px] font-bold text-dark">Security</h2>
          <p className="text-[13px] text-muted mt-1">
            Changing your password will immediately log you out of all active sessions.
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
