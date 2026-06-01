import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { env } from '@/config/env'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

/** POST /api/admin/upload — Upload an image to Cloudinary */
export async function POST(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF' },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    // Upload to Cloudinary via unsigned preset
    const cloudinaryForm = new FormData()
    cloudinaryForm.append('file', file)
    cloudinaryForm.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET)
    cloudinaryForm.append('folder', 'dynamite-motors')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudinaryForm },
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Cloudinary upload error:', err)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const data = (await res.json()) as { secure_url: string; public_id: string }

    return NextResponse.json({
      success: true,
      path: data.secure_url,
      filename: data.public_id,
      size: file.size,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
