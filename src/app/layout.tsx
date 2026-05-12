import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const BASE_URL = 'https://www.dynamitemotors.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Dynamite Motors — Auto Repair Gravesend',
    template: '%s — Dynamite Motors',
  },
  description:
    'Professional auto repair and servicing in Gravesend, Kent. 30+ years experience. MOT, full service, tyres, brakes & more. Get a free quote today.',
  openGraph: {
    type: 'website',
    siteName: 'Dynamite Motors',
    locale: 'en_GB',
    url: BASE_URL,
    title: 'Dynamite Motors — Auto Repair Gravesend',
    description:
      'Professional auto repair and servicing in Gravesend, Kent. 30+ years experience. MOT, full service, tyres, brakes & more. Get a free quote today.',
    images: [{ url: '/hero.jpg', width: 1200, height: 630, alt: 'Dynamite Motors — Gravesend' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dynamite Motors — Auto Repair Gravesend',
    description:
      'Professional auto repair and servicing in Gravesend, Kent. 30+ years experience. MOT, full service, tyres, brakes & more.',
    images: ['/hero.jpg'],
  },
  alternates: { canonical: BASE_URL },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Dynamite Motors',
  image: `${BASE_URL}/hero.jpg`,
  url: BASE_URL,
  telephone: '+441474643488',
  email: 'dynamitemotor@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2 Vale Rd, Northfleet',
    addressLocality: 'Gravesend',
    addressRegion: 'Kent',
    postalCode: 'DA11 9RE',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.4321,
    longitude: 0.3269,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '15:00',
    },
  ],
  areaServed: { '@type': 'City', name: 'Gravesend' },
  priceRange: '££',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
