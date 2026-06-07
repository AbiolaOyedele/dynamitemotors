'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

type ProcessStep = {
  number: string
  title: string
  description: string
}

export default function ProcessAdmin() {
  const [data, setData] = useState<ProcessStep[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDirty } = useUnsavedChanges()

  useEffect(() => {
    fetch('/api/admin/content?section=process')
      .then((r) => r.json())
      .then((r: { data: ProcessStep[] }) => setData(r.data))
      .catch(() => setError('Failed to load content'))
  }, [])

  function updateStep(index: number, field: keyof ProcessStep, value: string) {
    if (!data) return
    const updated = data.map((step, i) =>
      i === index ? { ...step, [field]: value } : step,
    )
    setData(updated)
    setDirty(true)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      const res = await fetch('/api/admin/content?section=process', {
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
      <h1 className="text-[28px] font-bold text-dark mb-2">Process Steps</h1>
      <p className="text-[16px] text-muted mb-8">
        Edit the four steps shown in the &ldquo;How It Works&rdquo; section.
      </p>

      <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
        {data.map((step, index) => (
          <div key={index} className="bg-white rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold tracking-widest text-primary">{step.number}</span>
              <p className="text-[13px] font-semibold text-muted">Step {index + 1}</p>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Title</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStep(index, 'title', e.target.value)}
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Description</label>
              <textarea
                value={step.description}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        ))}

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
