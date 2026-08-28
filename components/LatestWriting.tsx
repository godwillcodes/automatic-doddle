import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import type { PostSummary } from '@/lib/sanity/types'

/**
 * Gives the homepage real internal links into the blog. Previously the only
 * route to an article was a single "Read my articles" button, which left every
 * post effectively orphaned once /blog was dropped from the index.
 */
export default function LatestWriting({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null

  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <div className="mb-6 inline-block rounded-full border border-black/10 bg-black/[0.02] px-4 py-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-black/50">
                Writing
              </span>
            </div>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-black sm:text-4xl">
              Latest articles
            </h2>
          </div>

          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black sm:flex"
          >
            <span>All articles</span>
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid gap-px bg-black/5 sm:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white p-8 transition-colors duration-500 hover:bg-black/[0.01]"
            >
              <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                <div className="mb-4 text-xs font-medium uppercase tracking-wider text-black/30">
                  {post.category.title}
                </div>

                <h3 className="mb-4 text-lg font-semibold leading-tight tracking-tight text-black transition-colors duration-300 group-hover:text-black/70 sm:text-xl">
                  {post.title}
                </h3>

                <p className="mb-6 flex-1 text-sm font-light leading-relaxed text-black/50">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <span>Read article</span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
