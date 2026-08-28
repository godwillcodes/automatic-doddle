import Contact from '@/components/Contact'
import { Metadata } from 'next'

import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Godwill Barasa, software engineer in Nairobi and founder of Lock & Mercer. One address, and it reaches him rather than a studio inbox.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    url: absoluteUrl('/contact'),
    siteName: site.name,
    title: 'Contact | Godwill Barasa',
    description: 'One address, and it reaches him rather than a studio inbox.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | Godwill Barasa',
    description: 'One address, and it reaches him rather than a studio inbox.',
  },
}

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <Contact />
    </div>
  )
}
