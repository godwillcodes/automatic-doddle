import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import { progression, roles } from '@/lib/record'

/**
 * 04 — Chronology. Headline first, detail on request: each role is a native
 * <details> disclosure, so the timeline reads at a glance and expands without
 * JavaScript.
 */
export default function Chronology() {
  return (
    <section
      id="experience"
      aria-labelledby="chronology-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
    >
      <SectionHead
        number="04"
        label="Chronology"
        title="Eight years, five rooms"
        lede="Headline first. Detail on request."
      />

      <Reveal>
        <p className="meta flex flex-wrap items-baseline gap-x-2 gap-y-1 pb-8">
          {progression.map((step, index) => (
            <span key={step} className={index === progression.length - 1 ? 'meta-ink' : ''}>
              {step}
              {index < progression.length - 1 ? <span aria-hidden="true"> →</span> : null}
            </span>
          ))}
        </p>
      </Reveal>

      <div>
        {roles.map((role, index) => (
          <Reveal key={role.company} delay={index * 0.04}>
            <details className="group rule-t" open={index === 0}>
              <summary className="grid gap-2 py-6 sm:grid-cols-[8.5rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="meta meta-accent">{role.period}</span>
                <span>
                  <span className="display block text-[clamp(1.35rem,2.6vw,1.9rem)]">
                    {role.company}
                  </span>
                  <span className="meta mt-1 block">
                    {role.title} · {role.location}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="disc-mark display hidden text-2xl text-stone sm:block"
                >
                  +
                </span>
              </summary>
              <div className="disclosure-body">
                <div>
                  <ul className="max-w-3xl space-y-4 pb-8 sm:pl-[calc(8.5rem+1.5rem)]">
                    {role.bullets.map((bullet) => (
                      <li key={bullet.slice(0, 40)} className="prose-body flex gap-4 text-[0.95rem]">
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
