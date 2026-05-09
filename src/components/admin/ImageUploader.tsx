'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

type Props = {
  context: string
  currentImage?: string
  customFilename?: string
  onUpload: (path: string) => void
  label?: string
  className?: string
}

export function ImageUploader({
  context,
  currentImage,
  customFilename,
  onUpload,
  label = 'Upload Image',
  className = '',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError('')
    setUploading(true)

    // Local preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('context', context)
      if (customFilename) formData.append('filename', customFilename)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json() as { success?: boolean; path?: string; error?: string }

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Upload failed')
        setPreview(null)
        return
      }

      onUpload(data.path ?? '')
    } catch {
      setError('Upload failed. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const displayImage = preview ?? currentImage

  return (
    <div className={className}>
      <label className="block text-[13px] font-semibold text-[#333333] mb-2">
        {label}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
          uploading
            ? 'border-[#D5FFD5] bg-[#f0fff0]'
            : 'border-[#E8E8E8] hover:border-[#D5FFD5] hover:bg-[#fafafa]'
        }`}
      >
        {displayImage ? (
          <div className="relative aspect-video">
            <Image
              src={displayImage}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={preview !== null}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[14px] font-semibold">
                Click to replace
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <svg
              className="w-10 h-10 text-[#cccccc] mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[14px] text-[#666666] font-medium">
              Drop an image here or click to browse
            </p>
            <p className="text-[12px] text-[#999999] mt-1">
              JPEG, PNG, WebP — max 10MB
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#D5FFD5] border-t-transparent rounded-full animate-spin" />
              <span className="text-[14px] font-medium text-[#333333]">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-[13px] text-red-500">{error}</p>
      )}
    </div>
  )
}
