import Contact from '@/components/Contact'
import { Metadata } from 'next'

import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Let's discuss your next project. Get in touch to talk about full-stack development with React, Next.js, TypeScript, Laravel, and WordPress—plus performance optimization and Core Web Vitals.",
  keywords: ['Contact', 'Senior Full Stack Engineer', 'React', 'Next.js', 'TypeScript', 'Laravel', 'WordPress', 'Performance Optimization', 'Core Web Vitals', 'Consulting', 'Collaboration'],
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    url: absoluteUrl('/contact'),
    siteName: site.name,
    title: 'Contact | Godwill Barasa',
    description: "Let's discuss your next project. Full-stack development, performance optimization, and Core Web Vitals.",
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | Godwill Barasa',
    description: "Let's discuss your next project. Full-stack development, performance optimization, and Core Web Vitals.",
  },
}

export default function ContactPage() {
  return (
    <div className=" bg-white py-20">
      <Contact />
    </div>
  )
}
