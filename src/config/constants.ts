export const BUSINESS = {
  name: 'Dynamite Motors',
  tagline: 'Your trusted local garage in Gravesend',
  address: '2 Vale Rd, Northfleet, Gravesend DA11 9RE',
  phone: '01474 643488',
  phoneTel: 'tel:+441474643488',
  email: 'dynamitemotor@gmail.com',
  emailHref: 'mailto:dynamitemotor@gmail.com',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=2+Vale+Rd+Northfleet+Gravesend+DA11+9RE',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2490.7!2d0.3269!3d51.4321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8b10ef60e3b89%3A0x1!2s2+Vale+Rd%2C+Northfleet%2C+Gravesend+DA11+9RE!5e0!3m2!1sen!2suk!4v1',
} as const

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/offers', label: 'Offers' },
  { href: '/contact', label: 'Contact' },
] as const
