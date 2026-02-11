import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'

// Ensure sitemap is generated at request time so it includes all routes (avoids build-time-only snapshot on Netlify)
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Static pages – always included so sitemap is never empty
const staticRoutes: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogUrls: MetadataRoute.Sitemap = []

  try {
    const posts = await getAllPosts()
    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    // If blog content fails (e.g. build env), still serve static routes
  }

  return [...staticRoutes, ...blogUrls]
}
