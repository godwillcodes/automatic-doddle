import type { MetadataRoute } from 'next'

import { photographs } from '@/lib/person'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl } from '@/lib/site'

/**
 * Falls back to hourly regeneration so a Studio publish reaches the site even
 * if the Sanity webhook at /api/revalidate is not configured. The webhook
 * makes it immediate.
 */
export const revalidate = 3600


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const newestPost = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt)
    : new Date()

  return [
    {
      url: absoluteUrl('/'),
      lastModified: newestPost,
      changeFrequency: 'weekly' as const,
      priority: 1,
      /* Image sitemap entries. This is how Google learns which images belong
         to this page; without them it has to discover them by crawling and
         may never associate them with the person. */
      images: photographs.map((photo) => absoluteUrl(photo.src)),
    },
    { url: absoluteUrl('/blog'), lastModified: newestPost, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/contact'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.9 : 0.8,
    })),
  ]
}
