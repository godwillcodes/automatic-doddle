import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Godwill Barasa | Full-Stack Engineer & Performance Architect",
  description: "Full-Stack Engineer specializing in high-performance content delivery systems, WordPress-to-React pipelines, and enterprise architecture. Building scalable solutions at Piedmont Global.",
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
