import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/site'

/**
 * The named AI agents are allowed explicitly: they are what decide whether an
 * assistant can answer a question about him. The Studio is an editing
 * surface, not content, for everyone.
 */
const AI_AGENTS = [
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'ChatGPT-User',
  'Claude-User',
  'Perplexity-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio', '/studio/'] },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/studio', '/studio/'],
      })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
