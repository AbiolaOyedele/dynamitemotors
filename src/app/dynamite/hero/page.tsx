'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

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
  const [error, setError] = useState<string | null>(null)
  const { setDirty } = useUnsavedChanges()

  useEffect(() => {
    fetch('/api/admin/content?section=hero')
      .then((r) => r.json())
      .then((r: { data: HeroContent }) => setData(r.data))
      .catch(() => setError('Failed to load content'))
  }, [])

  function update<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
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
      const res = await fetch('/api/admin/content?section=hero', {
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
      <h1 className="text-[28px] font-bold text-dark mb-2">Hero Section</h1>
      <p className="text-[16px] text-muted mb-8">
        Edit the main banner text and background image.
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        <ImageUploader
          context="hero"
          currentImage={data.image}
          customFilename="hero.jpg"
          label="Background Image"
          onUpload={(path) => update('image', path)}
        />

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Badge Text</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => update('badge', e.target.value)}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">
            Heading (use \n for line breaks)
          </label>
          <textarea
            value={data.heading}
            onChange={(e) => update('heading', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Accent Line (green text)</label>
          <input
            type="text"
            value={data.accentLine}
            onChange={(e) => update('accentLine', e.target.value)}
            className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-body mb-2">Subheading</label>
          <textarea
            value={data.subheading}
            onChange={(e) => update('subheading', e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
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
          {saved && <span className="text-[14px] text-green-600 font-medium">Saved successfully!</span>}
          {error && <span className="text-[14px] text-red-500 font-medium">{error}</span>}
        </div>
      </form>
    </div>
  )
}
