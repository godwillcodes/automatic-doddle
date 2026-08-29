import Contact from '@/components/Contact'
import StructuredData from '@/components/StructuredData'
import { contactGraph } from '@/lib/seo/graph'
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
    // Explicit: a page-level `openGraph` replaces the parent object rather
    // than merging, so omitting images drops the layout's og:image entirely.
    images: [
      { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: 'Godwill Barasa' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteUrl('/opengraph-image')],
    title: 'Contact | Godwill Barasa',
    description: 'One address, and it reaches him rather than a studio inbox.',
  },
}

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <StructuredData
        graph={contactGraph(metadata.title as string, metadata.description as string)}
      />
      <Contact />
    </div>
  )
}
