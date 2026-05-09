import { HeroSection } from '@/components/features/HeroSection'
import { StatsBar } from '@/components/features/StatsBar'
import { ServicesGrid } from '@/components/features/ServicesGrid'
import { ProcessSteps } from '@/components/features/ProcessSteps'
import { TestimonialsSection } from '@/components/features/TestimonialsSection'
import { getServicesPreview, getTestimonials } from '@/repositories/sanity.repository'

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([
    getServicesPreview(),
    getTestimonials(),
  ])

  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid services={services} showViewAll limit={2} />
      <ProcessSteps />
      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
