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

/**
 * The employer.
 *
 * The Oct 2026 review found Person.worksFor pointing at Lock & Mercer via an
 * @id minted on lockandmercer.com. A crawler cannot resolve an @id it has
 * never seen defined, so the only employment fact in the graph was one Google
 * had to discard — while the visible copy named Piedmont Global. The schema
 * now states the employer inline, and Lock & Mercer is asserted as what it
 * actually is: a company he founded.
 */
export const employer = {
  name: 'Piedmont Global Language Solutions',
  shortName: 'Piedmont Global',
  url: 'https://piedmontglobal.com',
  locality: 'Fairfax',
  region: 'VA',
  country: 'US',
} as const

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
  title: 'Godwill Barasa · Senior Software Engineer, Nairobi',
  description:
    'Godwill Barasa is a software engineer in Nairobi. He builds web platforms in Kenya and then runs them — SpaceYako, Business Report, Khendo FM and COFEK — through Lock & Mercer, the studio he founded.',
  locale: 'en_US',
  author: {
    name: 'Godwill Barasa',
    /*
     * The one canonical title. Chosen by the person himself on 6 Oct 2026
     * after the review found five in circulation — "Software Engineer" here,
     * "Senior Software Engineer" in the hero, "Senior Engineer, Web Platform"
     * in the Record, "Senior Web Engineer" on the OG image, and "technology"
     * on Lock & Mercer. An entity Google cannot pin a title to is an entity it
     * does not trust, which is the whole brand-query problem.
     *
     * This is the general title. The Record still shows the specific role he
     * holds at Piedmont Global, which is not a contradiction: hasOccupation
     * carries the per-employer roleName, jobTitle carries the standing one.
     *
     * Changing it means changing LinkedIn, GitHub and Lock & Mercer too.
     */
    jobTitle: 'Senior Software Engineer',
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
