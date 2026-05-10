'use client'

import { useState, useEffect, type FormEvent } from 'react'

type Settings = {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  mapsUrl: string
}

export default function SettingsAdmin() {
  const [data, setData] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content?section=settings')
      .then((r) => r.json())
      .then((r: { data: Settings }) => setData(r.data))
      .catch(() => {})
  }, [])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setSaved(false)

    try {
      await fetch('/api/admin/content?section=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!data) {
    return <div className="text-muted">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-[28px] font-bold text-dark mb-2">Settings</h1>
      <p className="text-[16px] text-muted mb-8">
        Business information displayed across the website.
      </p>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Business Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Tagline</label>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Address</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Phone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Google Maps URL</label>
          <input
            type="url"
            value={data.mapsUrl}
            onChange={(e) => setData({ ...data, mapsUrl: e.target.value })}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="text-[14px] text-green-600 font-medium">Saved!</span>
          )}
        </div>
      </form>
    </div>
  )
}
