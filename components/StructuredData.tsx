import { lockAndMercer, site, siteUrl } from '@/lib/site'

/**
 * One @graph carrying the Person and WebSite nodes. The Person asserts
 * worksFor against the Lock & Mercer organization @id, and lists the Lock &
 * Mercer team profile in sameAs. The company side asserts the reverse. A
 * symmetric assertion is what lets a search engine merge the two pages into
 * one entity instead of treating a shared name as coincidence.
 */
export function PersonGraph() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Godwill Barasa',
        url: siteUrl,
        jobTitle: 'technology',
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
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Godwill Barasa',
        about: { '@id': `${siteUrl}/#person` },
        inLanguage: 'en',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export interface FaqEntry {
  question: string
  answer: string
}

/**
 * FAQPage markup. Each answer is written to make sense quoted on its own with
 * no page around it, because that is what an assistant lifts.
 */
export function FaqStructuredData({ entries }: { entries: FaqEntry[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
