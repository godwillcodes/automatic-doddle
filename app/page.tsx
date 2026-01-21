import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Godwill Barasa | Senior Full-Stack Engineer (React, Next.js, Laravel, WordPress)',
  description: 'Senior Full-Stack Engineer building high-performance web applications with React, Next.js, TypeScript, Laravel, and WordPress. Focused on Core Web Vitals, experimentation, analytics, and CI/CD.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white" itemScope itemType="https://schema.org/WebPage">
      <Hero />
      <Experience />
    </div>
  )
}
