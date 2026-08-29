import type { Metadata } from 'next'

import BlogList from '@/components/BlogList'
import StructuredData from '@/components/StructuredData'
import { blogGraph } from '@/lib/seo/graph'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl, site } from '@/lib/site'

/**
 * Falls back to hourly regeneration so a Studio publish reaches the site even
 * if the Sanity webhook at /api/revalidate is not configured. The webhook
 * makes it immediate.
 */
export const revalidate = 3600


const title = 'Writing on web engineering, performance and M-Pesa'
const description =
  'Field notes on building for the web: M-Pesa and Daraja integration, Core Web Vitals, and the architecture decisions that hold up in production.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/blog'),
    title,
    description,
    siteName: site.name,
  },
  twitter: { card: 'summary_large_image', title, description },
}

export default async function BlogPage() {
  const posts = await getAllPosts()


  return (
    <>
      <StructuredData graph={blogGraph(title, description, posts)} />
      <BlogList posts={posts} />
    </>
  )
}
