import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

import { apiVersion, dataset, projectId } from '@/sanity/env'
import { site } from '@/lib/site'

/**
 * Handles the contact, newsletter and CV-request forms.
 *
 * The submission is written to Sanity first and email is attempted afterwards,
 * so a missing or failing mail provider degrades to "we have your message"
 * rather than losing it. The previous Netlify Forms setup posted to `/`, which
 * stops working the moment the site is not on Netlify.
 */
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const FORMS = ['contact', 'newsletter', 'cv'] as const
type Form = (typeof FORMS)[number]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface Payload {
  form?: string
  name?: string
  email?: string
  message?: string
  /** Honeypot. Real users never fill this in; bots usually do. */
  company?: string
}

export async function POST(request: Request) {
  let payload: Payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Silently accept honeypot hits so the bot doesn't learn it was caught.
  if (payload.company) {
    return NextResponse.json({ ok: true })
  }

  const form = payload.form as Form
  if (!FORMS.includes(form)) {
    return NextResponse.json({ error: 'Unknown form.' }, { status: 400 })
  }

  const email = payload.email?.trim() ?? ''
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  const name = payload.name?.trim() ?? ''
  const message = payload.message?.trim() ?? ''

  if (form === 'contact' && (!name || !message)) {
    return NextResponse.json(
      { error: 'Name and message are both required.' },
      { status: 400 }
    )
  }
  if (form === 'cv' && !name) {
    return NextResponse.json({ error: 'Your name is required.' }, { status: 400 })
  }

  const submittedAt = new Date().toISOString()
  let notified = false

  try {
    await writeClient.create({
      _type: 'submission',
      form,
      name: name || undefined,
      email,
      message: message || undefined,
      submittedAt,
      notified: false,
    })
  } catch (error) {
    console.error('[contact] could not persist submission', error)
    return NextResponse.json(
      { error: 'Something went wrong on our side. Please email me directly.' },
      { status: 500 }
    )
  }

  // Best-effort notification. Configured automatically once the Resend
  // marketplace integration is connected; absent that, the Studio record is
  // still the source of truth.
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Website <noreply@${new URL(site.url).hostname}>`,
          to: [site.author.email],
          reply_to: email,
          subject: subjectFor(form, name || email),
          text: bodyFor(form, { name, email, message, submittedAt }),
        }),
      })
      notified = response.ok
      if (!response.ok) {
        console.error('[contact] resend rejected the message', await response.text())
      }
    } catch (error) {
      console.error('[contact] notification failed', error)
    }
  }

  return NextResponse.json({ ok: true, notified })
}

function subjectFor(form: Form, who: string) {
  switch (form) {
    case 'contact':
      return `New enquiry from ${who}`
    case 'newsletter':
      return `New subscriber: ${who}`
    case 'cv':
      return `CV request from ${who}`
  }
}

function bodyFor(
  form: Form,
  data: { name: string; email: string; message: string; submittedAt: string }
) {
  return [
    `Form: ${form}`,
    data.name ? `Name: ${data.name}` : null,
    `Email: ${data.email}`,
    data.message ? `\n${data.message}` : null,
    `\nReceived ${data.submittedAt}`,
  ]
    .filter(Boolean)
    .join('\n')
}
