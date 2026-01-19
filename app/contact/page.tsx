import Contact from '@/components/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Godwill Barasa',
  description: "Let's discuss your next project or collaboration opportunity. Get in touch to talk about web development, performance optimization, or architecture consulting.",
  keywords: ['Contact', 'Web Development', 'Consulting', 'Collaboration'],
  openGraph: {
    title: 'Contact | Godwill Barasa',
    description: "Let's discuss your next project or collaboration opportunity.",
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | Godwill Barasa',
    description: "Let's discuss your next project or collaboration opportunity.",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Contact />
    </div>
  )
}
