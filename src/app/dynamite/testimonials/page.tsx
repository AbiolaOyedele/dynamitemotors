'use client'

import { useState, useEffect, type FormEvent } from 'react'

type TestimonialItem = {
  id: string
  customerName: string
  review: string
  rating: number
  vehicleType: string
}

const EMPTY_TESTIMONIAL: TestimonialItem = {
  id: '',
  customerName: '',
  review: '',
  rating: 5,
  vehicleType: '',
}

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<TestimonialItem[]>([])
  const [editing, setEditing] = useState<TestimonialItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content?section=testimonials')
      .then((r) => r.json())
      .then((r: { data: TestimonialItem[] }) => setItems(r.data))
      .catch(() => {})
  }, [])

  async function saveAll(updated: TestimonialItem[]) {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/content?section=testimonials', {
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

  function handleEdit(item: TestimonialItem) {
    setEditing({ ...item })
    setIsNew(false)
  }

  function handleNew() {
    setEditing({ ...EMPTY_TESTIMONIAL })
    setIsNew(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const updated = items.filter((t) => t.id !== id)
    saveAll(updated)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editing) return

    const item = { ...editing }
    if (isNew && !item.id) {
      item.id = `t${Date.now()}`
    }

    let updated: TestimonialItem[]
    if (isNew) {
      updated = [...items, item]
    } else {
      updated = items.map((t) => (t.id === item.id ? item : t))
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
          className="text-[14px] text-muted hover:text-dark mb-6 flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Testimonials
        </button>

        <h1 className="text-[28px] font-bold text-dark mb-6">
          {isNew ? 'Add Testimonial' : `Edit: ${editing.customerName}`}
        </h1>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Customer Name</label>
            <input
              type="text"
              value={editing.customerName}
              onChange={(e) => setEditing({ ...editing, customerName: e.target.value })}
              required
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Review</label>
            <textarea
              value={editing.review}
              onChange={(e) => setEditing({ ...editing, review: e.target.value })}
              required
              rows={4}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Rating</label>
              <select
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-body mb-2">Vehicle Type (optional)</label>
              <input
                type="text"
                value={editing.vehicleType}
                onChange={(e) => setEditing({ ...editing, vehicleType: e.target.value })}
                placeholder="e.g. Ford Focus"
                className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isNew ? 'Add Testimonial' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="h-[44px] px-6 rounded-lg border border-border text-muted text-[14px] font-semibold hover:bg-light-bg transition-colors"
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
          <h1 className="text-[28px] font-bold text-dark mb-2">Testimonials</h1>
          <p className="text-[16px] text-muted">
            Manage customer reviews shown on the homepage.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="h-[40px] px-5 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors"
        >
          + Add Review
        </button>
      </div>

      <div className="space-y-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-border p-5 hover:border-primary/45 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-bold text-dark">{t.customerName}</h3>
                  <span className="text-[13px] text-[#f59e0b]">{'★'.repeat(t.rating)}</span>
                </div>
                <p className="text-[14px] text-muted line-clamp-2">{t.review}</p>
                {t.vehicleType && (
                  <p className="text-[12px] text-muted/70 mt-1">{t.vehicleType}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(t)}
                  className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-body hover:bg-light-bg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-muted/70 text-[14px] text-center py-10">
            No testimonials yet. Click "Add Review" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
