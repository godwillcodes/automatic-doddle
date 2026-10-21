import type { Metadata } from 'next'
import Link from 'next/link'

import StructuredData from '@/components/StructuredData'
import { darajaThreeGraph } from '@/lib/seo/graph'
import { absoluteUrl, site, staticPageDates } from '@/lib/site'

// 24 characters, templated title lands at 41.
const title = 'Daraja 3.0: what changed'
const description =
  'The STK Push endpoint, OAuth flow and callback payload are unchanged, so existing integrations keep working. What is new, and what Safaricom has not documented.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/mpesa/daraja-3') },
  openGraph: {
    type: 'article',
    url: absoluteUrl('/mpesa/daraja-3'),
    title,
    description,
    siteName: site.name,
    images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description },
}

/**
 * The Daraja 3.0 reference.
 *
 * Written as a reference rather than a post because its value is being correct
 * and current, and it will need revising as Safaricom documents more.
 *
 * SOURCING RULE FOR THIS PAGE: every factual claim is labelled with where it
 * comes from, because the launch coverage and Safaricom's own portal do not
 * agree. The portal check is mine, dated. Everything attributed to reporting
 * is marked as reporting. Nothing here is a first-hand claim about a
 * post-3.0 go-live, because I have not published one — see the open question.
 */
export default function DarajaThreePage() {
  const path = '/mpesa/daraja-3'

  const graph = darajaThreeGraph(title, description, staticPageDates.modified)

  return (
    <div className="co-wrap co-pillar">
      <StructuredData graph={graph} />

      <header className="co-pillar-head">
        <p className="meta">
          <Link href="/mpesa">M-Pesa</Link> · Reference
        </p>
        <h1>What Daraja 3.0 changed, and what it did not</h1>
        <p className="co-pillar-lede">
          The short version: your existing integration still works. The endpoints did
          not move, the OAuth flow did not change, and the callback payload has the
          same shape. The new surface is genuinely new, and sits beside the old one
          rather than replacing it.
        </p>
      </header>

      <section className="co-scope">
        <h2 className="meta">If you only need one answer</h2>
        <p className="m-0">
          <strong>Nothing in a working Daraja 2.0 integration needs to change.</strong>{' '}
          If something broke recently, Daraja 3.0 is unlikely to be why — start with{' '}
          <Link href="/mpesa/result-codes">the code reference</Link> and{' '}
          <Link href="/blog/mpesa-callback-not-received">
            the reasons callbacks go missing
          </Link>
          .
        </p>
      </section>

      <section className="co-stage">
        <div className="co-stage-head">
          <h2>What did not change</h2>
          <p className="co-detail m-0">
            The useful half, and the half the launch coverage buried.
          </p>
        </div>
        <dl className="co-code-body">
          <dt className="meta">STK Push endpoint</dt>
          <dd>
            <code>/mpesa/stkpush/v1/processrequest</code> — same path.
          </dd>
          <dt className="meta">Authentication</dt>
          <dd>
            <code>/oauth/v1/generate</code>, same base64-encoded key and secret, same
            OAuth2 client-credentials flow.
          </dd>
          <dt className="meta">Callback payload</dt>
          <dd>
            Same structure: <code>Body.stkCallback</code> with{' '}
            <code>MerchantRequestID</code>, <code>CheckoutRequestID</code>,{' '}
            <code>ResultCode</code> and <code>CallbackMetadata</code>. Your existing
            parser is fine.
          </dd>
          <dt className="meta">Backward compatibility</dt>
          <dd>Existing 2.0 integrations run unmodified on the 3.0 platform.</dd>
        </dl>
        <p className="co-detail">
          Source: developer reporting on the 3.0 platform, cross-checked against the
          request shapes in my own integrations, which are unchanged.
        </p>
      </section>

      <section className="co-stage">
        <div className="co-stage-head">
          <h2>What is actually new</h2>
          <p className="co-detail m-0">
            Added surface, not a migration. None of it is required to keep collecting
            payments.
          </p>
        </div>
        <dl className="co-code-body">
          <dt className="meta">Ratiba</dt>
          <dd>
            Recurring and scheduled payments on daily, weekly, monthly and yearly
            cycles. This is the genuinely significant one — Daraja 2.0 had no
            recurring-payment API at all, so every subscription product in Kenya built
            its own scheduler on top of one-off STK pushes.
          </dd>
          <dt className="meta">Security APIs</dt>
          <dd>Fraud detection and identity verification.</dd>
          <dt className="meta">IoT APIs</dt>
          <dd>Payments initiated by connected devices.</dd>
          <dt className="meta">Mini App platform</dt>
          <dd>JavaScript apps running inside the M-Pesa Super App.</dd>
          <dt className="meta">Capacity</dt>
          <dd>
            A claimed ceiling of 12,000 transactions per second on a cloud-native,
            microservices architecture. Reported figure, not something an integrator
            can verify.
          </dd>
        </dl>
        <p className="co-detail">
          Source: launch reporting from November 2025 and developer write-ups since.
          Attributed as reporting — I have not built against Ratiba, and will not
          claim otherwise until I have.
        </p>
      </section>

      <section className="co-stage">
        <div className="co-stage-head">
          <h2>The open question: is go-live really self-service now?</h2>
          <p className="co-detail m-0">The claim I cannot yet confirm or refute.</p>
        </div>
        <p>
          The launch coverage says self-service onboarding has replaced the manual
          approval process — that you can go live without the back-and-forth with
          Safaricom’s integration team.
        </p>
        <p>
          <strong>Safaricom’s own developer portal does not document this.</strong> I
          read it on {staticPageDates.modified}: it presents Daraja 3.0, describes
          creating an account and a sandbox app, and carries testimonials saying
          “going live is a smooth process”. There is no documented self-service
          approval flow, and no production-approval workflow described at all.
        </p>
        <p>
          So the honest position is that this is a reported change rather than a
          documented one. My own account of the old process —{' '}
          <Link href="/blog/mpesa-daraja-production-go-live">
            nineteen days, none of them engineering
          </Link>{' '}
          — describes what it took before. Whether that is now hours depends on
          something I will only know from the next go-live I run.
        </p>
        {/* PLACEHOLDER — supply a first-hand account after the next production
            go-live, then replace this block. Do not write it speculatively. */}
        <p className="co-detail">
          This page will be updated with a first-hand account when I next take a
          client through production approval. Until then it reports the claim and the
          gap, rather than resolving it.
        </p>
      </section>

      <section className="co-stage">
        <div className="co-stage-head">
          <h2>Still unresolved</h2>
          <p className="co-detail m-0">What the upgrade did not fix.</p>
        </div>
        <ul className="co-plain-list">
          <li>
            <strong>The sandbox still cannot simulate failure states.</strong> You
            cannot trigger insufficient funds or a cancelled transaction, which are
            the two paths most worth testing. This is why{' '}
            <Link href="/blog/test-mpesa-callbacks-locally">
              testing callbacks locally
            </Link>{' '}
            still matters, and why a community alternative appeared in early 2026.
          </li>
          <li>
            <strong>The portal now requires 2FA to read the documentation.</strong>{' '}
            Reported, and a real friction for anyone evaluating the API before
            committing to it.
          </li>
          <li>
            <strong>SDK support has not followed.</strong> No significant library
            updates for 3.0 beyond one C# package, as of this review.
          </li>
        </ul>
      </section>

      <section className="co-scope">
        <h2 className="meta">How this page is sourced</h2>
        <p className="m-0">
          Endpoint and payload claims are checked against my own running
          integrations. The new-API list and the capacity figure come from launch
          reporting and are labelled as such. The onboarding section records what
          Safaricom’s portal does and does not say, read on{' '}
          {staticPageDates.modified}. Where I have not done something myself, this
          page says so rather than implying experience it does not have.
        </p>
      </section>
    </div>
  )
}
