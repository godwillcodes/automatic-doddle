import { photographs, primaryPhotograph, record, type Faq } from '@/lib/person'
import { aboutDates, absoluteUrl, employer, lockAndMercer, site, siteUrl } from '@/lib/site'

/**
 * One @graph per page.
 *
 * Every page emits a single JSON-LD block rather than several independent
 * scripts. Separate scripts cannot reference each other by @id, so a crawler
 * has to guess whether the Person in one block is the author named in
 * another. Inside one graph the reference is explicit.
 *
 * Node identity, and what each is for:
 *
 *   #person    the entity this whole site exists to resolve
 *   #website   the site itself, `about` the person
 *   #<page>    a page node per URL, so `mainEntityOfPage` points at something
 *              that is actually defined rather than a bare URL
 *   #primaryimage  the likeness, asserted once
 *
 * The photographs are emitted only on the homepage, because that is the only
 * page that displays them. Repeating five ImageObjects on twenty-one pages
 * asserts that every article is illustrated by a portrait, which is not true
 * and is not a claim worth making twenty-one times.
 */

type Node = Record<string, unknown>

const PERSON_ID = `${siteUrl}/#person`
const WEBSITE_ID = `${siteUrl}/#website`

export const personRef = { '@id': PERSON_ID }
export const websiteRef = { '@id': WEBSITE_ID }

function personNode(withImages: boolean): Node {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.author.name,
    alternateName: [...site.author.alternateName],
    url: siteUrl,
    jobTitle: site.author.jobTitle,
    description: site.description,
    /*
     * The employment history, as schema.org actually models it.
     *
     * worksFor used to be a single @id minted on lockandmercer.com, which no
     * crawler can resolve from here, so the one employment fact in the graph
     * was one Google had to drop. It is now the full dated record, each entry
     * an EmployeeRole wrapping the Organization — the Role convention, where
     * the inner property repeats the outer one. A first draft put the dates
     * under hasOccupation with worksFor inside an OrganizationRole, which
     * reads sensibly and is not valid: hasOccupation takes an Occupation, and
     * a Role's inner property must match the property it wraps.
     *
     * The current employer carries its url and address so the entity can be
     * corroborated. Past employers are named; asserting addresses nobody
     * verified would be the kind of claim this file exists to avoid.
     */
    worksFor: record
      .filter((r) => r.start)
      .map((r) => ({
        '@type': 'EmployeeRole',
        roleName: r.role,
        startDate: r.start,
        ...(r.end ? { endDate: r.end } : {}),
        worksFor:
          r.org === employer.shortName
            ? {
                '@type': 'Organization',
                name: employer.name,
                url: employer.url,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: employer.locality,
                  addressRegion: employer.region,
                  addressCountry: employer.country,
                },
              }
            : { '@type': 'Organization', name: r.org },
      })),
    // The standing title, which is what hasOccupation is for.
    hasOccupation: { '@type': 'Occupation', name: site.author.jobTitle },
    // The studio is something he founded, which is the accurate relation and
    // keeps it from competing with him as the subject of this site.
    founder: {
      '@type': 'Organization',
      '@id': lockAndMercer.organizationId,
      name: 'Lock & Mercer',
      url: lockAndMercer.url,
      sameAs: [lockAndMercer.url],
    },
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    /*
     * Led by what the site actually ranks for. This used to open with "Venture
     * building" and "Broadcast systems" and never mention M-Pesa, Daraja,
     * TypeScript or Node.js — so the nine M-Pesa posts, the only cluster with
     * a chance of owning its SERP, were unclaimed by the entity that wrote
     * them.
     */
    knowsAbout: [
      'M-Pesa Daraja API integration',
      'Payments reconciliation',
      'TypeScript',
      'Node.js',
      'Next.js',
      'Web performance',
      'Technical SEO',
      'Website migration',
      'Editorial platforms',
      'Broadcast systems',
    ],
    sameAs: [...site.author.sameAs],
    image: withImages
      ? { '@id': `${siteUrl}/#primaryimage` }
      : {
          '@type': 'ImageObject',
          url: absoluteUrl(primaryPhotograph.src),
          caption: primaryPhotograph.alt,
          creator: personRef,
          ...imageCredit,
        },
  }
}

function websiteNode(): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteUrl,
    name: site.name,
    description: site.description,
    inLanguage: 'en',
    about: personRef,
    publisher: personRef,
    copyrightHolder: personRef,
  }
}

/**
 * creditText and copyrightNotice on every ImageObject: Google's image
 * metadata treatment reads them as the visible credit line, and Search
 * Console flags their absence. Both are plain statements of fact here —
 * the photographs are the person's own.
 */
const imageCredit = {
  creditText: site.author.name,
  copyrightNotice: `© ${site.author.name}`,
} as const

function imageNodes(): Node[] {
  return photographs.map((photo, index) => ({
    '@type': 'ImageObject',
    '@id':
      index === 0
        ? `${siteUrl}/#primaryimage`
        : absoluteUrl(`${photo.src}#image`),
    url: absoluteUrl(photo.src),
    contentUrl: absoluteUrl(photo.src),
    caption: photo.alt,
    description: photo.alt,
    about: personRef,
    creator: personRef,
    ...imageCredit,
    isPartOf: websiteRef,
    ...(index === 0 ? { representativeOfPage: true } : {}),
  }))
}

function breadcrumbs(trail: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      ...trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: t.name,
        item: absoluteUrl(t.path),
      })),
    ],
  }
}

function pageNode(
  type: string,
  path: string,
  name: string,
  description: string,
  extra: Node = {}
): Node {
  const url = absoluteUrl(path)
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: websiteRef,
    inLanguage: 'en',
    ...extra,
  }
}

const graph = (nodes: Node[]) => ({ '@context': 'https://schema.org', '@graph': nodes })

/**
 * Homepage: where the person entity is defined, and the index of the work.
 *
 * This was a ProfilePage until /about existed. Two ProfilePages for one person
 * is the same split-entity problem the Oct 2026 review is about, in miniature:
 * a crawler asked which page is the profile gets two answers. The biography
 * lives at /about now, so that page carries ProfilePage and this one is a
 * WebPage that still names the person as its main entity.
 */
export function homeGraph(faqs: Faq[]) {
  const page = pageNode('WebPage', '/', site.title, site.description, {
    mainEntity: personRef,
    primaryImageOfPage: { '@id': `${siteUrl}/#primaryimage` },
  })

  return graph([
    personNode(true),
    ...imageNodes(),
    websiteNode(),
    page,
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      isPartOf: { '@id': `${page['@id']}` },
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ])
}

export interface BlogIndexPost {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
}

export function blogGraph(
  title: string,
  description: string,
  posts: BlogIndexPost[]
) {
  const page = pageNode('CollectionPage', '/blog', title, description, {
    mainEntity: { '@id': `${absoluteUrl('/blog')}#blog` },
  })

  return graph([
    personNode(false),
    websiteNode(),
    page,
    breadcrumbs([{ name: 'Writing', path: '/blog' }]),
    {
      '@type': 'Blog',
      '@id': `${absoluteUrl('/blog')}#blog`,
      url: absoluteUrl('/blog'),
      name: title,
      description,
      inLanguage: 'en',
      isPartOf: websiteRef,
      author: personRef,
      publisher: personRef,
      about: personRef,
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        '@id': `${absoluteUrl(`/blog/${post.slug}`)}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        url: absoluteUrl(`/blog/${post.slug}`),
        author: personRef,
      })),
    },
  ])
}

export interface ArticleGraphInput {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  category: string
  keywords?: string[]
  /** Counted from the rendered prose, not estimated from reading time. */
  wordCount: number
  readingTime: number
  imageUrl: string
}

export function articleGraph(post: ArticleGraphInput) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  const page = pageNode('WebPage', `/blog/${post.slug}`, post.title, post.excerpt, {
    primaryImageOfPage: { '@id': `${url}#primaryimage` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
  })

  return graph([
    personNode(false),
    websiteNode(),
    page,
    breadcrumbs([
      { name: 'Writing', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    {
      '@type': 'ImageObject',
      '@id': `${url}#primaryimage`,
      url: post.imageUrl,
      contentUrl: post.imageUrl,
      width: 1200,
      height: 630,
      caption: post.title,
      creator: personRef,
      ...imageCredit,
    },
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      url,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      wordCount: post.wordCount,
      timeRequired: `PT${post.readingTime}M`,
      inLanguage: 'en',
      articleSection: post.category,
      keywords: post.keywords?.join(', '),
      author: personRef,
      publisher: personRef,
      copyrightHolder: personRef,
      // Both edges, because they answer different questions: which page is
      // this article, and which collection does it belong to.
      mainEntityOfPage: { '@id': `${url}#webpage` },
      isPartOf: { '@id': `${absoluteUrl('/blog')}#blog` },
      image: { '@id': `${url}#primaryimage` },
    },
    // The collection the article says it belongs to. This was referenced on
    // all nineteen articles and defined only on /blog — the same shape as the
    // worksFor @id the Oct 2026 review caught, nineteen times over. A graph
    // is per page; an @id it points at has to be in it.
    {
      '@type': 'Blog',
      '@id': `${absoluteUrl('/blog')}#blog`,
      url: absoluteUrl('/blog'),
      name: 'Writing',
      author: personRef,
      isPartOf: websiteRef,
    },
  ])
}

/**
 * /about: the canonical biography.
 *
 * The review's finding was that 89% of the queries reaching this site are
 * verification searches — someone checking a dated claim about the person —
 * landing on pages with no dated biography to check against. This is the page
 * they should land on, and the one an AI system should quote.
 *
 * Only the portrait is emitted, not the full gallery: that is the photograph
 * this page displays, and it is the node #person already points at as the
 * likeness. Asserting the other four here would claim the page shows them.
 */
export function aboutGraph(title: string, description: string) {
  const page = pageNode('ProfilePage', '/about', title, description, {
    mainEntity: personRef,
    primaryImageOfPage: { '@id': `${siteUrl}/#primaryimage` },
    dateCreated: aboutDates.created,
    dateModified: aboutDates.modified,
  })

  return graph([
    personNode(true),
    ...imageNodes().slice(0, 1),
    websiteNode(),
    page,
    breadcrumbs([{ name: 'About', path: '/about' }]),
  ])
}

export function contactGraph(title: string, description: string) {
  return graph([
    personNode(false),
    websiteNode(),
    pageNode('ContactPage', '/contact', title, description, {
      mainEntity: personRef,
    }),
    breadcrumbs([{ name: 'Contact', path: '/contact' }]),
  ])
}

/** Serialised safely: JSON.stringify can emit `</script>` and close the tag. */
export const serialize = (data: unknown) =>
  JSON.stringify(data).replace(/</g, '\\u003c')
