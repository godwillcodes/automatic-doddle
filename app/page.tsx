import type { Metadata } from 'next'
import Link from 'next/link'

import HeroGallery from '@/components/HeroGallery'
import Reveal from '@/components/Reveal'
import { FaqStructuredData } from '@/components/StructuredData'
import { faqs, identity, notes, platforms, profiles } from '@/lib/person'
import { getAllPosts, getNow } from '@/lib/sanity/queries'
import { absoluteUrl, lockAndMercer, site } from '@/lib/site'

/**
 * Falls back to hourly regeneration so a Studio edit reaches the site even if
 * the Sanity webhook at /api/revalidate is not configured.
 */
export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <p className="meta">
      <span className="meta-accent">{number}</span>
      <span aria-hidden="true">{'  /  '}</span>
      {label}
    </p>
  )
}

export default async function Home() {
  const [posts, now] = await Promise.all([getAllPosts(), getNow()])

  const asOf = now
    ? new Date(now.updatedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="bg-paper">
      <FaqStructuredData entries={faqs} />

      {/* Identity. Above the fold, in the initial document. */}
      <section aria-label="Identity" className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="rule-b flex flex-wrap items-baseline justify-between gap-3 py-4">
          <p className="meta">Founder, Lock &amp; Mercer</p>
          <p className="meta">Nairobi, Kenya</p>
        </div>

        <div className="py-[clamp(3rem,9vh,6.5rem)]">
          <h1 className="display text-[clamp(2.6rem,9vw,7rem)] uppercase">
            <span className="block">Godwill</span>
            <span className="block">Barasa</span>
          </h1>

          <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-[clamp(1.15rem,1.8vw,1.5rem)] leading-snug text-ink">
                {identity.h1Line}
              </p>
              <p className="prose-body mt-5">
                {identity.summary} The studio&apos;s side of the record is at{' '}
                <a
                  href={lockAndMercer.teamProfile}
                  rel="me"
                  className="underline decoration-accent decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-accent-lo"
                >
                  lockandmercer.com
                </a>
                .
              </p>
            </div>

            <div className="md:col-span-5 md:justify-self-end">
              <p className="meta mb-2">Stack</p>
              <p className="meta meta-ink max-w-xs leading-relaxed">
                {identity.stack.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        <HeroGallery />

        <div className="rule-t flex flex-wrap items-baseline justify-between gap-3 py-4">
          <p className="meta">Software engineer</p>
          <p className="meta hidden sm:block">Builds platforms, then operates them</p>
          <p className="meta" aria-hidden="true">
            Scroll ↓
          </p>
        </div>
      </section>

      {/* Work, in first person. */}
      <section id="work" aria-label="Work" className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8">
        <div className="sec-head rule-t">
          <Reveal>
            <SectionLabel number="01" label="Work" />
            <h2 className="display mt-4 text-[clamp(1.9rem,4.5vw,3.4rem)]">
              Built here, run here
            </h2>
            <p className="prose-body mt-4">
              Four platforms, owned or rebuilt, all in production. This page carries the
              first-person account: the decisions and what they cost. The full case
              studies live on the studio site.
            </p>
          </Reveal>
        </div>

        {platforms.map((platform) => (
          <Reveal key={platform.name} as="article" className="rule-t py-[clamp(2rem,4vw,3rem)]">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="meta">
                  <span className="meta-accent">Work {platform.index}</span>
                </p>
                <h3 className="display mt-4 text-[clamp(1.7rem,3.5vw,2.6rem)]">
                  {platform.name}
                </h3>
                <p className="meta mt-2">{platform.role}</p>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta meta-ink mt-5 inline-block transition-colors hover:text-accent-lo"
                >
                  {platform.url.replace('https://', '')} →
                </a>
              </div>

              <div className="lg:col-span-8">
                {platform.account.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="prose-body">
                    {paragraph}
                  </p>
                ))}
                <a
                  href={platform.caseStudy}
                  className="meta meta-ink mt-6 inline-block transition-colors hover:text-accent-lo"
                >
                  {platform.caseStudyLabel} <span className="text-accent-lo">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Currently. Rendered only while the entry is fresh. */}
      {now && (
        <section
          id="currently"
          aria-label="Currently"
          className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
        >
          <div className="sec-head rule-t">
            <Reveal>
              <SectionLabel number="02" label={`Currently · as of ${asOf}`} />
              <h2 className="display mt-4 text-[clamp(1.9rem,4.5vw,3.4rem)]">
                In progress
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <ul className="max-w-3xl space-y-4 pb-[clamp(2rem,4vw,3rem)]">
              {now.items.map((item) => (
                <li key={item.slice(0, 32)} className="prose-body flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* Writing: the studio notes, linked, never copied. */}
      <section
        id="writing"
        aria-label="Writing"
        className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
      >
        <div className="sec-head rule-t">
          <Reveal>
            <SectionLabel number="03" label="Writing" />
            <h2 className="display mt-4 text-[clamp(1.9rem,4.5vw,3.4rem)]">Notes</h2>
            <p className="prose-body mt-4">
              Published on the studio site and attributed there. Listed here, linked
              across, never copied.
            </p>
          </Reveal>
        </div>

        <ul>
          {notes.map((note, index) => (
            <Reveal key={note.href} as="li" delay={Math.min(index * 0.03, 0.15)} className="rule-t">
              <a
                href={note.href}
                className="group grid gap-1 py-5 sm:grid-cols-[3.5rem_1fr] sm:items-baseline sm:gap-6"
              >
                <span className="meta meta-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="display block text-[clamp(1.1rem,2vw,1.45rem)] transition-colors group-hover:text-stone">
                    {note.title}
                  </span>
                  <span className="prose-body mt-1 block text-sm">{note.line}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>

        {posts.length > 0 && (
          <Reveal className="rule-t pb-[clamp(2rem,4vw,3rem)] pt-6">
            <p className="prose-body text-sm">
              Longer technical pieces, on payments and performance, are in{' '}
              <Link
                href="/blog"
                className="underline decoration-accent decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-accent-lo"
              >
                the archive on this site
              </Link>
              .
            </p>
          </Reveal>
        )}
      </section>

      {/* FAQ, visible and marked up. */}
      <section aria-label="Questions" className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="sec-head rule-t">
          <Reveal>
            <SectionLabel number="04" label="In brief" />
          </Reveal>
        </div>
        <dl className="grid gap-x-10 gap-y-8 pb-[clamp(2rem,4vw,3rem)] sm:grid-cols-2">
          {faqs.map((faq) => (
            <Reveal key={faq.question}>
              <dt className="meta meta-ink">{faq.question}</dt>
              <dd className="prose-body mt-3 text-[0.95rem]">{faq.answer}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Profiles and contact. */}
      <section id="contact-closing" aria-label="Contact" className="on-ink">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="sec-head rule-t">
            <SectionLabel number="05" label="Contact" />
          </div>

          <Reveal>
            <h2 className="display max-w-4xl text-[clamp(2rem,5vw,4rem)]">
              One address. It reaches me, not a studio inbox.
            </h2>
            <a
              href={`mailto:${site.author.email}`}
              className="display mt-10 inline-block break-all text-[clamp(1.3rem,4vw,2.4rem)] underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent"
            >
              {site.author.email}
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="stack-col mt-12 max-w-xl pb-[clamp(3rem,6vw,5rem)]">
              {profiles.map((profile) => (
                <li key={profile.href}>
                  <span className="meta">{profile.label}</span>
                  <a
                    href={profile.href}
                    {...(profile.me
                      ? { rel: 'me' }
                      : { target: '_blank', rel: 'noopener noreferrer me' })}
                    className="text-right text-sm transition-colors hover:text-accent"
                  >
                    {profile.href.replace('https://', '').replace(/\/$/, '')}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
