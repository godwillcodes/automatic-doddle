import Reveal from '@/components/Reveal'

/**
 * 02 — The engineering thesis. Philosophy before credentials. Every line is
 * drawn from the existing positioning; nothing here is a new claim.
 */
export default function Thesis() {
  return (
    <section aria-labelledby="thesis-heading" className="mx-auto max-w-7xl px-6 sm:px-8">
      <div className="sec-head rule-t">
        <p className="meta">
          <span className="meta-accent">02</span>
          <span aria-hidden="true">{'  —  '}</span>
          Thesis
        </p>
      </div>

      <Reveal>
        <h2
          id="thesis-heading"
          className="display max-w-5xl text-[clamp(2.1rem,5.5vw,4.4rem)]"
        >
          <span className="block">Ship beautifully crafted interfaces.</span>
          <span className="block text-stone">Engineer to a performance budget.</span>
          <span className="block">Measure what actually changed.</span>
        </h2>
      </Reveal>

      <div className="grid gap-10 py-[clamp(2.5rem,5vw,4rem)] md:grid-cols-12">
        <Reveal className="md:col-span-2">
          <p className="meta">Position</p>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-5">
          <p className="prose-body">
            Eight-plus years building, scaling and optimising high-traffic web
            applications, specialising in <strong>React</strong>,{' '}
            <strong>Next.js</strong> and experimentation-driven product development.
          </p>
          <p className="prose-body">
            Focused on turning ambiguous ideas into production-ready, user-centric
            experiences — from shaping frontend architecture and performance budgets to
            measuring impact through Core Web Vitals, funnel analytics and continuous
            experimentation.
          </p>
        </Reveal>
        <Reveal delay={0.14} className="md:col-span-5">
          <p className="prose-body">
            Comfortable operating in monorepo-style environments and cross-functional,
            remote teams, with a track record of standardising frontend tooling,
            strengthening CI/CD pipelines, and improving delivery reliability and
            quality.
          </p>
          <p className="prose-body">
            Collaborating directly with designers, PMs and customers, and iterating
            quickly so teams can ship, learn, and make better decisions,{' '}
            <strong>faster</strong>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
