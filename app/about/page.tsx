import type { Metadata } from 'next'
import Link from 'next/link'

import AboutSection from '@/components/home/AboutSection'
import { absoluteUrl, site } from '@/lib/site'

const title = 'About'
const description =
  'Senior Web Engineer in Nairobi. Eight years building and scaling high-traffic web applications in React, Next.js, TypeScript, Laravel and WordPress, for agencies and in-house teams.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    type: 'profile',
    url: absoluteUrl('/about'),
    title,
    description,
    siteName: site.name,
  },
  twitter: { card: 'summary_large_image', title, description },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: site.author.name,
      jobTitle: site.author.jobTitle,
      url: site.url,
      description,
      sameAs: site.author.sameAs,
      worksFor: {
        '@type': 'Organization',
        name: 'Piedmont Global',
        url: 'https://piedmontglobal.com/',
      },
      homeLocation: { '@type': 'Place', name: 'Nairobi, Kenya' },
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'Laravel',
        'WordPress',
        'Core Web Vitals',
        'M-Pesa Daraja API',
        'CI/CD',
        'A/B testing',
      ],
    },
  }

  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutSection />
      <div className="mx-auto max-w-7xl px-6 pb-14 sm:px-8">
        <div className="flex flex-wrap gap-8">
          <Link href="/#work" className="meta meta-ink">
            Selected work →
          </Link>
          <Link href="/blog" className="meta meta-ink">
            Writing →
          </Link>
          <Link href="/contact" className="meta meta-ink">
            Contact →
          </Link>
        </div>
      </div>
    </div>
  )
}
