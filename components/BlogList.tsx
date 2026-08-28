import Link from 'next/link'

import Reveal from '@/components/Reveal'
import type { PostSummary } from '@/lib/sanity/types'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * The writing archive as a publication index: issue numbers, hairline rows,
 * metadata on the right.
 */
export default function BlogList({ posts }: { posts: PostSummary[] }) {
  const total = posts.length

  return (
    <section aria-labelledby="archive-heading" className="mx-auto max-w-7xl px-6 sm:px-8">
      <div className="sec-head rule-t">
        <p className="meta">
          <span className="meta-accent">Field notes</span>
          <span aria-hidden="true">{'  /  '}</span>
          {total} pieces
        </p>
        <h1 id="archive-heading" className="display mt-2 text-[clamp(2.1rem,5.5vw,4.4rem)]">
          Writing
        </h1>
        <p className="prose-body mt-2">
          Production notes from real systems — M-Pesa and the Daraja API, Core Web
          Vitals, and the architecture decisions that hold up under traffic.
        </p>
      </div>

      <ul className="pb-[clamp(3rem,6vw,5rem)]">
        {posts.map((post, index) => (
          <Reveal key={post.slug} as="li" delay={Math.min(index * 0.04, 0.2)} className="rule-t">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-3 py-8 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <span className="meta meta-accent">
                {String(total - index).padStart(2, '0')}
                <span aria-hidden="true"> /</span>
              </span>
              <span>
                <span className="display block text-[clamp(1.35rem,2.8vw,2rem)] transition-colors group-hover:text-stone">
                  {post.title}
                </span>
                <span className="prose-body mt-3 block text-[0.95rem]">{post.excerpt}</span>
                <span className="meta meta-ink mt-4 inline-block">
                  Read article <span className="text-accent-lo">→</span>
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
    </section>
  )
}
