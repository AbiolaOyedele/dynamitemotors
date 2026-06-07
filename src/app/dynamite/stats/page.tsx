'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

type StatItem = {
  value: number
  suffix: string
  label: string
}

export default function StatsAdmin() {
  const [data, setData] = useState<StatItem[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDirty } = useUnsavedChanges()

  useEffect(() => {
    fetch('/api/admin/content?section=stats')
      .then((r) => r.json())
      .then((r: { data: StatItem[] }) => setData(r.data))
      .catch(() => setError('Failed to load content'))
  }, [])

  function updateStat(index: number, field: keyof StatItem, value: string | number) {
    if (!data) return
    const updated = data.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat,
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
      const res = await fetch('/api/admin/content?section=stats', {
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
      <h1 className="text-[28px] font-bold text-dark mb-2">Stats Bar</h1>
      <p className="text-[16px] text-muted mb-8">
        Edit the three headline stats shown below the hero section.
      </p>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {data.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-border p-5">
            <p className="text-[13px] font-semibold text-muted mb-4">Stat {index + 1}</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Value</label>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', parseInt(e.target.value, 10) || 0)}
                  className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Suffix</label>
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                  placeholder="e.g. + or ★"
                  className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-body mb-2">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  placeholder="e.g. Years Experience"
                  className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
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
