import Reveal from '@/components/Reveal'

const DISCIPLINES = ['Web Engineering', 'Frontend Architecture', 'Performance', 'Product']

/**
 * 01 — Opening frame. The cover of the monograph: metadata band, the name at
 * page scale, the positioning line, and a baseline of orientation facts.
 */
export default function HeroCover() {
  const volume = new Date().getFullYear()

  return (
    <section aria-label="Introduction" className="mx-auto max-w-7xl px-6 sm:px-8">
      <div className="rule-b flex flex-wrap items-baseline justify-between gap-3 py-4">
        <p className="meta">
          Portfolio <span aria-hidden="true">/</span> Vol. 01{' '}
          <span aria-hidden="true">/</span> {volume}
        </p>
        <p className="meta">Nairobi / Remote</p>
      </div>

      <div className="py-[clamp(3rem,9vh,7rem)]">
        <Reveal>
          <h1 className="display text-[clamp(3.4rem,14vw,11.5rem)] uppercase">
            <span className="block">Godwill</span>
            <span className="block">Barasa</span>
          </h1>
        </Reveal>

        <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-8 md:grid-cols-12">
          <Reveal delay={0.1} className="md:col-span-7">
            <p className="prose-body text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug">
              Senior Web Engineer building, scaling and optimising high-traffic web
              applications — <strong>high-performance, accessible, measurable</strong>{' '}
              digital products.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="md:col-span-5 md:justify-self-end">
            <ul className="space-y-1.5">
              {DISCIPLINES.map((discipline) => (
                <li key={discipline} className="meta meta-ink">
                  {discipline}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="rule-t flex flex-wrap items-baseline justify-between gap-3 py-4">
        <p className="meta">Since 2018 — 8+ years</p>
        <p className="meta hidden sm:block">Currently — Senior Web Engineer, Piedmont Global</p>
        <p className="meta" aria-hidden="true">
          Scroll ↓
        </p>
      </div>
    </section>
  )
}
