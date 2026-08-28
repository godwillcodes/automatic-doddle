import Link from 'next/link'

import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import type { PostSummary } from '@/lib/sanity/types'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * 08 — Field notes. The writing archive as a publication index: issue number,
 * title, excerpt, metadata. Sourced from Sanity.
 */
export default function FieldNotes({ posts }: { posts: PostSummary[] }) {
  const total = posts.length

  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
    >
      <SectionHead
        number="08"
        label="Field notes"
        title="Writing"
        lede="Production notes from real systems — M-Pesa and the Daraja API, Core Web Vitals, and the failure modes that never make the getting-started guides."
      />

      <ul className="pb-4">
        {posts.map((post, index) => (
          <Reveal key={post.slug} as="li" delay={Math.min(index * 0.04, 0.2)} className="rule-t">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-2 py-6 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <span className="meta meta-accent">
                {String(total - index).padStart(2, '0')}
                <span aria-hidden="true"> /</span>
              </span>
              <span>
                <span className="display block text-[clamp(1.15rem,2.2vw,1.6rem)] transition-colors group-hover:text-stone">
                  {post.title}
                </span>
                <span className="prose-body mt-2 hidden text-sm sm:block">
                  {post.excerpt}
                </span>
              </span>
              <span className="meta sm:text-right">
                {formatDate(post.publishedAt)}
                <span className="mt-1 block">{post.category.title}</span>
                <span className="mt-1 block">{post.readingTime} min</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal className="rule-t pb-[clamp(2.5rem,5vw,4rem)] pt-6">
        <Link href="/blog" className="meta meta-ink">
          The full archive <span className="text-accent-lo">→</span>
        </Link>
      </Reveal>
    </section>
  )
}
