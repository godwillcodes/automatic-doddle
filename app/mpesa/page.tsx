import type { Metadata } from 'next'
import Link from 'next/link'

import StructuredData from '@/components/StructuredData'
import { ALL_CODES } from '@/lib/mpesa'
import { OUT_OF_SCOPE, PILLAR_STAGES } from '@/lib/mpesa-pillar'
import { getAllPosts } from '@/lib/sanity/queries'
import { mpesaPillarGraph } from '@/lib/seo/graph'
import { absoluteUrl, site } from '@/lib/site'

export const revalidate = 3600

// 41 characters, so the templated title lands at 58.
const title = 'M-Pesa in production: Daraja field notes'
const description =
  'Field notes on running M-Pesa Daraja in production: callbacks that never arrive, duplicate charges, reconciliation and go-live, plus a result-code reference.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/mpesa') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/mpesa'),
    title,
    description,
    siteName: site.name,
    images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description },
}

/**
 * The M-Pesa pillar.
 *
 * Nine posts on this subject existed with no hub, so they competed with one
 * another for the same queries and accumulated no topical weight between them.
 * This page is the parent they were missing.
 *
 * It is organised by the integration lifecycle rather than by date, because
 * the problems arrive in that order and a reader can locate themselves in it.
 * It also states what it does NOT cover and links out to beginner material:
 * the people that sends away were never going to hire anyone, and saying so is
 * the clearest way to state what this collection is actually for.
 */
export default async function MpesaPillar() {
  const posts = await getAllPosts()
  const bySlug = new Map(posts.map((p) => [p.slug, p]))

  const staged = PILLAR_STAGES.map((stage) => ({
    ...stage,
    posts: stage.slugs.map((s) => bySlug.get(s)).filter(Boolean),
  })).filter((s) => s.posts.length)

  const total = staged.reduce((n, s) => n + s.posts.length, 0)

  const graph = mpesaPillarGraph(
    title,
    description,
    staged.flatMap((stage) =>
      stage.posts.map((p) => ({ url: absoluteUrl(`/blog/${p!.slug}`), name: p!.title }))
    )
  )

  return (
    <div className="co-wrap co-pillar">
      <StructuredData graph={graph} />

      <header className="co-pillar-head">
        <p className="meta">Pillar · Mobile Money</p>
        <h1>M-Pesa in production</h1>
        <p className="co-pillar-lede">
          Not a getting-started guide. This is what happens after the first payment
          works: the callback that never arrives, the customer charged twice, the
          ledger that disagrees with Safaricom on a Monday morning.
        </p>
        <p className="co-pillar-sub">
          {total} field notes from four platforms I built and still run, plus a{' '}
          <Link href="/mpesa/result-codes">searchable result-code reference</Link> and{' '}
          <Link href="/mpesa/daraja-3">what Daraja 3.0 actually changed</Link>.
        </p>
      </header>

      {staged.map((stage) => (
        <section key={stage.id} id={stage.id} className="co-stage">
          <div className="co-stage-head">
            <h2>{stage.title}</h2>
            <p className="co-detail m-0">{stage.standfirst}</p>
          </div>
          <ul className="co-stage-list">
            {stage.posts.map((p) => (
              <li key={p!.slug}>
                <Link href={`/blog/${p!.slug}`}>
                  <span className="co-stage-title">{p!.title}</span>
                  <span className="co-detail">{p!.excerpt}</span>
                  <span className="meta">{p!.readingTime} min read</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="co-stage" id="reference">
        <div className="co-stage-head">
          <h2>Reference</h2>
          <p className="co-detail m-0">
            Safaricom publishes no consolidated error reference, so this is the one I
            keep.
          </p>
        </div>
        <ul className="co-stage-list">
          <li>
            <Link href="/mpesa/result-codes">
              <span className="co-stage-title">Daraja result codes and API errors</span>
              <span className="co-detail">
                All {ALL_CODES.length} codes I have actually hit, each with what causes
                it, whether a retry helps, and where the meaning is attested.
              </span>
              <span className="meta">Searchable · maintained</span>
            </Link>
          </li>
          <li>
            <Link href="/mpesa/daraja-3">
              <span className="co-stage-title">What Daraja 3.0 changed, and what it did not</span>
              <span className="co-detail">
                Checked against Safaricom’s own portal rather than the launch coverage.
              </span>
              <span className="meta">Verified October 2026</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* Stating the boundary is more useful than implying total coverage. */}
      <section className="co-scope">
        <h2 className="meta">Not covered here</h2>
        <p className="m-0">
          <strong>{OUT_OF_SCOPE.text}.</strong> {OUT_OF_SCOPE.note}
        </p>
      </section>
    </div>
  )
}
