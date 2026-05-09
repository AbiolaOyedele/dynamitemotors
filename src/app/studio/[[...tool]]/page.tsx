import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import config from '../../../../sanity.config'

export const dynamic_ = 'force-dynamic'

const NextStudio = dynamic(() => import('next-sanity/studio').then((m) => m.NextStudio), {
  ssr: false,
})

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  if (process.env.NODE_ENV === 'production') return notFound()
  return <NextStudio config={config} />
}
