import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PersonStructuredData, WebsiteStructuredData } from '@/components/StructuredData'
import { site, siteUrl } from '@/lib/site'

// Archivo variable, with the width axis: display type and numerals use the
// condensed cut (font-stretch in globals.css), body text the normal width.
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  preload: true,
})

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Godwill Barasa | Senior Web Engineer (React, Next.js, Laravel, WordPress)',
    template: '%s | Godwill Barasa',
  },
  description: site.description,
  applicationName: 'Godwill Barasa',
  authors: [{ name: site.author.name, url: siteUrl }],
  creator: site.author.name,
  publisher: site.author.name,
  formatDetection: { email: false, address: false, telephone: false },
  // Deliberately not set here. `alternates` is inherited by every child route,
  // so a canonical on the layout would point /blog, /skills and /contact at the
  // homepage and get them dropped as duplicates. Each page declares its own.
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: siteUrl,
    siteName: site.name,
    title: 'Godwill Barasa | Senior Web Engineer',
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Godwill Barasa | Senior Web Engineer',
    description: site.description,
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: '4WawvNgxOtreoVcJ8yQBtgXVYwKdi47Dvyo9JbLqRu4',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} scroll-smooth`}>
      <body
        className="bg-paper text-ink antialiased"
      >
        <PersonStructuredData
          data={{
            name: site.author.name,
            url: siteUrl,
            jobTitle: site.author.jobTitle,
            description: site.description,
            sameAs: [...site.author.sameAs],
          }}
        />
        <WebsiteStructuredData
          data={{ name: site.name, url: siteUrl, description: site.description }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
