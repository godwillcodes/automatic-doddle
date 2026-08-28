import type { Metadata } from 'next'
import { DM_Sans, Geist_Mono } from 'next/font/google'

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PersonStructuredData, WebsiteStructuredData } from '@/components/StructuredData'
import { site, siteUrl } from '@/lib/site'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2 focus:text-white"
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
