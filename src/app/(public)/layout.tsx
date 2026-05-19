import { Header } from '@/components/features/Header'
import { Footer } from '@/components/features/Footer'
import { fetchSettings } from '@/services/content.service'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = fetchSettings()
  const hours = {
    monFri: settings.hoursMonFri,
    sat: settings.hoursSat,
    sun: settings.hoursSun,
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer hours={hours} />
    </>
  )
}
