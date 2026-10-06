import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl, site } from '@/lib/site'

/**
 * RSS 2.0 for the writing.
 *
 * The Oct 2026 review found /feed.xml and /rss.xml both returning 404. A feed
 * is how aggregators, readers and a share of AI crawlers discover new posts
 * without being told; without one, every new piece waits for a recrawl.
 *
 * Static, like the sitemap: it changes when the posts do, and the revalidation
 * webhook that rebuilds the site rebuilds this with it.
 */
export const dynamic = 'force-static'

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const rfc822 = (iso: string) => new Date(iso).toUTCString()

export async function GET() {
  const posts = await getAllPosts()
  const feedUrl = absoluteUrl('/feed.xml')
  const newest = posts[0]?.updatedAt ?? posts[0]?.publishedAt ?? new Date().toISOString()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.publishedAt)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(site.author.email)} (${escapeXml(site.author.name)})</author>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Writing`)}</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escapeXml('Long-form technical writing from Godwill Barasa, senior software engineer in Nairobi. Mostly M-Pesa and the Daraja API in production.')}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(newest)}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
