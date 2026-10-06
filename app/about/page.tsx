import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import Reveal from '@/components/Reveal'
import StructuredData from '@/components/StructuredData'
import { identity, platforms, primaryPhotograph, profiles, record } from '@/lib/person'
import { aboutGraph } from '@/lib/seo/graph'
import { absoluteUrl, employer, lockAndMercer, site } from '@/lib/site'

/**
 * The canonical biography.
 *
 * The Oct 2026 review found that most of the search traffic reaching this site
 * is someone checking a dated claim about the person — "godwill barasa 2023
 * supervisor software developer", "godwill barasa 2021 full-time bachelor's
 * degree" — and landing at positions 7-16 on pages that could not answer them,
 * because the only dated history on the site was visual text on the homepage.
 *
 * So this page states the facts in order, in plain prose, with the years
 * attached. It is the page a verification search should land on, and the one
 * an AI system should quote when asked who he is.
 *
 * Every fact here comes from lib/person.ts, whose header sets the rule this
 * page inherits: nothing that is not on the verified list. No years of
 * experience, no client counts, no traffic figures, no education, no awards.
 * The review asked for an education line; there is no sourced education fact
 * to write, so the page carries none rather than an invented one.
 */

const DESCRIPTION =
  'Godwill Barasa is a senior software engineer in Nairobi, Kenya. He builds web platforms — SpaceYako, Business Report, Khendo FM and COFEK — and then operates them. A dated record of his work since 2018.'

/*
 * The one title on the site that is not run through the layout template.
 * "About · Godwill Barasa" spends the title tag on the word About. This page
 * exists to rank for the name and the name plus title, so the title tag says
 * both, in the site's middle-dot standard.
 */
const TITLE = `About ${site.name} · ${site.author.jobTitle}, Nairobi`

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    url: absoluteUrl('/about'),
    siteName: site.name,
    title: TITLE,
    description: DESCRIPTION,
    // og:type profile carries its own fields; a bare "profile" is a type
    // claim with nothing behind it.
    type: 'profile',
    firstName: 'Godwill',
    lastName: 'Barasa',
    username: site.author.alternateName[0],
    images: [
      { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteUrl('/opengraph-image')],
    title: TITLE,
    description: DESCRIPTION,
  },
}

/**
 * Joins a list into running prose. The serial comma is not optional here: one
 * of the areas is "Trust and verification systems", so without it the sentence
 * ends "technical SEO and trust and verification systems".
 */
function sentenceList(items: readonly string[]): string {
  const lowered = items.map((a) => `${a.charAt(0).toLowerCase()}${a.slice(1)}`)
  if (lowered.length < 2) return lowered.join('')
  return `${lowered.slice(0, -1).join(', ')}, and ${lowered[lowered.length - 1]}`
}

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <StructuredData graph={aboutGraph(`About ${site.name}`, DESCRIPTION)} />

      <main className="co-wrap">
        {/* ---------- the statement ---------- */}
        <header className="co-about-head">
          <Reveal>
            <p className="meta">
              <span className="meta-accent">About</span>
            </p>
            <h1 className="display mt-4 text-[clamp(2.1rem,5vw,3.6rem)]">{identity.name}</h1>
            <p className="co-about-title meta mt-3">
              {site.author.jobTitle} · Nairobi, Kenya
            </p>
          </Reveal>

          <Reveal>
            <figure className="co-about-portrait">
              <Image
                src={primaryPhotograph.src}
                alt={primaryPhotograph.alt}
                width={720}
                height={900}
                sizes="(min-width: 1024px) 360px, 100vw"
                priority
              />
              <figcaption className="meta meta-faint">{primaryPhotograph.caption}</figcaption>
            </figure>
          </Reveal>
        </header>

        {/* ---------- the biography ---------- */}
        <section className="co-about-body" aria-labelledby="bio-h">
          <h2 id="bio-h" className="sr-only">
            Biography
          </h2>
          <Reveal>
            <div className="prose-body co-about-prose">
              {/* The first paragraph is written to be quoted on its own: name,
                  title, city, employer with year, what he founded, what he
                  built. An AI answering "who is Godwill Barasa" should need
                  nothing past the first full stop of the second sentence. */}
              <p>
                Godwill Barasa is a {site.author.jobTitle.toLowerCase()} based in
                Nairobi, Kenya. Since 2025 he has been {record[0].role} at{' '}
                <a href={employer.url} rel="noopener" target="_blank">
                  {employer.name}
                </a>{' '}
                in {employer.locality}, Virginia, working remotely from Nairobi, and he is
                the founder of{' '}
                <a href={lockAndMercer.url} rel="noopener" target="_blank">
                  Lock&nbsp;&amp;&nbsp;Mercer
                </a>
                , a venture studio in Nairobi where he runs technology. He builds web
                platforms for Kenyan audiences and then stays on to operate them, which
                is the part of the job most of this site is about.
              </p>
              <p>
                Four platforms carry his work. {platforms[0].name} is a property platform
                for Kenya, owned and operated by the studio, where agent standing is
                computed from the expiry date on a practising certificate so a badge
                cannot outlive the credential behind it. {platforms[1].name}, an
                independent Kenyan business publication, he rebuilt as a server-rendered
                newsroom and moved across on a redirect map verified against production.{' '}
                {platforms[2].name}, a radio station across Western Kenya and the North
                Rift, came off WordPress onto a site that reads on-air state from the
                broadcast itself. {platforms[3].name}, the Consumers Federation of Kenya,
                was rebuilt for the connection its readers actually have.
              </p>
              <p>
                Running a platform after launch changes what gets built before it. On
                SpaceYako no money moves between users, which removes escrow and
                deposit disputes from the product entirely. On Business Report the
                migration counted as finished when every indexed URL resolved or
                redirected against the live site — and then certificate renewal lapsed
                after the cutover, so the site looked down from outside while mail was
                up throughout, which moved certificate issuance into the cutover itself
                rather than the week after it.
              </p>
              <p>
                {/* Only the first letter is lowered. A blanket toLowerCase turned
                    "newsroom CMS" into "newsroom cms" and "Technical SEO" into
                    "technical seo", which is the kind of detail this page exists
                    to get right. */}
                The work covers {sentenceList(identity.areas)}.
              </p>
              <p>
                He writes about the engineering underneath, mostly{' '}
                <Link href="/blog/mpesa-daraja-api-nextjs">
                  M-Pesa and Safaricom&rsquo;s Daraja API
                </Link>
                , because in Kenya the payment rail is where platforms break. Those pieces
                are collected in <Link href="/blog">the engineering record</Link>. Shorter studio notes on
                migrations, verification and image pipelines are published at{' '}
                <a href={`${lockAndMercer.url}/notes`} rel="noopener" target="_blank">
                  Lock&nbsp;&amp;&nbsp;Mercer
                </a>
                .
              </p>
              <p>
                His earlier work was at Ogilvy, Belva Digital, Legibra and
                Procter&nbsp;&amp;&nbsp;Gamble, set out with dates below. He works in{' '}
                {[...identity.stack.slice(0, -1)].join(', ')} and{' '}
                {identity.stack[identity.stack.length - 1]}.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---------- the dated record ---------- */}
        <section className="co-about-record" aria-labelledby="rec-h">
          <Reveal>
            <h2 id="rec-h" className="display text-[clamp(1.5rem,3vw,2.2rem)]">
              The record
            </h2>
            <p className="meta meta-faint mt-3">
              Confirmed row by row. Dates are years, which is the precision the record
              establishes.
            </p>
          </Reveal>

          <div className="rule-t mt-7">
            {record.map((row) => (
              <div key={`${row.org}-${row.years}`} className={`co-row${row.current ? ' now' : ''}`}>
                <span className="yr meta">{row.years}</span>
                <span className="org">{row.org}</span>
                <span className="role">{row.role}</span>
                <span className="loc meta">{row.location}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- elsewhere ---------- */}
        <section className="co-about-links" aria-labelledby="el-h">
          <Reveal>
            <h2 id="el-h" className="display text-[clamp(1.5rem,3vw,2.2rem)]">
              Elsewhere
            </h2>
            <p className="meta meta-faint mt-3">
              The same person on other sites. These are the profiles named in this
              site&rsquo;s structured data.
            </p>
            <ul className="co-about-profiles mt-6">
              {profiles.map((p) => (
                <li key={p.href}>
                  <a href={p.href} rel="me noopener" target="_blank">
                    {p.label}
                    <span className="arw" aria-hidden="true">
                      {' '}
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link className="co-btn meta" href="/contact">
                Get in touch <span className="arw">→</span>
              </Link>
            </p>
          </Reveal>
        </section>
      </main>
    </div>
  )
}
