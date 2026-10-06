import type { Metadata } from 'next'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { primaryPhotograph } from '@/lib/person'
import { absoluteUrl, site, siteUrl } from '@/lib/site'

// DM Sans variable — the one face the whole site is set in. Optical sizing
// gives display sizes and body text different cuts of the same family, which
// is what lets a single font carry both the namemark and the prose.
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
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
    default: site.title,
    // One separator everywhere: the middle dot. Every metaTitle is kept at
    // 43 characters or fewer so the full "%s · Godwill Barasa" stays within
    // the ~60 characters Google displays before truncating.
    template: '%s · Godwill Barasa',
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
    title: site.title,
    description: site.description,
    /* The generated card first, then the photograph. A crawler looking for a
       likeness gets one; a social preview gets the designed card. */
    images: [
      { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: site.title },
      {
        url: absoluteUrl(primaryPhotograph.src),
        width: 640,
        height: 640,
        alt: primaryPhotograph.alt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
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
    <html
      lang="en"
      className={`${dmSans.variable} ${plexMono.variable} scroll-smooth`}
    >
      <body className="bg-paper text-ink antialiased">
        {/* React hoists this into <head>. It lives here rather than in
            `alternates` because child routes replace that object wholesale
            when they set their canonical, and the feed must be discoverable
            from every page. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Godwill Barasa — Writing"
          href="/feed.xml"
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-accent focus:px-4 focus:py-2 focus:text-[#14100d]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="co-page">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
