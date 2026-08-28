'use client'

import { useState } from 'react'

import { contact } from '@/lib/record'

const FIELD =
  'w-full border-0 rule-b bg-transparent py-3 text-base text-ink placeholder:text-stone/60 focus:outline-none focus-visible:outline-none'

/**
 * The contact page: the closing statement first, the form as the quiet
 * secondary path. Submissions persist to Sanity via /api/contact; email
 * notification is additive.
 */
export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: 'contact', ...formData }),
      })
      if (!response.ok) throw new Error('submission failed')
      setStatus('sent')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section aria-labelledby="contact-heading" className="mx-auto max-w-7xl px-6 sm:px-8">
      <div className="sec-head rule-t">
        <p className="meta">
          <span className="meta-accent">Contact</span>
        </p>
      </div>

      <h1 id="contact-heading" className="display max-w-4xl text-[clamp(2.1rem,5.5vw,4.4rem)]">
        Ship, learn, and make better decisions, faster.
      </h1>
      <p className="prose-body mt-6">
        If there is a product that needs to be fast, accessible and measurable — and
        someone to own the architecture, the budget and the evidence — this is the
        address.
      </p>

      <a
        href={`mailto:${contact.email}`}
        className="display mt-8 inline-block break-all text-[clamp(1.3rem,4vw,2.4rem)] underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent-lo"
      >
        {contact.email}
      </a>

      <div className="mt-14 grid gap-12 pb-[clamp(3rem,6vw,5rem)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ul className="stack-col max-w-md">
            {[
              ['Telephone', contact.phone, contact.phoneHref],
              ['GitHub', contact.github.label, contact.github.href],
              ['LinkedIn', contact.linkedin.label, contact.linkedin.href],
              ['Writing', contact.medium.label, contact.medium.href],
            ].map(([key, label, href]) => (
              <li key={key}>
                <span className="meta">{key}</span>
                <a
                  href={href}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="text-right text-sm transition-colors hover:text-accent-lo"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <p className="meta mb-6">Or write here</p>

          {status === 'sent' ? (
            <div className="rule-t rule-b py-10" role="status">
              <p className="display text-xl">Received.</p>
              <p className="prose-body mt-2 text-sm">
                Your message is in. Expect a reply at the address you gave.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
              {/* Honeypot: hidden from people, tempting to bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div>
                <label htmlFor="contact-name" className="meta">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={status === 'sending'}
                  className={FIELD}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="meta">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={status === 'sending'}
                  className={FIELD}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="meta">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={status === 'sending'}
                  className={`${FIELD} resize-y`}
                  placeholder="What are you building?"
                />
              </div>

              {status === 'error' ? (
                <p className="meta text-accent-lo" role="alert">
                  Something went wrong — email {contact.email} directly.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="meta meta-ink rule-t rule-b inline-block px-1 py-3 transition-colors hover:text-accent-lo disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending…' : 'Send →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
