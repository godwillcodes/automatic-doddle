'use client'

import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.includes('@')) {
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: 'newsletter', email }),
      })
      if (!response.ok) throw new Error('failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <aside aria-label="Newsletter" className="rule-t rule-b mt-14 py-8">
      <p className="meta">
        <span className="meta-accent">Dispatch</span> — new field notes, by email
      </p>

      {status === 'success' ? (
        <p className="prose-body mt-4" role="status">
          Subscribed. New pieces will find you.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex max-w-md items-baseline gap-4">
          {/* Honeypot: hidden from people, tempting to bots. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            placeholder="you@example.com"
            className="rule-b w-full border-0 bg-transparent py-2 text-base text-ink placeholder:text-stone/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="meta meta-ink shrink-0 transition-colors hover:text-accent-lo disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending…' : 'Subscribe →'}
          </button>
        </form>
      )}

      {status === 'error' ? (
        <p className="meta mt-3 text-accent-lo" role="alert">
          That didn&apos;t go through — check the address and try again.
        </p>
      ) : (
        <p className="meta mt-3">No spam. Unsubscribe anytime.</p>
      )}
    </aside>
  )
}
