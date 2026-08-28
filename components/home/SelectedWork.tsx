import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import { instruments } from '@/lib/record'
import { DeliverySlope, QualitySearch, MeasurementPaths } from './figures'

function WorkMeta({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
      {items.map((item, index) => (
        <span key={item} className={`meta ${index === 0 ? 'meta-ink' : ''}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

function Framework({
  entries,
}: {
  entries: { key: string; body: React.ReactNode }[]
}) {
  return (
    <dl className="space-y-5">
      {entries.map((entry) => (
        <div key={entry.key} className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
          <dt className="meta pt-1">{entry.key}</dt>
          <dd className="prose-body">{entry.body}</dd>
        </div>
      ))}
    </dl>
  )
}

function FigureFrame({
  caption,
  children,
}: {
  caption: string
  children: React.ReactNode
}) {
  return (
    <figure className="rule-t rule-b bg-paper-2/40 px-5 py-6">
      {children}
      <figcaption className="meta mt-4">{caption}</figcaption>
    </figure>
  )
}

/**
 * 03 — Selected work. Four engagements examined as case studies:
 * Problem → Intervention → Engineering → Outcome, with evidence only where
 * evidence already exists.
 */
export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8">
      <SectionHead
        number="03"
        label="Selected work"
        title="Four engagements, examined"
        lede="Two client platforms. Two open-source instruments. Evidence where evidence exists."
      />

      {/* Work 01 — Piedmont Global */}
      <article aria-label="Piedmont Global" className="rule-t py-[clamp(2rem,4vw,3.5rem)]">
        <Reveal>
          <WorkMeta items={['Work 01', '2025 — Present', 'Fairfax, VA', 'Remote']} />
          <h3 className="display mt-6 text-[clamp(1.8rem,4vw,3rem)]">Piedmont Global</h3>
          <p className="meta mt-2">
            Senior Web Engineer (Marketing) · Public-facing marketing properties
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal delay={0.06} className="lg:col-span-7">
            <Framework
              entries={[
                {
                  key: 'Mandate',
                  body: "Lead React and Next.js development across the company's public-facing marketing properties.",
                },
                {
                  key: 'Intervention',
                  body: (
                    <>
                      Introduce standardised <strong>performance budgets</strong>, shared
                      component libraries and build optimisations — code splitting,
                      memoization, lazy loading — rather than tuning pages one at a time.
                    </>
                  ),
                },
                {
                  key: 'Engineering',
                  body: 'Refined GitHub Actions CI/CD with engineering and DevOps: automated builds, Jest suites, and a preview deployment per branch. Owned Google Tag Manager, GA4 and Meta Pixel — key funnels and events instrumented, tracking scripts loaded in a performance-conscious way. Wrote the internal guidelines for SEO, accessibility, performance and shared tooling.',
                },
                {
                  key: 'Outcome',
                  body: (
                    <>
                      Improved Core Web Vitals, lower time-to-merge, regressions caught
                      earlier — and roughly <strong>40% gains</strong> in page speed and
                      accessibility scores on key routes.
                    </>
                  ),
                },
              ]}
            />
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <FigureFrame caption="Fig. 01 — Reported outcome, Piedmont Global">
              <p className="numeral text-[clamp(4rem,9vw,7rem)]">
                ~40<span className="text-stone">%</span>
              </p>
              <p className="meta meta-ink mt-4">Page speed &amp; accessibility gains</p>
              <p className="prose-body mt-2 text-sm">
                Measured on key routes after performance budgets, shared components and
                build optimisation were standardised.
              </p>
            </FigureFrame>
          </Reveal>
        </div>
      </article>

      {/* Work 02 — Ogilvy Africa */}
      <article aria-label="Ogilvy Africa" className="rule-t py-[clamp(2rem,4vw,3.5rem)]">
        <Reveal>
          <WorkMeta items={['Work 02', '2024 — 2025', 'Nairobi, Kenya', 'Remote']} />
          <h3 className="display mt-6 text-[clamp(1.8rem,4vw,3rem)]">Ogilvy Africa</h3>
          <p className="meta mt-2">Staff Frontend Engineer · Multi-project frontend platform</p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal delay={0.06} className="lg:col-span-5 lg:order-1">
            <FigureFrame caption="Two observations, not a trend line. Reported before/after values only.">
              <p className="meta mb-4">Fig. 02 — On-time delivery, before and after standardisation</p>
              <DeliverySlope />
            </FigureFrame>
          </Reveal>

          <Reveal delay={0.12} className="lg:order-2 lg:col-span-7">
            <Framework
              entries={[
                {
                  key: 'Mandate',
                  body: 'Lead a distributed engineering team building and operating multiple client-facing React/Next.js and WordPress properties in a multi-project, monorepo-style setup.',
                },
                {
                  key: 'Intervention',
                  body: 'Define and enforce standardised frontend tooling — shared ESLint and Prettier configs, component patterns, TailwindCSS conventions — plus performance budgets applied across every project rather than per-campaign.',
                },
                {
                  key: 'Engineering',
                  body: 'Ran A/B tests on landing pages and funnels with product and marketing, using feature flags and analytics to read search performance, user behaviour and conversion impact. Acted as the frontend platform contact — unblocking engineers on build issues, deployment workflows and shared tooling across time zones.',
                },
                {
                  key: 'Outcome',
                  body: (
                    <>
                      <strong>15+</strong> features and campaigns shipped per quarter ·
                      on-time delivery <strong>70% → 95%</strong> · production defects{' '}
                      <strong>−30%</strong> · average page load <strong>−35%</strong> ·
                      handoff delays <strong>−40%</strong>.
                    </>
                  ),
                },
              ]}
            />
          </Reveal>
        </div>
      </article>

      {/* Work 03 — PixelPress */}
      <article aria-label="PixelPress" className="rule-t py-[clamp(2rem,4vw,3.5rem)]">
        <Reveal>
          <WorkMeta items={['Work 03', 'Open source', 'MIT · TypeScript']} />
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="display text-[clamp(1.8rem,4vw,3rem)]">PixelPress</h3>
            <a
              href={instruments[0].repo}
              target="_blank"
              rel="noopener noreferrer"
              className="meta meta-accent"
            >
              Repository →
            </a>
          </div>
          <p className="meta mt-2">
            Image compression &amp; conversion utility · Next.js, Sharp, TypeScript
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal delay={0.06} className="lg:col-span-6">
            <p className="prose-body text-lg">
              A compressor that searches for the smallest file a given image can survive
              being — instead of guessing at a quality number.
            </p>
            <p className="prose-body">
              Sharp exposes quality as a dial from 1 to 100. Turning it by hand is a
              blind trade between bytes and visible damage. PixelPress makes that a{' '}
              <strong>search problem</strong>: binary search across the quality range with
              tolerance-based convergence, parallel quality probes, and progressive
              dimension scaling when quality alone cannot reach the target.
            </p>
            <ul className="stack-col mt-6 max-w-md">
              {[
                ['Output formats', 'WebP · AVIF'],
                ['Delivery', 'Installable PWA, offline'],
                ['Licence', 'MIT'],
              ].map(([key, value]) => (
                <li key={key}>
                  <span className="meta">{key}</span>
                  <span className="text-sm">{value}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-6">
            <FigureFrame caption="Schematic of the documented algorithm, not a captured run.">
              <p className="meta mb-4">Fig. 03 — Quality search, interval narrowing</p>
              <QualitySearch />
            </FigureFrame>
          </Reveal>
        </div>
      </article>

      {/* Work 04 — Site Performance Tracker */}
      <article
        aria-label="Site Performance Tracker"
        className="rule-t py-[clamp(2rem,4vw,3.5rem)]"
      >
        <Reveal>
          <WorkMeta items={['Work 04', 'Open source', 'GPLv2+ · PHP']} />
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="display text-[clamp(1.8rem,4vw,3rem)]">Site Performance Tracker</h3>
            <a
              href={instruments[1].repo}
              target="_blank"
              rel="noopener noreferrer"
              className="meta meta-accent"
            >
              Repository →
            </a>
          </div>
          <p className="meta mt-2">WordPress performance monitoring · PHP 8, PageSpeed Insights API</p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal delay={0.06} className="lg:col-span-6">
            <FigureFrame caption="Architecture as documented in the repository README.">
              <p className="meta mb-4">Fig. 04 — Two measurement paths, one store</p>
              <MeasurementPaths />
            </FigureFrame>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-6">
            <p className="prose-body text-lg">
              Lab data tells you what a page can do. Field data tells you what it did.
              The plugin collects both and keeps them in the same place.
            </p>
            <p className="prose-body">
              Synthetic audits run against the Google PageSpeed Insights API for desktop
              and mobile; real-user monitoring collects LCP, CLS, FID, FCP and TTFB from
              actual visitors. The worker is plain PHP — <strong>no Node.js
              dependency</strong> — so it installs on ordinary WordPress hosting,
              processes queued audits asynchronously, and recovers stuck jobs.
            </p>
            <ul className="stack-col mt-6 max-w-md">
              {[
                ['Requires', 'WordPress 6.0+ · PHP 8.0+'],
                ['Version', '1.0.0 (2024)'],
                ['Access', 'Admin UI · REST · WP-CLI'],
                ['Export', 'CSV · HTML report'],
              ].map(([key, value]) => (
                <li key={key}>
                  <span className="meta">{key}</span>
                  <span className="text-sm">{value}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </article>

      {/* Also in the record */}
      <div className="rule-t py-10">
        <Reveal>
          <p className="meta mb-6">Also in the record</p>
          <ul>
            {[
              ['Belva Digital Agency', 'Fullstack Engineer · 2021 — 2024 · React, Next.js, Laravel'],
              ['Legibra Agency', 'Mobile Engineer · 2019 — 2021 · React Native, Python'],
              ['Procter & Gamble', 'Web Engineer, Intern · 2018 · Brand microsites'],
            ].map(([company, detail]) => (
              <li key={company} className="rule-t">
                <a
                  href="#experience"
                  className="group flex flex-wrap items-baseline justify-between gap-2 py-4"
                >
                  <span className="display text-lg">{company}</span>
                  <span className="meta transition-colors group-hover:text-ink">
                    {detail} →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
