import type { Metadata } from 'next'
import Link from 'next/link'

import CodeTable from '@/components/CodeTable'
import StructuredData from '@/components/StructuredData'
import { ALL_CODES, ERROR_CODES, RESULT_CODES } from '@/lib/mpesa'
import { codeReferenceGraph } from '@/lib/seo/graph'
import { absoluteUrl, site, staticPageDates } from '@/lib/site'

// 26 characters, so the templated title lands at 43 — well inside 60, and
// the query itself leads.
const title = 'M-Pesa Daraja result codes'
const description =
  'Every Daraja result code and API error I have hit in production, what causes it, and whether retrying helps. Safaricom publishes no consolidated list.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/mpesa/result-codes') },
  openGraph: {
    type: 'article',
    url: absoluteUrl('/mpesa/result-codes'),
    title,
    description,
    siteName: site.name,
    images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description },
}

/**
 * The reference page.
 *
 * Built to be cited rather than read end to end: every code carries an id so a
 * Stack Overflow answer or a GitHub issue can link the exact row, and the full
 * table ships in the server-rendered HTML so each one is crawlable.
 *
 * Marked up as a Dataset, which is the honest description. It is not an
 * article — it is a maintained table whose value is being correct and linkable.
 */
export default function ResultCodesPage() {
  const path = '/mpesa/result-codes'

  const graph = codeReferenceGraph(title, description, staticPageDates.modified, ALL_CODES)

  return (
    <div className="co-wrap co-pillar">
      <StructuredData graph={graph} />

      <header className="co-pillar-head">
        <p className="meta">
          <Link href="/mpesa">M-Pesa</Link> · Reference
        </p>
        <h1>Daraja result codes and API errors</h1>
        <p className="co-pillar-lede">
          Safaricom does not publish a consolidated list. This is the one I keep,
          from {RESULT_CODES.length} result codes and {ERROR_CODES.length} API errors
          I have hit running M-Pesa on four platforms.
        </p>
      </header>

      {/* The distinction that causes the most wasted debugging time. */}
      <section className="co-scope">
        <h2 className="meta">Two families, routinely confused</h2>
        <p>
          <strong>errorCode</strong> — dotted strings like <code>400.002.02</code>, returned
          in the HTTP response when your request is rejected before it reaches the
          customer. Your request was wrong.
        </p>
        <p>
          <strong>ResultCode</strong> — integers like <code>1032</code>, delivered to your
          callback after the customer’s handset has been involved. Your request was
          fine; something happened at the other end.
        </p>
        <p className="m-0">
          A <code>200 OK</code> on the push request means Safaricom accepted it, not that
          the customer paid. Treating acceptance as payment is the defect behind most
          double-charges — see{' '}
          <Link href="/blog/mpesa-idempotency-reconciliation">
            idempotency and reconciliation
          </Link>
          .
        </p>
      </section>

      <CodeTable codes={ALL_CODES} />

      <section className="co-scope">
        <h2 className="meta">How this list is maintained</h2>
        <p className="m-0">
          Every row says where its meaning is attested. Where community sources
          disagree — <code>2001</code> is the live example — the row says so rather than
          picking a winner, because a reference that quietly guesses is worse than no
          reference. Last reviewed {staticPageDates.modified}.
        </p>
      </section>
    </div>
  )
}
