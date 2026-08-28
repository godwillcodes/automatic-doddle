import Image from 'next/image'

import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import { contact } from '@/lib/record'

const FACTS = [
  ['Based', 'Nairobi, Kenya'],
  ['Working', 'Remote, across time zones'],
  ['Currently', 'Piedmont Global — Fairfax, VA'],
  ['Also', 'Mentoring · writing · open source'],
]

/**
 * 09 — About. Deliberately restrained: a portrait, the positioning, four
 * facts, three links.
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
    >
      <SectionHead
        number="09"
        label="About"
        title="The person behind the record"
        lede="Nairobi, Kenya. Working remote since 2021."
      />

      <div className="grid gap-10 pb-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <figure className="relative aspect-[4/5] overflow-hidden bg-paper-2">
            <Image
              src="/header-images/1.jpg"
              alt="Godwill Barasa"
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
            />
            <figcaption className="meta absolute bottom-0 left-0 bg-paper px-3 py-2">
              Godwill Barasa, Nairobi
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <h3 className="display text-[clamp(1.6rem,3vw,2.2rem)]">Godwill Barasa</h3>
          <p className="meta mt-2">Senior Web Engineer</p>

          <p className="prose-body mt-6">
            Eight-plus years building, scaling and optimising high-traffic web
            applications, specialising in React, Next.js and experimentation-driven
            product development. The work runs from shaping frontend architecture and
            performance budgets through to measuring impact with Core Web Vitals, funnel
            analytics and continuous experimentation.
          </p>
          <p className="prose-body">
            Comfortable in monorepo-style environments and cross-functional, remote
            teams — standardising frontend tooling, strengthening CI/CD pipelines, and
            improving delivery reliability and quality. Most of it is done alongside
            designers, PMs and customers.
          </p>

          <dl className="stack-col mt-8 max-w-md">
            {FACTS.map(([key, value]) => (
              <li key={key}>
                <dt className="meta">{key}</dt>
                <dd className="text-right text-sm">{value}</dd>
              </li>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-6">
            {[
              ['GitHub', contact.github.href],
              ['LinkedIn', contact.linkedin.href],
              ['Medium', contact.medium.href],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                className="meta meta-ink"
              >
                {label} <span className="text-accent-lo">→</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
