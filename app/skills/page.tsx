import Skills from '@/components/Skills'
import { Metadata } from 'next'

import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Skills & Expertise',
  description: 'Full-stack expertise across React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization, Core Web Vitals, and CI/CD.',
  keywords: ['Senior Full Stack Engineer', 'React', 'Next.js', 'TypeScript', 'Laravel', 'WordPress', 'Performance Optimization', 'Core Web Vitals', 'CI/CD', 'Frontend Development', 'Backend Development'],
  alternates: { canonical: absoluteUrl('/skills') },
  openGraph: {
    url: absoluteUrl('/skills'),
    siteName: site.name,
    title: 'Skills & Expertise | Godwill Barasa',
    description: 'Full-stack expertise across React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization, Core Web Vitals, and CI/CD.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills & Expertise | Godwill Barasa',
    description: 'Full-stack expertise across React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization, Core Web Vitals, and CI/CD.',
  },
}

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Skills />
    </div>
  )
}
