import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

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

const elsewhere = [
  { label: 'GitHub', href: 'https://github.com/godwillcodes' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/godwillcodes/' },
  { label: 'Medium', href: 'https://iamgodwillb.medium.com/' },
  { label: 'DEV', href: 'https://dev.to/godwillb' },
]

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
      worksFor: { '@type': 'Organization', name: 'Piedmont Global', url: 'https://piedmontglobal.com/' },
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
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-8 lg:py-28">
        <div className="mb-6 inline-block rounded-full border border-black/10 bg-black/[0.02] px-4 py-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-black/50">
            About
          </span>
        </div>

        <h1 className="mb-10 text-4xl font-semibold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Godwill Barasa
        </h1>

        <div className="space-y-6 text-lg font-light leading-relaxed text-black/65">
          <p>
            I am a Senior Web Engineer based in Nairobi, currently at{' '}
            <a
              href="https://piedmontglobal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/25 decoration-2 underline-offset-2 transition-colors hover:decoration-black/60"
            >
              Piedmont Global
            </a>
            . I have spent about eight years building, scaling and optimising
            high-traffic web applications — mostly in React and Next.js, with
            Laravel and WordPress behind a good number of them.
          </p>

          <p>
            The work I care about sits at the boundary between engineering and
            outcome: performance budgets that survive a marketing deadline,
            component libraries that other teams actually adopt, CI pipelines
            that catch regressions before a client does. At Ogilvy Africa I led
            a distributed team shipping fifteen or more features a quarter
            across a multi-project setup, and took on-time delivery from 70% to
            95% by fixing process and tooling rather than working longer hours.
          </p>

          <p>
            Before that, agency work in Nairobi taught me the thing that shapes
            most of how I build: in this market, the constraint is rarely the
            framework. It is the 3G connection, the entry-level Android device,
            and the payment rail that only speaks USSD. Building for that makes
            you a better engineer everywhere else.
          </p>

          <p>
            I write mostly about the parts that are underdocumented — M-Pesa and
            the Daraja API in production, Core Web Vitals on real WordPress
            sites, and the failure modes nobody puts in a getting-started guide.
            Most of it is on{' '}
            <Link
              href="/blog"
              className="underline decoration-black/25 decoration-2 underline-offset-2 transition-colors hover:decoration-black/60"
            >
              the blog
            </Link>
            .
          </p>

          <p>
            I also maintain a couple of open source projects:{' '}
            <a
              href="https://github.com/godwillcodes/PixelPress"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/25 decoration-2 underline-offset-2 transition-colors hover:decoration-black/60"
            >
              PixelPress
            </a>
            , a client-side image compressor, and{' '}
            <a
              href="https://github.com/godwillcodes/WPSitePerformanceTracker"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-black/25 decoration-2 underline-offset-2 transition-colors hover:decoration-black/60"
            >
              Site Performance Tracker
            </a>
            , a WordPress plugin for continuous Core Web Vitals monitoring.
          </p>
        </div>

        <div className="mt-12 border-t border-black/10 pt-8">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-black/40">
            Elsewhere
          </h2>
          <div className="flex flex-wrap gap-3">
            {elsewhere.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm text-black/60 transition-colors hover:border-black/25 hover:text-black"
              >
                {item.label}
                <ArrowUpRight size={14} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-black/90"
          >
            Get in touch
          </Link>
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-base font-medium text-black/70 transition-colors hover:border-black/25 hover:text-black"
          >
            What I work with
          </Link>
        </div>
      </section>
    </div>
  )
}
