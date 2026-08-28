import type { Metadata } from 'next'

import HeroCover from '@/components/home/HeroCover'
import Thesis from '@/components/home/Thesis'
import SelectedWork from '@/components/home/SelectedWork'
import Chronology from '@/components/home/Chronology'
import ImpactIndex from '@/components/home/ImpactIndex'
import StackSection from '@/components/home/StackSection'
import Laboratory from '@/components/home/Laboratory'
import FieldNotes from '@/components/home/FieldNotes'
import AboutSection from '@/components/home/AboutSection'
import ContactClosing from '@/components/home/ContactClosing'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl } from '@/lib/site'

/**
 * Falls back to hourly regeneration so a Studio publish reaches the site even
 * if the Sanity webhook at /api/revalidate is not configured. The webhook
 * makes it immediate.
 */
export const revalidate = 3600

export const metadata: Metadata = {
  // Only the canonical is overridden here. Setting `openGraph` on a page
  // REPLACES the parent object rather than merging into it, which is how the
  // homepage previously lost every og:image the layout declared.
  alternates: { canonical: absoluteUrl('/') },
}

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="bg-paper">
      <HeroCover />
      <Thesis />
      <SelectedWork />
      <Chronology />
      <ImpactIndex />
      <StackSection />
      <Laboratory />
      <FieldNotes posts={posts} />
      <AboutSection />
      <ContactClosing />
    </div>
  )
}
