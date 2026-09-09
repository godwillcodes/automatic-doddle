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
  // title on the site. The descriptor says what he IS — the Sept 2026 search
  // audit found the old "Founder, Lock & Mercer" title telling Google the
  // real subject lived at another domain.
  title: 'Godwill Barasa · Software Engineer, Nairobi',
  description:
    'Godwill Barasa is a software engineer in Nairobi. He builds web platforms in Kenya and then runs them — SpaceYako, Business Report, Khendo FM and COFEK — through Lock & Mercer, the studio he founded.',
  locale: 'en_US',
  author: {
    name: 'Godwill Barasa',
    // A job title, not a category tag: the audit caught the schema shipping
    // jobTitle "technology", which no recruiter and no crawler could use.
    jobTitle: 'Software Engineer',
    email: 'godwill.codes@gmail.com',
    /**
     * Confirmed profiles only. An unverified URL in structured data is a
     * machine-readable false claim. Instagram and YouTube were confirmed by
     * the person himself on 10 Sept 2026 (both @realgodwillbarasa); no X
     * profile is confirmed, so none is listed. sameAs is the mechanism
     * Google uses to merge scattered profiles into one entity — every entry
     * here earns its place.
     */
    sameAs: [
      lockAndMercer.teamProfile,
      'https://github.com/godwillcodes',
      'https://www.linkedin.com/in/godwillcodes/',
      'https://iamgodwillb.medium.com/',
      'https://dev.to/godwillb',
      'https://www.instagram.com/realgodwillbarasa/',
      'https://www.youtube.com/@realgodwillbarasa',
    ],
  },
} as const

/** Absolute URL for a site-relative path. Always use this for metadata. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, `${siteUrl}/`).toString().replace(/\/$/, '') || siteUrl
}
