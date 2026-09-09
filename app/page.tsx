import type { Metadata } from 'next'
import Image from 'next/image'

import HeroGallery from '@/components/HeroGallery'
import Reveal from '@/components/Reveal'
import StructuredData from '@/components/StructuredData'
import WritingSection from '@/components/WritingSection'
import { homeGraph } from '@/lib/seo/graph'
import { faqs, primaryPhotograph, record } from '@/lib/person'
import { getAllPosts } from '@/lib/sanity/queries'
import { absoluteUrl, site } from '@/lib/site'

/**
 * The homepage as an operations room. The claim the whole site makes — he
 * builds platforms and then runs them — is argued by the form before the
 * copy says it: live status chips, a ticking Nairobi clock in the chrome,
 * an operational fact on every card. Design from artifact 5f61e92a.
 */
export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
}

const TICKER = [
  'TypeScript',
  'Node.js',
  'Next.js',
  'PostgreSQL',
  'MySQL',
  'M-Pesa Daraja',
  'Sanity',
  'Docker',
  'CI/CD',
  'WCAG 2.1',
  'Broadcast metadata',
  'Redirect mapping',
  'Performance budgets',
  'Trust systems',
  'Incident response',
  'Technical SEO',
]

interface Platform {
  name: string
  chip: string
  summary: string
  detail: React.ReactNode
  stack: string[]
  url: string
  urlLabel: string
  caseStudy?: { href: string; label: string }
}

const PLATFORMS: Platform[] = [
  {
    name: 'SpaceYako',
    chip: 'Live',
    summary:
      'A property marketplace for Kenya where agents pay to list, seekers never pay, and no money moves between users.',
    detail: (
      <>
        Verification is keyed to the <b>expiry date on an agent&apos;s practising certificate</b> —
        the badge removes itself when the certificate lapses, so nobody has to remember to revoke
        it.
      </>
    ),
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'M-Pesa Daraja'],
    url: 'https://www.spaceyako.com',
    urlLabel: 'spaceyako.com',
    caseStudy: {
      href: 'https://www.lockandmercer.com/ventures/spaceyako',
      label: 'Venture page',
    },
  },
  {
    name: 'Business Report',
    chip: 'Live',
    summary: 'An independent Kenyan business publication, rebuilt as a server-rendered newsroom.',
    detail: (
      <>
        The deliverable on that migration was not the design — it was the{' '}
        <b>verified redirect map</b>. Every legacy URL resolves, so a decade of archive kept its
        search history.
      </>
    ),
    stack: ['Next.js', 'Sanity', 'ISR', 'Redirect mapping'],
    url: 'https://www.businessreport.co.ke',
    urlLabel: 'businessreport.co.ke',
    caseStudy: {
      href: 'https://www.lockandmercer.com/work/business-report',
      label: 'Case study',
    },
  },
  {
    name: 'Khendo FM',
    chip: 'On air',
    summary: 'A radio station broadcasting across Western Kenya and the North Rift.',
    detail: (
      <>
        The site reads <b>on-air state and now-playing from the broadcast itself</b>, so the page
        and the transmitter never disagree about what is happening.
      </>
    ),
    stack: ['Next.js', 'Sanity', 'Stream metadata', 'Edge cache'],
    url: 'https://www.khendofm.co.ke',
    urlLabel: 'khendofm.co.ke',
    caseStudy: { href: 'https://www.lockandmercer.com/work/khendo-fm', label: 'Case study' },
  },
  {
    name: 'COFEK',
    chip: 'Live',
    summary:
      'The Consumers Federation of Kenya — a rebuild for an audience that arrives on whatever connection it has.',
    detail: (
      <>
        Performance budget set against <b>the connection people actually have</b>, not the one the
        office wifi shows. Weight measured on 3G, not on a Lighthouse run.
      </>
    ),
    stack: ['Next.js', 'Sanity', 'Performance budgets', 'WCAG 2.1'],
    url: 'https://cofek.africa',
    urlLabel: 'cofek.africa',
    caseStudy: { href: 'https://www.lockandmercer.com/work/cofek', label: 'Case study' },
  },
]

function SectionHead({
  number,
  title,
  note,
}: {
  number: string
  title: string
  note: string
}) {
  return (
    <div className="co-sec-head">
      <span className="meta meta-accent">{number}</span>
      <h2>{title}</h2>
      <p className="co-sec-note">{note}</p>
    </div>
  )
}

export default async function Home() {
  const posts = await getAllPosts()
  const featured = [...posts]
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      readingTime: p.readingTime,
      category: p.category.title,
    }))

  const tickerRow = (
    <>
      {TICKER.map((t) => (
        <span key={t}>
          {t} <i>/</i>
        </span>
      ))}
    </>
  )

  return (
    <>
      <StructuredData graph={homeGraph(faqs)} />

      <div className="co-wrap">
        {/* ---------- hero ---------- */}
        <section className="pt-[clamp(44px,6vw,76px)] pb-[clamp(30px,4vw,52px)]">
          <div className="grid items-center gap-[clamp(24px,3vw,44px)] md:grid-cols-2">
            <div>
              <div className="meta mb-5 flex flex-wrap items-center gap-3">
                <span>Senior Software Engineer</span>
                <span aria-hidden="true" className="h-px w-5 bg-rule-dk" />
                <span>Piedmont Global</span>
                <span aria-hidden="true" className="h-px w-5 bg-rule-dk" />
                <strong className="meta-accent font-medium">Nairobi, Kenya</strong>
              </div>

              <h1 className="co-namemark mb-6">
                <span className="ln">Godwill</span>
                <span className="ln">Barasa</span>
              </h1>

              <p className="co-thesis mb-5">
                I build web platforms in Kenya — and then I <em>run</em> them.
              </p>
              <p className="prose-body mb-4">
                Most engineers hand a repository over and leave. I stay on the pager. Everything
                below is in production right now, on infrastructure I still own the incidents for.
              </p>
              <p className="prose-body">
                Senior Engineer on the web platform at{' '}
                <a className="co-inline" href="#record">
                  Piedmont Global
                </a>
                , and founder of{' '}
                <a
                  className="co-inline"
                  href="https://www.lockandmercer.com"
                  rel="noopener"
                  target="_blank"
                >
                  Lock&nbsp;&amp;&nbsp;Mercer
                </a>
                , the Nairobi studio behind SpaceYako. TypeScript and Node across the stack;
                Postgres and MySQL underneath; M-Pesa, broadcast feeds and low-bandwidth Kenya as
                the constraints that actually shape the work.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <a className="co-btn primary meta" href="#operating">
                  See what is running <span className="arw">→</span>
                </a>
                <a className="co-btn meta" href={`mailto:${site.author.email}`}>
                  Email me <span className="arw">→</span>
                </a>
              </div>
            </div>

            <Reveal>
              <div className="co-telemetry">
                <div className="co-tel-top meta">
                  <span>Status</span>
                  <span className="co-tel-live">
                    <span className="co-dot" aria-hidden="true" /> All systems nominal
                  </span>
                </div>
                <div className="co-portrait">
                  <Image
                    src={primaryPhotograph.src}
                    alt={primaryPhotograph.alt}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    priority
                  />
                </div>
                <dl className="meta m-0">
                  <div className="co-tel-row">
                    <dt>Platforms live</dt>
                    <dd className="accent">4</dd>
                  </div>
                  <div className="co-tel-row">
                    <dt>Pieces published</dt>
                    <dd>{posts.length}</dd>
                  </div>
                  <div className="co-tel-row">
                    <dt>Shipping since</dt>
                    <dd>2018</dd>
                  </div>
                  <div className="co-tel-row">
                    <dt>Primary stack</dt>
                    <dd>TypeScript · Node</dd>
                  </div>
                  <div className="co-tel-row">
                    <dt>Availability</dt>
                    <dd>Selective</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ---------- ticker ---------- */}
      <div className="co-ticker" aria-hidden="true">
        <div className="co-ticker-track meta">
          {tickerRow}
          {tickerRow}
        </div>
      </div>

      <div className="co-wrap">
        {/* ---------- 01 operating ---------- */}
        <section className="co-section" id="operating">
          <SectionHead
            number="01"
            title="Operating"
            note="Four platforms in production. Live domains, not case-study screenshots."
          />
          <div className="grid gap-[clamp(14px,1.6vw,20px)] md:grid-cols-2">
            {PLATFORMS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06} as="article">
                <div className="co-card h-full gap-4">
                  <div className="flex items-start justify-between gap-3.5">
                    <h3>{p.name}</h3>
                    <span className="co-chip live meta">
                      <span className="co-dot" aria-hidden="true" /> {p.chip}
                    </span>
                  </div>
                  <p className="m-0 text-[16px] text-stone">{p.summary}</p>
                  <p className="co-detail">{p.detail}</p>
                  <div className="co-stack meta">
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                    <a className="co-lnk meta" href={p.url} rel="noopener" target="_blank">
                      {p.urlLabel} <span className="arw">↗</span>
                    </a>
                    {p.caseStudy ? (
                      <a
                        className="co-lnk muted meta"
                        href={p.caseStudy.href}
                        rel="noopener"
                        target="_blank"
                      >
                        {p.caseStudy.label} <span className="arw">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 02 writing ---------- */}
        <section className="co-section" id="writing">
          <SectionHead
            number="02"
            title="Writing"
            note="Two publications, two treatments. Solid cards are mine. Dashed cards are studio notes that live on Lock & Mercer."
          />
          <WritingSection posts={featured} total={posts.length} />
        </section>

        {/* ---------- 03 record ---------- */}
        <section className="co-section" id="record">
          <SectionHead
            number="03"
            title="Record"
            note="Eight years of production work, agency through platform engineering."
          />
          <div className="rule-t">
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

        {/* ---------- 04 photographs ---------- */}
        <section className="co-section" id="photographs">
          <SectionHead
            number="04"
            title="Photographs"
            note="The person behind the pager. Colour returns on hover."
          />
          <HeroGallery />
        </section>

        {/* ---------- 05 questions ---------- */}
        <section className="co-section" id="questions">
          <SectionHead
            number="05"
            title="Questions"
            note="Short answers to the things people actually search."
          />
          <div className="max-w-[70ch]">
            {faqs.map((faq) => (
              <details key={faq.question} className="rule-t py-4">
                <summary className="flex items-baseline justify-between gap-4">
                  <span className="font-sans text-[17px] font-medium text-ink">
                    {faq.question}
                  </span>
                  <span className="disc-mark meta meta-accent" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="disclosure-body">
                  <div>
                    <p className="prose-body pt-3">{faq.answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
