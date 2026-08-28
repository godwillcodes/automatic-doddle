import type { Metadata } from 'next'

import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import LatestWriting from '@/components/LatestWriting'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  // Only the canonical is overridden here. Setting `openGraph` on a page
  // REPLACES the parent object rather than merging into it, which is how the
  // homepage previously lost every og:image the layout declared.
  alternates: { canonical: absoluteUrl('/') },
}

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Experience />
      <LatestWriting posts={posts.slice(0, 3)} />
    </div>
  )
}
