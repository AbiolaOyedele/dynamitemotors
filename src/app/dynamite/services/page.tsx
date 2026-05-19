'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { ImageUploader } from '@/components/admin/ImageUploader'

type ServiceItem = {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  image: string
}

const EMPTY_SERVICE: ServiceItem = {
  id: '',
  title: '',
  description: '',
  icon: '',
  features: [''],
  image: '',
}

const ICON_OPTIONS = ['mot', 'service', 'brake', 'tyre', 'exhaust', 'wrench']

export default function ServicesAdmin() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content?section=services')
      .then((r) => r.json())
      .then((r: { data: ServiceItem[] }) => setServices(r.data))
      .catch(() => {})
  }, [])

  async function saveAll(updated: ServiceItem[]) {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/content?section=services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      setServices(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(svc: ServiceItem) {
    setEditing({ ...svc, features: [...svc.features] })
    setIsNew(false)
  }

  function handleNew() {
    setEditing({ ...EMPTY_SERVICE, features: [''] })
    setIsNew(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return
    const updated = services.filter((s) => s.id !== id)
    saveAll(updated)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editing) return

    // Auto-generate ID from title if new
    const item = { ...editing }
    if (isNew && !item.id) {
      item.id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    // Filter empty features
    item.features = item.features.filter((f) => f.trim() !== '')

    let updated: ServiceItem[]
    if (isNew) {
      updated = [...services, item]
    } else {
      updated = services.map((s) => (s.id === item.id ? item : s))
    }

    await saveAll(updated)
    setEditing(null)
  }

  function updateFeature(index: number, value: string) {
    if (!editing) return
    const features = [...editing.features]
    features[index] = value
    setEditing({ ...editing, features })
  }

  function addFeature() {
    if (!editing) return
    setEditing({ ...editing, features: [...editing.features, ''] })
  }

  function removeFeature(index: number) {
    if (!editing) return
    const features = editing.features.filter((_, i) => i !== index)
    setEditing({ ...editing, features })
  }

  // Editor view
  if (editing) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="text-[14px] text-muted hover:text-dark mb-6 flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Services
        </button>

        <h1 className="text-[28px] font-bold text-dark mb-6">
          {isNew ? 'Add Service' : `Edit: ${editing.title}`}
        </h1>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {/* Image */}
          <ImageUploader
            context="services"
            currentImage={editing.image || undefined}
            customFilename={editing.id || undefined}
            label="Service Image"
            onUpload={(path) => setEditing({ ...editing, image: path })}
          />

          {/* Title */}
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Title</label>
            <input
              type="text"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              required
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Description</label>
            <textarea
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Icon</label>
            <select
              value={editing.icon}
              onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Select icon...</option>
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          {/* Features */}
          <div>
            <label className="block text-[13px] font-semibold text-body mb-2">Features</label>
            <div className="space-y-2">
              {editing.features.map((feat, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`}
                    className="flex-1 h-[40px] rounded-lg border border-border px-3 text-[14px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="w-[40px] h-[40px] rounded-lg border border-border text-muted/70 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-[13px] text-muted hover:text-dark font-medium"
              >
                + Add feature
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="h-[44px] px-6 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isNew ? 'Add Service' : 'Save Changes'}
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
          <h1 className="text-[28px] font-bold text-dark mb-2">Services</h1>
          <p className="text-[16px] text-muted">
            Manage the services displayed on your website.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="h-[40px] px-5 rounded-lg bg-dark text-white text-[14px] font-semibold hover:bg-body transition-colors"
        >
          + Add Service
        </button>
      </div>

      <div className="space-y-3">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-xl border border-border p-5 flex items-center gap-4 hover:border-primary/45 transition-colors"
          >
            {/* Image thumbnail */}
            {svc.image ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-light-bg shrink-0">
                <img src={svc.image} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-light-bg shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-muted/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-bold text-dark">{svc.title}</h3>
              <p className="text-[14px] text-muted truncate">{svc.description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(svc)}
                className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-body hover:bg-light-bg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(svc.id)}
                className="h-[36px] px-4 rounded-lg border border-border text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <p className="text-muted/70 text-[14px] text-center py-10">
            No services yet. Click "Add Service" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
