'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type HeroContent = {
  badge: string
  heading: string
  accentLine: string
  subheading: string
  image: string
}

export default function HeroAdmin() {
  const [data, setData] = useState<HeroContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content?section=hero')
      .then((r) => r.json())
      .then((r: { data: HeroContent }) => setData(r.data))
      .catch(() => {})
  }, [])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setSaved(false)

    try {
      await fetch('/api/admin/content?section=hero', {
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
      <h1 className="text-[28px] font-bold text-dark mb-2">Hero Section</h1>
      <p className="text-[16px] text-muted mb-8">
        Edit the main banner text and background image.
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero image */}
        <ImageUploader
          context="hero"
          currentImage={data.image}
          customFilename="hero.jpg"
          label="Background Image"
          onUpload={(path) => setData({ ...data, image: path })}
        />

        {/* Badge text */}
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">
            Badge Text
          </label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Heading */}
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">
            Heading (use \n for line breaks)
          </label>
          <textarea
            value={data.heading}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        {/* Accent line */}
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">
            Accent Line (green text)
          </label>
          <input
            type="text"
            value={data.accentLine}
            onChange={(e) => setData({ ...data, accentLine: e.target.value })}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Subheading */}
        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">
            Subheading
          </label>
          <textarea
            value={data.subheading}
            onChange={(e) => setData({ ...data, subheading: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        {/* Save */}
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
