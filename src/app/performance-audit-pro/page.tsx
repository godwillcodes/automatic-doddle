import Image from 'next/image'

import dynamic from 'next/dynamic'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { generatePageMetadata } from '@/lib/metadata'

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
      Loading contact form...
    </div>
  ),
})
export const metadata = generatePageMetadata(
  'Performance Audit Pro',
  'A governance-grade WordPress plugin that unifies Google PageSpeed Insights audits, Core Web Vitals RUM, and executive-ready reporting without leaving wp-admin.',
  '/performance-audit-pro',
  ['Performance Audit Pro', 'WordPress performance plugin', 'Core Web Vitals monitoring']
)

const featureCards = [
  {
    title: 'Automated PageSpeed audits',
    description:
      'Schedule or trigger PSI desktop + mobile runs directly in wp-admin. Every audit is archived with device context, throttling profile, and deltas.'
  },
  {
    title: 'Core Web Vitals RUM',
    description:
      'Collect LCP, CLS, FID, FCP, and TTFB from actual visitors, bucket them per template, and compare against synthetic data to spot regressions early.'
  },
  {
    title: 'Dashboards & scorecards',
    description:
      'Executive-ready scorecards, distribution charts, and trend lines so leaders never leave WordPress to understand performance health.'
  },
  {
    title: 'Background worker automation',
    description:
      'A PHP worker queues audits, retries failures, unsticks jobs, and supports manual “process now” triggers—no external cron required.'
  },
  {
    title: 'Performance budgets & alerts',
    description:
      'Set thresholds per metric, notify teams when budgets break, and gate releases with real-time pass/fail signals.'
  },
  {
    title: 'Curated exports & REST API',
    description:
      'Ship branded CSV/HTML reports to stakeholders and feed the data into other systems through a locked-down REST API.'
  }
]

const stats = [
  { label: 'Audits processed', value: '10k+' },
  { label: 'Templates monitored', value: '250+' },
  { label: 'Budget policies', value: '50+' }
]

const engineeringRigor = [
  'Prepared + sanitized DB queries, capability checks, and nonce validation on every action.',
  'Dashboards powered by wp_cache and async hydration for sub-second renders.',
  'Logging only when WP_DEBUG is enabled—zero production noise.',
  'Architecture follows WordPress.org guidelines, making reviews and releases painless.'
]

const idealTeams = [
  'Product orgs chasing OKRs tied to Core Web Vitals and conversion rates.',
  'Agencies running “performance care” retainers who need recurring, branded reports.',
  'In-house site owners who want exec-friendly visibility without duct-taping five tools.'
]

const productShots = [
  {
    src: '/images/performance-audit-pro/product-shot-1.png',
    alt: 'Performance Audit Pro scorecard and worker controls',
    caption: 'Synthetic scorecards + fully automated worker controls keep audits flowing without leaving wp-admin.'
  },
  {
    src: '/images/performance-audit-pro/product-shot-2.png',
    alt: 'Performance Audit Pro dashboards with Core Web Vitals',
    caption: 'Dashboards merge PageSpeed Insights trends with Core Web Vitals for real-time visibility.'
  }
]

function ProductBanner() {
  return (
    <div className="border-b border-zinc-100 bg-gradient-to-r from-teal-50 via-white to-blue-50 dark:border-zinc-800 dark:from-teal-900/20 dark:via-transparent dark:to-blue-900/20">
      <Container className="py-4 text-sm mt-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            Performance Audit Pro is available today for WordPress teams who crave better visibility.
          </p>
          <Button
            variant="secondary"
            href="https://github.com/godwillcodes/WPSitePerformanceTracker"
            target="_blank"
            rel="noreferrer"
          >
            View product repo
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default function PerformanceAuditProPage() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }
        .fadeInUp-delay-1 { animation-delay: 0.3s; }
        .fadeInUp-delay-2 { animation-delay: 0.6s; }
        .fadeInUp-delay-3 { animation-delay: 0.9s; }
      `}</style>

      <ProductBanner />

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/60 to-white dark:from-zinc-950 dark:via-teal-950/20 dark:to-zinc-950">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-400/10" />
        </div>
        <Container className="relative z-10 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center fadeInUp">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-600 shadow-sm dark:border-teal-500/30 dark:bg-white/5 dark:text-teal-300">
              WordPress performance governance
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              One pane of glass for PageSpeed + Core Web Vitals inside WordPress.
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
              Performance Audit Pro bridges lab-based audits and real user monitoring without breaking your publishing flow. Detect regressions
              early, align leadership with the same dashboards, and keep engineering rigor baked into wp-admin.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="mailto:godwill.codes@gmail.com?subject=Performance%20Audit%20Pro%20Demo" className="fadeInUp-delay-1">
                Request a demo
              </Button>
              <Button
                variant="secondary"
                href="https://cal.com/godwillcodes/consult"
                target="_blank"
                rel="noreferrer"
                className="fadeInUp-delay-2"
              >
                Partner consultation
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-teal-500/5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 fadeInUp fadeInUp-delay-3">
            <div className="grid gap-4 text-center sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-zinc-100/60 bg-white/60 p-4 dark:border-white/5 dark:bg-white/5">
                  <p className="text-3xl font-semibold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32 fadeInUp">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-300">Product shots</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Performance visibility without leaving WordPress</h2>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              Built-in scorecards, queue orchestration, and Core Web Vitals dashboards make it easy to answer executive questions instantly.
            </p>
          </div>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {productShots.map((shot) => (
              <div key={shot.alt} className="group space-y-4 rounded-3xl border border-zinc-100 bg-white/80 p-2 shadow-xl shadow-zinc-900/5 transition-transform hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/60 fadeInUp">
                <div className="overflow-hidden rounded-3xl">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1440}
                    height={900}
                    className="rounded-2xl object-cover"
                    priority
                  />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{shot.caption}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32 fadeInUp">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Why teams install Performance Audit Pro</h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              It closes the loop for teams who need to correlate lab audits with real user behavior and share the story with leadership—without
              leaving WordPress.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Card
                key={feature.title}
                className="rounded-3xl border border-zinc-100 bg-white/90 p-6 shadow-sm shadow-zinc-800/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 fadeInUp"
              >
                <div className="mb-4 h-10 w-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
                  <div className="flex h-full items-center justify-center text-base font-semibold">↗</div>
                </div>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Description>{feature.description}</Card.Description>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      


      {/* Contact Form Section */}
      <section className="pb-24 fadeInUp">
        <Container className="relative overflow-hidden rounded-[36px] border border-zinc-100 bg-white/90 p-10 shadow-2xl shadow-teal-500/10 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-transparent to-blue-100 opacity-70 dark:from-teal-900/20 dark:via-transparent dark:to-blue-900/10" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h3 className="mb-6 text-center text-3xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-4xl">
              Contact Us
            </h3>
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  )
}
