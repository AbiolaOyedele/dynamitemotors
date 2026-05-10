import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

type ContentSection =
  | 'hero'
  | 'services'
  | 'testimonials'
  | 'offers'
  | 'stats'
  | 'settings'

/** Read a content JSON file from the /content directory */
export function readContent<T>(section: ContentSection): T {
  const filePath = path.join(CONTENT_DIR, `${section}.json`)
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

/** Write data to a content JSON file in the /content directory */
export function writeContent<T>(section: ContentSection, data: T): void {
  const filePath = path.join(CONTENT_DIR, `${section}.json`)
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

/** Image upload destinations by context */
export const IMAGE_DESTINATIONS = {
  hero: {
    uploadDir: PUBLIC_DIR,
    publicPrefix: '',
  },
  services: {
    uploadDir: path.join(PUBLIC_DIR, 'images', 'services'),
    publicPrefix: '/images/services',
  },
  facilities: {
    uploadDir: path.join(PUBLIC_DIR, 'images', 'facilities'),
    publicPrefix: '/images/facilities',
  },
  offers: {
    uploadDir: path.join(PUBLIC_DIR, 'images', 'offers'),
    publicPrefix: '/images/offers',
  },
  general: {
    uploadDir: path.join(PUBLIC_DIR, 'images'),
    publicPrefix: '/images',
  },
}

/** Get the absolute path for an image upload destination */
export function getUploadDir(context: string): string {
  const destination =
    IMAGE_DESTINATIONS[context as keyof typeof IMAGE_DESTINATIONS] ??
    IMAGE_DESTINATIONS['general']

  return destination.uploadDir
}

/** Get the public URL path for an uploaded image */
export function getPublicPath(context: string, filename: string): string {
  const destination =
    IMAGE_DESTINATIONS[context as keyof typeof IMAGE_DESTINATIONS] ??
    IMAGE_DESTINATIONS['general']

  return `${destination.publicPrefix}/${filename}`
}
