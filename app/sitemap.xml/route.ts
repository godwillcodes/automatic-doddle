import { photographs, primaryPhotograph } from '@/lib/person'
import { getAllPosts } from '@/lib/sanity/queries'
import { aboutDates, absoluteUrl, staticPageDates } from '@/lib/site'

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
 * Baked at build time.
 *
 * `changefreq` and `priority` are deliberately ABSENT. Google has said
 * publicly that it ignores both, and emitting values it ignores on every URL
 * is noise that invites the file to be trusted less, not more. `lastmod` is
 * the only hint here that Google acts on, which is exactly why it has to be
 * true: pages whose copy lives in code take `staticPageDates`, bumped by hand,
 * rather than the deploy timestamp they used to carry.
 */
export const dynamic = 'force-static'

interface Entry {
  loc: string
  lastmod: string
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

  // Order matters: loc, lastmod, then extensions.
  return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>${images}
  </url>`
}

export async function GET() {
  const posts = await getAllPosts()

  const staticModified = new Date(staticPageDates.modified).toISOString()

  const newestPost = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toISOString()
    : staticModified

  /**
   * The home page lists the writing and the record, so it genuinely changes
   * when either does. Take whichever moved last rather than claiming a date
   * neither of them supports.
   */
  const homeModified = [newestPost, new Date(aboutDates.modified).toISOString(), staticModified]
    .sort()
    .at(-1) as string

  const entries: Entry[] = [
    {
      loc: absoluteUrl('/'),
      lastmod: homeModified,
      images: photographs.map((photo) => absoluteUrl(photo.src)),
    },
    {
      // The canonical biography, and the page the verification searches want.
      // Its date comes from the record rather than from a build.
      loc: absoluteUrl('/about'),
      lastmod: aboutDates.modified,
      images: [absoluteUrl(primaryPhotograph.src)],
    },
    {
      loc: absoluteUrl('/blog'),
      lastmod: newestPost,
    },
    {
      loc: absoluteUrl('/contact'),
      lastmod: staticModified,
    },
    ...posts.map((post) => ({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: new Date(post.updatedAt ?? post.publishedAt).toISOString(),
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
