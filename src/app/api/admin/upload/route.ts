import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { isAuthenticated } from '@/lib/admin-auth'
import { getUploadDir, getPublicPath } from '@/lib/content'

/** POST /api/admin/upload — Upload an image */
export async function POST(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const context = (formData.get('context') as string) ?? 'general'
    const customName = formData.get('filename') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF' },
        { status: 400 },
      )
    }

    // Max 10MB
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    // Determine filename
    const ext = file.name.split('.').pop() ?? 'jpg'
    const baseName = customName
      ? customName.replace(/\.[^.]+$/, '')
      : file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-')
    const filename = `${baseName}.${ext}`

    // Ensure directory exists
    const uploadDir = getUploadDir(context)
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, filename)
    writeFileSync(filePath, buffer)

    // Return the public URL path
    const publicPath = getPublicPath(context, filename)

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
      size: file.size,
    })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
