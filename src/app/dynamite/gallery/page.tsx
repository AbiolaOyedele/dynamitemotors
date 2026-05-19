'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Trash2 } from 'lucide-react'

type GalleryImage = {
  src: string
  alt: string
}

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content?section=gallery')
      .then((r) => r.json())
      .then((r: { data: GalleryImage[] }) => setImages(r.data))
      .catch(() => {})
  }, [])

  function updateAlt(index: number, alt: string) {
    if (!images) return
    setImages(images.map((img, i) => (i === index ? { ...img, alt } : img)))
  }

  function removeImage(index: number) {
    if (!images) return
    setImages(images.filter((_, i) => i !== index))
  }

  function handleUpload(path: string) {
    setUploadedPath(path)
  }

  function addImage() {
    if (!images || !uploadedPath) return
    setImages([...images, { src: uploadedPath, alt: '' }])
    setUploadedPath(null)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!images) return
    setSaving(true)
    setSaved(false)

    try {
      await fetch('/api/admin/content?section=gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(images),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!images) {
    return <div className="text-muted">Loading...</div>
  }

  const newFilename = `gallery-${Date.now()}.jpg`

  return (
    <div>
      <h1 className="text-[28px] font-bold text-dark mb-2">Gallery</h1>
      <p className="text-[16px] text-muted mb-8">
        Manage the photos shown in the garage gallery section.
      </p>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* Current images */}
        <div className="space-y-4">
          <h2 className="text-[16px] font-semibold text-dark">Current Photos</h2>

          {images.length === 0 && (
            <p className="text-[14px] text-muted">No photos yet. Add one below.</p>
          )}

          {images.map((image, index) => (
            <div key={image.src + index} className="bg-white rounded-xl border border-border p-4 flex gap-4 items-start">
              <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-light-bg">
                <Image
                  src={image.src}
                  alt={image.alt || 'Gallery image'}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-[13px] font-semibold text-body mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Describe the image for accessibility"
                  className="w-full h-[44px] rounded-lg border border-border px-3 text-[15px] text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-[12px] text-muted mt-1.5 truncate">{image.src}</p>
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                aria-label="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new photo */}
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <h2 className="text-[16px] font-semibold text-dark">Add a Photo</h2>

          <ImageUploader
            context="gallery"
            customFilename={newFilename}
            label="Upload Photo"
            onUpload={handleUpload}
          />

          {uploadedPath && (
            <div className="flex items-center gap-3">
              <p className="text-[13px] text-muted flex-1 truncate">
                Ready to add: <span className="font-medium text-body">{uploadedPath}</span>
              </p>
              <button
                type="button"
                onClick={addImage}
                className="h-[44px] px-5 rounded-lg bg-primary text-dark text-[14px] font-semibold hover:bg-primary/90 transition-colors shrink-0"
              >
                Add to Gallery
              </button>
            </div>
          )}
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
