import Reveal from '@/components/Reveal'
import { contact } from '@/lib/record'

const ROWS = [
  ['Telephone', contact.phone, contact.phoneHref],
  ['GitHub', contact.github.label, contact.github.href],
  ['LinkedIn', contact.linkedin.label, contact.linkedin.href],
  ['Writing', contact.medium.label, contact.medium.href],
]

/**
 * 10 — Contact. A closing statement, one address, four rows. No giant form.
 */
export default function ContactClosing() {
  return (
    <section id="contact-closing" aria-labelledby="contact-heading" className="on-ink">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="sec-head rule-t">
          <p className="meta">
            <span className="meta-accent">10</span>
            <span aria-hidden="true">{'  —  '}</span>
            Contact
          </p>
        </div>

        <Reveal>
          <h2 id="contact-heading" className="display max-w-4xl text-[clamp(2.1rem,5.5vw,4.4rem)]">
            Ship, learn, and make better decisions, faster.
          </h2>
          <p className="prose-body mt-6">
            If there is a product that needs to be fast, accessible and measurable — and
            someone to own the architecture, the budget and the evidence — this is the
            address.
          </p>

          <a
            href={`mailto:${contact.email}`}
            className="display mt-10 inline-block break-all text-[clamp(1.3rem,4vw,2.6rem)] underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent"
          >
            {contact.email}
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="stack-col mt-12 max-w-xl pb-[clamp(3rem,6vw,5rem)]">
            {ROWS.map(([key, label, href]) => (
              <li key={key}>
                <span className="meta">{key}</span>
                <a
                  href={href}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="text-right text-sm transition-colors hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
