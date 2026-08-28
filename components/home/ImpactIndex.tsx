import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import { metrics } from '@/lib/record'

/**
 * 05 — Impact index. Figures at page scale, each attributed to the engagement
 * it came from. An engineering report, not a marketing statistics band.
 */
export default function ImpactIndex() {
  return (
    <section aria-labelledby="impact-heading" className="on-ink">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          number="05"
          label="Impact index"
          title="Numbers, with their context attached"
          lede="Each figure is attributed to the engagement it came from. Nothing here is aggregated across roles."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <Reveal
              key={metric.title}
              as="article"
              delay={(index % 3) * 0.07}
              className="rule-t px-1 py-10 sm:px-6 lg:[&:nth-child(3n+1)]:pl-0"
            >
              <p className="numeral text-[clamp(3.2rem,6vw,4.8rem)]">{metric.figure}</p>
              <h3 className="meta meta-ink mt-5">{metric.title}</h3>
              <p className="prose-body mt-3 text-sm">{metric.context}</p>
              <p className="meta meta-accent mt-4">{metric.attribution}</p>
            </Reveal>
          ))}
        </div>

        <p className="meta rule-t max-w-2xl py-8">
          Note — figures as recorded by Godwill for the engagements named. Where a
          measurement is approximate it is written as such.
        </p>
      </div>
    </section>
  )
}
