/**
 * One definition of the site's identity. Canonical URLs, the sitemap, robots,
 * Open Graph images, JSON-LD and share links all read from here.
 *
 * This site is the PERSON entity. lockandmercer.com is the company entity.
 * The two assert each other reciprocally in structured data and must never
 * compete for the same queries.
 */
const FALLBACK_URL = 'https://www.godwillbarasa.com'

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

export const lockAndMercer = {
  url: 'https://www.lockandmercer.com',
  organizationId: 'https://www.lockandmercer.com/#organization',
  teamProfile: 'https://www.lockandmercer.com/team/godwill-barasa',
} as const

export const site = {
  url: siteUrl,
  name: 'Godwill Barasa',
  // Middle dot, not an em dash: the one standardized separator across every
  // title on the site (and the same mark the Lock & Mercer team page uses).
  title: 'Godwill Barasa · Founder, Lock & Mercer',
  description:
    'Godwill Barasa is a software engineer in Nairobi. He founded Lock & Mercer, a venture studio, and builds and operates web platforms in Kenya.',
  locale: 'en_US',
  author: {
    name: 'Godwill Barasa',
    jobTitle: 'technology',
    email: 'godwill.codes@gmail.com',
    /**
     * Confirmed profiles only. An unverified URL in structured data is a
     * machine-readable false claim. No X profile is confirmed, so none is
     * listed.
     */
    sameAs: [
      lockAndMercer.teamProfile,
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
