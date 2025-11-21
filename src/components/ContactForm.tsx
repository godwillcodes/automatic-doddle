'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'

export function ContactForm() {
  const [status, setStatus] = useState<string>('')

  return (
    <form
      name="performance-audit-pro-contact"
      method="POST"
      data-netlify="true"
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const data = new FormData(form)
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data as any).toString(),
        })
          .then(() => {
            setStatus('Thank you for reaching out! We will get back to you soon.')
            form.reset()
          })
          .catch(() => {
            setStatus('Oops! Something went wrong, please try again later.')
          })
      }}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value="performance-audit-pro-contact" />
      <div>
        <label htmlFor="name" className="mb-2 block font-medium text-zinc-900 dark:text-white">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block font-medium text-zinc-900 dark:text-white">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block font-medium text-zinc-900 dark:text-white">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          placeholder="Write your message here"
        />
      </div>
      <div className="flex justify-center">
        <Button type="submit" className="w-full max-w-xs">
          Send Message
        </Button>
      </div>
      {status && (
        <p
          className={`text-center font-semibold ${status.includes('Oops') ? 'text-red-600' : 'text-teal-600'}`}
          role="alert"
        >
          {status}
        </p>
      )}
    </form>
  )
}

export default ContactForm


