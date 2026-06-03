import type { Metadata } from 'next'
import { HeroSection } from '@/components/features/HeroSection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Dynamite Motors | Auto Repair Gravesend',
  description:
    'Professional auto repair and servicing in Gravesend, Kent. 30+ years experience. MOT, full service, tyres, brakes & more. Get a free quote today.',
  alternates: { canonical: 'https://www.dynamitemotors.com' },
  openGraph: {
    url: 'https://www.dynamitemotors.com',
    title: 'Dynamite Motors | Auto Repair Gravesend',
    description:
      'Professional auto repair and servicing in Gravesend, Kent. 30+ years experience. MOT, full service, tyres, brakes & more. Get a free quote today.',
  },
}
import { StatsBar } from '@/components/features/StatsBar'
import { ServicesGrid } from '@/components/features/ServicesGrid'
import { ProcessSteps } from '@/components/features/ProcessSteps'
import { GarageGallery } from '@/components/features/GarageGallery'
import { TestimonialsSection } from '@/components/features/TestimonialsSection'
import {
  fetchServicesPreview,
  fetchTestimonials,
  fetchStats,
  fetchProcess,
  fetchGallery,
  fetchHero,
} from '@/services/content.service'

export default async function HomePage() {
  const [services, testimonials, heroData, stats, steps, images] = await Promise.all([
    fetchServicesPreview(),
    fetchTestimonials(),
    fetchHero(),
    fetchStats(),
    fetchProcess(),
    fetchGallery(),
  ])

  return (
    <>
      <HeroSection heroData={heroData} />
      <StatsBar stats={stats} />
      <ServicesGrid services={services} showViewAll limit={2} />
      <ProcessSteps steps={steps} />
      <GarageGallery images={images} />
      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
