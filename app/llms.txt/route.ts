import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl, lockAndMercer, site } from '@/lib/site'

/**
 * llms.txt — the llmstxt.org convention: a small markdown map of the site for
 * AI assistants, the way robots.txt is a map for crawlers. The robots policy
 * already welcomes every AI agent; this hands the ones that look for it a
 * clean index instead of leaving them to infer structure from HTML.
 *
 * Everything here restates what the pages already say — identity from
 * lib/site, articles from Sanity. Nothing is claimed that a page does not
 * claim itself.
 *
 * Baked at build time, like the sitemap: the article list only gains entries
 * on deploy (dynamicParams is false), so regenerating between deploys would
 * change nothing.
 */
export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()

  const lines = [
    `# ${site.author.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Pages',
    '',
    `- [Home](${site.url}/): who Godwill Barasa is, with verified facts, FAQs and photographs`,
    `- [Writing](${absoluteUrl('/blog')}): field notes on web engineering, M-Pesa integration and performance`,
    `- [Contact](${absoluteUrl('/contact')}): how to reach him`,
    '',
    '## Writing',
    '',
    ...posts.map(
      (post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt}`
    ),
    '',
    '## Elsewhere',
    '',
    `- [Lock & Mercer](${lockAndMercer.url}): the venture studio he founded`,
    `- [Team profile](${lockAndMercer.teamProfile}): his page at the studio`,
    ...site.author.sameAs.map((url) => `- ${url}`),
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
