'use client'

import { useState, useEffect, type FormEvent } from 'react'

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

  useEffect(() => {
    fetch('/api/admin/content?section=offers')
      .then((r) => r.json())
      .then((r: { data: OfferItem[] }) => setItems(r.data))
      .catch(() => {})
  }, [])

  async function saveAll(updated: OfferItem[]) {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/content?section=offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      setItems(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save')
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
    if (!confirm('Delete this offer?')) return
    saveAll(items.filter((o) => o.id !== id))
  }

  function toggleActive(item: OfferItem) {
    const updated = items.map((o) =>
      o.id === item.id ? { ...o, active: !o.active } : o,
    )
    saveAll(updated)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editing) return

    const item = { ...editing }
    if (isNew && !item.id) {
      item.id = `o${Date.now()}`
    }

    let updated: OfferItem[]
    if (isNew) {
      updated = [...items, item]
    } else {
      updated = items.map((o) => (o.id === item.id ? item : o))
    }

    await saveAll(updated)
    setEditing(null)
  }

  // Editor
  if (editing) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="text-[14px] text-[#666666] hover:text-[#1a1a1a] mb-6 flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Offers
        </button>

        <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-6">
          {isNew ? 'Add Offer' : `Edit: ${editing.title}`}
        </h1>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-[13px] font-semibold text-[#333333] mb-2">Title</label>
            <input
              type="text"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              required
              className="w-full h-[44px] rounded-lg border border-[#E8E8E8] px-3 text-[15px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D5FFD5] focus:border-[#D5FFD5]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#333333] mb-2">Description</label>
            <textarea
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-[#E8E8E8] px-3 py-2.5 text-[15px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D5FFD5] focus:border-[#D5FFD5] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#333333] mb-2">Badge</label>
              <input
                type="text"
                value={editing.badge}
                onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                placeholder="e.g. Limited Time"
                className="w-full h-[44px] rounded-lg border border-[#E8E8E8] px-3 text-[15px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D5FFD5] focus:border-[#D5FFD5]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#333333] mb-2">Expires At</label>
              <input
                type="date"
                value={editing.expiresAt ? editing.expiresAt.split('T')[0] : ''}
                onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                className="w-full h-[44px] rounded-lg border border-[#E8E8E8] px-3 text-[15px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D5FFD5] focus:border-[#D5FFD5]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={editing.active}
              onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              className="w-4 h-4 rounded border-[#E8E8E8] accent-[#D5FFD5]"
            />
            <label htmlFor="active" className="text-[14px] text-[#333333] font-medium">Active (visible on website)</label>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="h-[44px] px-6 rounded-lg bg-[#1a1a1a] text-white text-[14px] font-semibold hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isNew ? 'Add Offer' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="h-[44px] px-6 rounded-lg border border-[#E8E8E8] text-[#666666] text-[14px] font-semibold hover:bg-[#f5f5f5] transition-colors"
            >
              Cancel
            </button>
            {saved && (
              <span className="text-[14px] text-green-600 font-medium">Saved!</span>
            )}
          </div>
        </form>
      </div>
    )
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">Offers</h1>
          <p className="text-[16px] text-[#666666]">
            Create and manage promotional offers.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="h-[40px] px-5 rounded-lg bg-[#1a1a1a] text-white text-[14px] font-semibold hover:bg-[#333333] transition-colors"
        >
          + Add Offer
        </button>
      </div>

      <div className="space-y-3">
        {items.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl border border-[#E8E8E8] p-5 hover:border-[#D5FFD5] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-bold text-[#1a1a1a]">{offer.title}</h3>
                  {offer.badge && (
                    <span className="text-[11px] font-bold uppercase bg-[#D5FFD5] text-[#1a1a1a] px-2 py-0.5 rounded-full">
                      {offer.badge}
                    </span>
                  )}
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    offer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {offer.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[14px] text-[#666666] line-clamp-1">{offer.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(offer)}
                  className="h-[36px] px-4 rounded-lg border border-[#E8E8E8] text-[13px] font-semibold text-[#333333] hover:bg-[#f5f5f5] transition-colors"
                >
                  {offer.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(offer)}
                  className="h-[36px] px-4 rounded-lg border border-[#E8E8E8] text-[13px] font-semibold text-[#333333] hover:bg-[#f5f5f5] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="h-[36px] px-4 rounded-lg border border-[#E8E8E8] text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-[#999999] text-[14px] text-center py-10">
            No offers yet. Click "Add Offer" to create your first promotion.
          </p>
        )}
      </div>
    </div>
  )
}
