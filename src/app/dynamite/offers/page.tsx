'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useUnsavedChanges } from '@/components/admin/UnsavedChanges'

type OfferItem = {
  id: string
  title: string
  description: string
  badge: string
  expiresAt: string
  active: boolean
}

const EMPTY_OFFER: OfferItem = {
  id: '',
  title: '',
  description: '',
  badge: '',
  expiresAt: '',
  active: true,
}

export default function OffersAdmin() {
  const [items, setItems] = useState<OfferItem[]>([])
  const [editing, setEditing] = useState<OfferItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDirty } = useUnsavedChanges()

  useEffect(() => {
    fetch('/api/admin/content?section=offers')
      .then((r) => r.json())
      .then((r: { data: OfferItem[] }) => setItems(r.data ?? []))
      .catch(() => setError('Failed to load offers'))
  }, [])

  async function saveAll(updated: OfferItem[]) {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/content?section=offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error('Save failed')
      setItems(updated)
      setDirty(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(item: OfferItem) {
    setEditing({ ...item })
    setIsNew(false)
  }

  function handleNew() {
    setEditing({ ...EMPTY_OFFER })
    setIsNew(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this offer? This will save immediately.')) return
    void saveAll(items.filter((o) => o.id !== id))
  }

  function toggleActive(item: OfferItem) {
    const updated = items.map((o) =>
      o.id === item.id ? { ...o, active: !o.active } : o,
    )
    void saveAll(updated)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editing) return

    const item = { ...editing }
    if (isNew && !item.id) item.id = `o${Date.now()}`

    const updated = isNew
      ? [...items, item]
      : items.map((o) => (o.id === item.id ? item : o))

    await saveAll(updated)
    setEditing(null)
  }

  function updateEditing<K extends keyof OfferItem>(key: K, value: OfferItem[K]) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev))
    setDirty(true)
  }

  // ── Editor ─────────────────────────────────────────────────────────────────

  if (editing) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="text-[14px] text-muted hover:text-dark mb-6 flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Offers
        </button>

        <h1 className="text-[28px] font-bold text-dark mb-6">
          {isNew ? 'Add Offer' : `Edit: ${editing.title}`}
        </h1>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Title</label>
            <input
              type="text"
              value={editing.title}
              onChange={(e) => updateEditing('title', e.target.value)}
              required
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Description</label>
            <textarea
              value={editing.description}
              onChange={(e) => updateEditing('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Badge</label>
              <input
                type="text"
                value={editing.badge}
                onChange={(e) => updateEditing('badge', e.target.value)}
                placeholder="e.g. Limited Time"
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Expires At</label>
              <input
                type="date"
                value={editing.expiresAt ? editing.expiresAt.split('T')[0] : ''}
                onChange={(e) =>
                  updateEditing('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : '')
                }
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={editing.active}
              onChange={(e) => updateEditing('active', e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <label htmlFor="active" className="text-[14px] text-body font-medium">
              Active (visible on website)
            </label>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isNew ? 'Add Offer' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(null); setDirty(false) }}
              className="h-[44px] px-6 rounded-lg border border-border text-muted text-[14px] font-semibold hover:bg-light-bg transition-colors"
            >
              Cancel
            </button>
            {saved && <span className="text-[14px] text-green-600 font-medium">Saved!</span>}
            {error && <span className="text-[14px] text-red-500 font-medium">{error}</span>}
          </div>
        </form>
      </div>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-dark mb-2">Offers</h1>
          <p className="text-[16px] text-muted">Create and manage promotional offers.</p>
        </div>
        <button
          onClick={handleNew}
          className="h-[40px] px-5 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors"
        >
          + Add Offer
        </button>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 text-[14px] text-green-700 font-medium bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          Changes saved successfully.
        </div>
      )}
      {error && (
        <div className="mb-4 text-[14px] text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {items.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl border border-border p-5 hover:border-primary/45 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-bold text-dark">{offer.title}</h3>
                  {offer.badge && (
                    <span className="text-[11px] font-bold uppercase bg-primary text-dark px-2 py-0.5 rounded-full">
                      {offer.badge}
                    </span>
                  )}
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    offer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {offer.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[14px] text-muted line-clamp-1">{offer.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(offer)}
                  disabled={saving}
                  className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-body hover:bg-light-bg transition-colors disabled:opacity-50"
                >
                  {offer.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(offer)}
                  className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-body hover:bg-light-bg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  disabled={saving}
                  className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                >
                  {saving ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-muted/70 text-[14px] text-center py-10">
            No offers yet. Click &ldquo;Add Offer&rdquo; to create your first promotion.
          </p>
        )}
      </div>
    </div>
  )
}
