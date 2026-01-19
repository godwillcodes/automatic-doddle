import Skills from '@/components/Skills'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills & Expertise | Godwill Barasa',
  description: 'A comprehensive foundation in modern web development, infrastructure, performance optimization, and product thinking.',
  keywords: ['React', 'Next.js', 'TypeScript', 'Performance', 'Architecture', 'Full Stack', 'Frontend Development'],
  openGraph: {
    title: 'Skills & Expertise | Godwill Barasa',
    description: 'A comprehensive foundation in modern web development, infrastructure, performance optimization, and product thinking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills & Expertise | Godwill Barasa',
    description: 'A comprehensive foundation in modern web development, infrastructure, performance optimization, and product thinking.',
  },
}

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Skills />
    </div>
  )
}
