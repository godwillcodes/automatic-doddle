import { photographs } from '@/lib/person'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl } from '@/lib/site'

/**
 * The sitemap, emitted by hand rather than through MetadataRoute.Sitemap.
 *
 * The generated version placed `<image:image>` immediately after `<loc>`,
 * which fails validation against the official schema: sitemap.xsd defines the
 * children of `<url>` as an ordered xsd:sequence of loc, lastmod, changefreq,
 * priority, and only then `<xsd:any namespace="##other">` for extensions. Any
 * extension element has to come last, and the generator gives no way to
 * control that ordering, so the document is built here instead.
 *
 * Baked at build time. `lastmod` on the pages whose content lives in code is
 * the deploy timestamp, which is genuinely when they last changed; letting it
 * regenerate hourly would move the date without the content moving with it.
 */
export const dynamic = 'force-static'

const BUILT_AT = new Date().toISOString()

interface Entry {
  loc: string
  lastmod: string
  changefreq: 'weekly' | 'monthly'
  priority: string
  images?: string[]
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

function urlNode(entry: Entry): string {
  const images = (entry.images ?? [])
    .map(
      (src) =>
        `\n    <image:image>\n      <image:loc>${escapeXml(src)}</image:loc>\n    </image:image>`
    )
    .join('')

  // Order matters: loc, lastmod, changefreq, priority, then extensions.
  return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${images}
  </url>`
}

export async function GET() {
  const posts = await getAllPosts()

  const newestPost = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toISOString()
    : BUILT_AT

  const entries: Entry[] = [
    {
      loc: absoluteUrl('/'),
      lastmod: BUILT_AT,
      changefreq: 'weekly',
      priority: '1.0',
      images: photographs.map((photo) => absoluteUrl(photo.src)),
    },
    {
      loc: absoluteUrl('/blog'),
      lastmod: newestPost,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      loc: absoluteUrl('/contact'),
      lastmod: BUILT_AT,
      changefreq: 'monthly',
      priority: '0.6',
    },
    ...posts.map((post) => ({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: new Date(post.updatedAt ?? post.publishedAt).toISOString(),
      changefreq: 'monthly' as const,
      priority: post.featured ? '0.9' : '0.8',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(urlNode).join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
