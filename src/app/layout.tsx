import { type Metadata } from 'next'
import Script from 'next/script'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app',
    siteName: 'Godwill Barasa',
    title: 'Godwill Barasa - Senior Frontend Engineer & Full Stack Developer',
    description: 'Senior Frontend Engineer with 5+ years building fast, accessible, and human-centered web experiences. Expert in React, Vue.js, TypeScript, and Ruby on Rails.',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
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
    images: ['/icons/icon-512x512.png'],
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Godwill Barasa',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Godwill Barasa" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-site-verification" content="hxP6GVUrNF3O-j3W0qaPhblUWbGH4BLFOUTSUETit2E" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Godwill Barasa",
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app',
              "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'}/icons/icon-512x512.png`,
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
        <Script
          id="pwa-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  )
}
