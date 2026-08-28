import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import { instruments } from '@/lib/record'
import VitalsInstrument from './VitalsInstrument'

/**
 * 07 — Laboratory. Work made outside a client brief, presented as specimens
 * with spec sheets — plus the page measuring itself as the closing exhibit.
 */
export default function Laboratory() {
  return (
    <section
      id="lab"
      aria-labelledby="lab-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
    >
      <SectionHead
        number="07"
        label="Laboratory"
        title="Open source & instruments"
        lede="Work made outside a client brief. Both are measurement tools; both are published under an open licence."
      />

      <div className="grid gap-10 pb-12 lg:grid-cols-2">
        {instruments.map((instrument, index) => (
          <Reveal key={instrument.name} as="article" delay={index * 0.08} className="rule-t pt-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="display text-[clamp(1.5rem,3vw,2.1rem)]">{instrument.name}</h3>
              <p className="meta meta-accent">{instrument.spec}</p>
            </div>

            <p className="prose-body mt-5">{instrument.summary}</p>

            <ul className="stack-col mt-6">
              {instrument.facts.map((fact) => (
                <li key={fact.key}>
                  <span className="meta">{fact.key}</span>
                  <span className="text-right text-sm">{fact.value}</span>
                </li>
              ))}
            </ul>

            <a
              href={instrument.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="meta meta-ink mt-6 inline-block"
            >
              Repository <span className="text-accent-lo">→</span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="pb-[clamp(2.5rem,5vw,4rem)]">
        <VitalsInstrument />
      </Reveal>
    </section>
  )
}
