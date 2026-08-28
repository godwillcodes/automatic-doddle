import type { Metadata } from 'next'
import Link from 'next/link'

import StackSection from '@/components/home/StackSection'
import ImpactIndex from '@/components/home/ImpactIndex'
import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Skills & Expertise',
  description:
    'Full-stack expertise across React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization, Core Web Vitals, and CI/CD.',
  keywords: ['Senior Full Stack Engineer', 'React', 'Next.js', 'TypeScript', 'Laravel', 'WordPress', 'Performance Optimization', 'Core Web Vitals', 'CI/CD'],
  alternates: { canonical: absoluteUrl('/skills') },
  openGraph: {
    url: absoluteUrl('/skills'),
    siteName: site.name,
    title: 'Skills & Expertise | Godwill Barasa',
    description:
      'Full-stack expertise across React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization, Core Web Vitals, and CI/CD.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills & Expertise | Godwill Barasa',
    description:
      'Full-stack expertise across React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization, Core Web Vitals, and CI/CD.',
  },
}

export default function SkillsPage() {
  return (
    <div className="bg-paper">
      <StackSection />
      <ImpactIndex />
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <Link href="/" className="meta meta-ink">
          ← The full record
        </Link>
      </div>
    </div>
  )
}
