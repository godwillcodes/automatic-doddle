import { photographs, primaryPhotograph, type Faq } from '@/lib/person'
import { absoluteUrl, lockAndMercer, site, siteUrl } from '@/lib/site'

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
    url: siteUrl,
    jobTitle: site.author.jobTitle,
    description: site.description,
    worksFor: { '@id': lockAndMercer.organizationId },
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    knowsAbout: [
      'Venture building',
      'Product engineering',
      'Editorial platforms',
      'Broadcast systems',
      'Website migration',
      'Trust and verification systems',
      'Technical SEO',
      'Web performance',
    ],
    sameAs: [...site.author.sameAs],
    image: withImages
      ? { '@id': `${siteUrl}/#primaryimage` }
      : {
          '@type': 'ImageObject',
          url: absoluteUrl(primaryPhotograph.src),
          caption: primaryPhotograph.alt,
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

/** Homepage: the entity page. ProfilePage is the type Google reads for a person. */
export function homeGraph(faqs: Faq[]) {
  const page = pageNode('ProfilePage', '/', site.title, site.description, {
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
