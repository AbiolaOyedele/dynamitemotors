import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.dynamitemotors.com'
  return [
    { url: base,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/services`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/offers`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/contact`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
