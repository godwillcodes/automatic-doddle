/**
 * One definition of the site's identity. Canonical URLs, the sitemap, robots,
 * Open Graph images, JSON-LD and share links all read from here, so moving the
 * site to a new domain is a single environment variable.
 */
const FALLBACK_URL = 'https://godwillbarasa.netlify.app'

function resolveUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  // Vercel injects the production domain at build time, which keeps preview
  // deployments from claiming canonical URLs they don't own.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) return `https://${production}`

  return FALLBACK_URL
}

export const siteUrl = resolveUrl()

export const site = {
  url: siteUrl,
  name: 'Godwill Barasa',
  title: 'Godwill Barasa — Senior Web Engineer',
  description:
    'Senior Web Engineer building high-performance web applications with React, Next.js, TypeScript, Laravel and WordPress. Writing about M-Pesa integration, Core Web Vitals and shipping reliably.',
  locale: 'en_US',
  author: {
    name: 'Godwill Barasa',
    jobTitle: 'Senior Web Engineer',
    email: 'godwill.codes@gmail.com',
    sameAs: [
      'https://github.com/godwillcodes',
      'https://www.linkedin.com/in/godwillcodes/',
      'https://iamgodwillb.medium.com/',
      'https://dev.to/godwillb',
    ],
  },
} as const

/** Absolute URL for a site-relative path. Always use this for metadata. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, `${siteUrl}/`).toString().replace(/\/$/, '') || siteUrl
}
