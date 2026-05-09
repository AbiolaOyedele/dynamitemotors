import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

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
export const IMAGE_DESTINATIONS: Record<string, string> = {
  hero: 'public',
  services: 'public/images/services',
  facilities: 'public/images/facilities',
  offers: 'public/images/offers',
  general: 'public/images',
}

/** Get the absolute path for an image upload destination */
export function getUploadDir(context: string): string {
  const relative = IMAGE_DESTINATIONS[context] ?? IMAGE_DESTINATIONS['general']
  return path.join(process.cwd(), relative)
}

/** Get the public URL path for an uploaded image */
export function getPublicPath(context: string, filename: string): string {
  if (context === 'hero') return `/${filename}`
  const relative = IMAGE_DESTINATIONS[context] ?? IMAGE_DESTINATIONS['general']
  const publicPrefix = relative.replace('public', '')
  return `${publicPrefix}/${filename}`
}
