import type { Metadata } from 'next'

import BlogList from '@/components/BlogList'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl, site } from '@/lib/site'

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
    author: { '@type': 'Person', name: site.author.name, url: site.url },
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
