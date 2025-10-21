import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Godwill Barasa',
    default:
      'Godwill Barasa - Senior Frontend Engineer at Piedmont Global Language Solutions',
  },
  description:
    'Godwill Barasa: Senior Frontend Engineer passionate about building fast, accessible, and human-centered web experiences. 5+ years of experience with React, Vue.js, TypeScript, and Ruby on Rails.',
  keywords: [
    'Godwill Barasa',
    'Frontend Engineer',
    'Software Engineer',
    'React Developer',
    'Vue.js Developer',
    'TypeScript',
    'Ruby on Rails',
    'Accessibility',
    'WCAG 2.1',
    'Core Web Vitals',
    'Full Stack Developer',
    'Piedmont Global Language Solutions',
    'Ogilvy Africa',
    'Belva Digital',
    'Web Development',
    'JavaScript'
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
    title: 'Godwill Barasa - Senior Frontend Engineer & Full Stack Developer',
    description: 'Senior Frontend Engineer with 5+ years building fast, accessible, and human-centered web experiences. Expert in React, Vue.js, TypeScript, and Ruby on Rails.',
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
    title: 'Godwill Barasa - Senior Frontend Engineer & Full Stack Developer',
    description: 'Senior Frontend Engineer with 5+ years building fast, accessible, and human-centered web experiences. Expert in React, Vue.js, TypeScript, and Ruby on Rails.',
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
              "description": "Senior Frontend Engineer with 5+ years experience building fast, accessible, and human-centered web experiences. Expert in React, Vue.js, TypeScript, and Ruby on Rails.",
              "jobTitle": "Senior Frontend Engineer",
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
                "Frontend Development",
                "React",
                "Vue.js",
                "TypeScript",
                "Ruby on Rails",
                "Accessibility",
                "WCAG 2.1",
                "Core Web Vitals",
                "Full Stack Development",
                "JavaScript",
                "Node.js",
                "Docker",
                "Kubernetes"
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
