import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Godwill Barasa',
    default:
      'Godwill Barasa - Software Engineer, Founder at NestBella and Web Consultant based in Nairobi, Kenya',
  },
  description:
    'Godwill Barasa: Crafting Immersive Digital Experiences, One Line of Code at a Time! Technical Lead with 7+ years delivering scalable, user-centered products and leading cross-functional teams.',
  keywords: [
    'Godwill Barasa',
    'Software Engineer',
    'Technical Lead',
    'Product Engineering',
    'Nairobi Kenya',
    'Fintech',
    'M-Pesa',
    'React',
    'TypeScript',
    'Full Stack Developer',
    'Engineering Leadership',
    'Product Management',
    'NestBella',
    'Piedmont Global Language Solutions',
    'Ogilvy Africa',
    'Belva Digital'
  ],
  authors: [{ name: 'Godwill Barasa', url: 'https://godwillbarasa.com' }],
  creator: 'Godwill Barasa',
  publisher: 'Godwill Barasa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.com'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.com',
    siteName: 'Godwill Barasa',
    title: 'Godwill Barasa - Software Engineer, Technical Lead & Product Engineering Expert',
    description: 'Technical Lead with 7+ years delivering scalable, user-centered products and leading cross-functional teams. Based in Nairobi, Kenya.',
    images: [
      {
        url: '/images/portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'Godwill Barasa - Software Engineer and Technical Lead',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@godwill_codes',
    creator: '@godwill_codes',
    title: 'Godwill Barasa - Software Engineer, Technical Lead & Product Engineering Expert',
    description: 'Technical Lead with 7+ years delivering scalable, user-centered products and leading cross-functional teams. Based in Nairobi, Kenya.',
    images: ['/images/portrait.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500&family=Work+Sans&display=swap" rel="stylesheet"></link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Godwill Barasa",
              "url": "https://godwillbarasa.com",
              "image": "https://godwillbarasa.com/images/portrait.jpg",
              "description": "Software Engineer, Technical Lead & Product Engineering Expert with 7+ years experience delivering scalable, user-centered products and leading cross-functional teams.",
              "jobTitle": "Technical Lead",
              "worksFor": {
                "@type": "Organization",
                "name": "Piedmont Global Language Solutions"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nairobi",
                "addressCountry": "Kenya"
              },
              "sameAs": [
                "https://twitter.com/godwill_codes",
                "https://www.linkedin.com/in/godwillcodes/",
                "https://github.com/godwillcodes",
                "https://www.instagram.com/godwill.codes"
              ],
              "knowsAbout": [
                "Software Engineering",
                "Product Management",
                "Technical Leadership",
                "Fintech",
                "React",
                "TypeScript",
                "Full Stack Development",
                "Engineering Team Management"
              ],
              "alumniOf": "University of Nairobi"
            })
          }}
        />
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
