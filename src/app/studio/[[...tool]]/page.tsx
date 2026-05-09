'use client'

import { useEffect, useState } from 'react'
import config from '../../../../sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  const [Studio, setStudio] = useState<React.ComponentType<{ config: typeof config }> | null>(null)

  useEffect(() => {
    import('next-sanity/studio').then((m) => setStudio(() => m.NextStudio))
  }, [])

  if (!Studio) return null
  return <Studio config={config} />
}
