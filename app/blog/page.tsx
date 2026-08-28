import type { Metadata } from 'next'

import BlogList from '@/components/BlogList'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl, site, siteUrl } from '@/lib/site'

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: title,
    description,
    url: absoluteUrl('/blog'),
    author: { '@id': `${siteUrl}/#person` },
    publisher: { '@id': `${siteUrl}/#person` },
    /* The archive is about the person, not merely written by him. This is the
       edge that makes the cluster accrue to the entity. */
    about: { '@id': `${siteUrl}/#person` },
    isPartOf: { '@id': `${siteUrl}/#website` },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogList posts={posts} />
    </>
  )
}
