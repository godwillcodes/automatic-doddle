'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * The writing grid, with provenance as the design. Solid cards with a copper
 * rule are pieces published here; dashed, recessed cards are studio notes
 * that live on Lock & Mercer. A reader should never wonder which publication
 * they are about to open — the card shape answers before the badge does.
 */

export interface OwnPost {
  slug: string
  title: string
  excerpt: string
  readingTime: number
  category: string
}

interface LmNote {
  slug: string
  n: string
  title: string
  line: string
}

/** The studio notes, with their real slugs — verified against the L&M repo. */
const LM_NOTES: LmNote[] = [
  {
    slug: 'redirect-map-is-the-deliverable',
    n: '01',
    title: 'The redirect map is the deliverable',
    line: 'Why a migration is finished when the old URLs resolve, not when the design ships.',
  },
  {
    slug: 'mpesa-phone-numbers-are-personal-data',
    n: '02',
    title: 'M-Pesa phone numbers are personal data',
    line: 'The number that pays is also an identifier. Treat it like one.',
  },
  {
    slug: 'a-badge-is-worth-what-removes-it',
    n: '03',
    title: 'A badge is only worth what removes it',
    line: 'Verification that cannot be revoked is decoration.',
  },
  {
    slug: 'the-cutover-runbook',
    n: '04',
    title: 'The cutover runbook nobody writes',
    line: 'DNS, certificates and mail, in the order that keeps a business trading.',
  },
  {
    slug: 'paying-twice-to-resize-the-same-image',
    n: '05',
    title: 'You are paying twice to resize the same image',
    line: 'Where image pipelines duplicate work, and what it costs per month.',
  },
  {
    slug: 'a-station-site-should-know-if-its-on-air',
    n: '06',
    title: 'A station site should know if it is on air',
    line: 'Reading broadcast state so the website cannot contradict the transmitter.',
  },
  {
    slug: 'building-for-the-connection-people-actually-have',
    n: '07',
    title: 'Building for the connection people actually have',
    line: 'Designing to the median Kenyan connection instead of the office one.',
  },
]

type Filter = 'all' | 'own' | 'lm'

export default function WritingSection({ posts, total }: { posts: OwnPost[]; total: number }) {
  const [filter, setFilter] = useState<Filter>('all')

  const showOwn = filter !== 'lm'
  const showLm = filter !== 'own'
  const counts = { all: posts.length + LM_NOTES.length, own: posts.length, lm: LM_NOTES.length }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter writing by publication">
        {(
          [
            ['all', 'All'],
            ['own', 'On this site'],
            ['lm', 'Lock & Mercer'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className="co-fbtn"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label} <span className="opacity-60">{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {showOwn &&
          posts.map((post) => (
            <Link key={post.slug} className="co-post" data-src="own" href={`/blog/${post.slug}`}>
              <div className="flex items-center gap-2">
                <span className="co-badge">godwillbarasa.com</span>
                <span className="meta meta-faint ml-auto">{post.readingTime} min</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="co-post-foot meta">
                {post.category} <span className="arw">→</span>
              </div>
            </Link>
          ))}

        {showLm &&
          LM_NOTES.map((note) => (
            <a
              key={note.slug}
              className="co-post"
              data-src="lm"
              href={`https://www.lockandmercer.com/notes/${note.slug}`}
              rel="noopener"
              target="_blank"
            >
              <div className="flex items-center gap-2">
                <span className="co-badge">Lock &amp; Mercer ↗</span>
                <span className="meta meta-faint ml-auto">Note {note.n}</span>
              </div>
              <h3>{note.title}</h3>
              <p>{note.line}</p>
              <div className="co-post-foot meta">
                Studio note <span className="arw">↗</span>
              </div>
            </a>
          ))}
      </div>

      <div className="mt-6">
        <Link className="co-btn meta" href="/blog">
          Read all {total} pieces <span className="arw">→</span>
        </Link>
      </div>
    </>
  )
}
