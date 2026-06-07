'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

type ProcessStep = {
  number: string
  title: string
  description: string
}

function emptyStep(index: number): ProcessStep {
  return {
    number: String(index + 1).padStart(2, '0'),
    title: '',
    description: '',
  }
}

/** Recalculate step numbers after any add/remove so they stay sequential. */
function renumber(steps: ProcessStep[]): ProcessStep[] {
  return steps.map((step, i) => ({
    ...step,
    number: String(i + 1).padStart(2, '0'),
  }))
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
      .then((r: { data: ProcessStep[] }) => setData(r.data ?? []))
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

  function addStep() {
    if (!data) return
    setData(renumber([...data, emptyStep(data.length)]))
    setDirty(true)
  }

  function removeStep(index: number) {
    if (!data || data.length <= 1) return
    setData(renumber(data.filter((_, i) => i !== index)))
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
        body: JSON.stringify(renumber(data)),
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-dark mb-2">Process Steps</h1>
          <p className="text-[16px] text-muted">
            Edit the steps shown in the &ldquo;How It Works&rdquo; section. Add or remove steps as needed.
          </p>
        </div>
        <button
          type="button"
          onClick={addStep}
          className="shrink-0 h-[40px] px-5 rounded-lg border border-border text-[14px] font-semibold text-body hover:bg-light-bg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Step
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {data.map((step, index) => (
          <div key={index} className="bg-white rounded-xl border border-border p-5 space-y-4">
            {/* Step header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold tracking-widest text-primary">
                  {step.number}
                </span>
                <p className="text-[13px] font-semibold text-muted">Step {index + 1}</p>
              </div>
              <button
                type="button"
                onClick={() => removeStep(index)}
                disabled={data.length <= 1}
                title={data.length <= 1 ? 'Must have at least one step' : 'Remove this step'}
                className="flex items-center gap-1.5 text-[13px] text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                Remove
              </button>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Title</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStep(index, 'title', e.target.value)}
                placeholder="e.g. Book Online or Call"
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Description</label>
              <textarea
                value={step.description}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
                rows={3}
                placeholder="Describe what happens at this step..."
                className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        ))}

        {/* Add step inline shortcut */}
        <button
          type="button"
          onClick={addStep}
          className="w-full flex items-center justify-center gap-2 h-[48px] rounded-xl border-2 border-dashed border-border text-[14px] font-medium text-muted hover:border-primary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add another step
        </button>

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
