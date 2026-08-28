import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from 'lucide-react'

import type { PostSummary } from '@/lib/sanity/types'
import ReadArticle from './ReadArticle'
import ReadingProgress from './ReadingProgress'
import ShareButtons from './ShareButtons'
import NewsletterCTA from './NewsletterCTA'
import TableOfContents from './article/TableOfContents'

interface Heading {
  id: string
  text: string
  level: number
}

interface BlogPostLayoutProps {
  post: PostSummary & { targetKeyword?: string }
  relatedPosts: PostSummary[]
  headings: Heading[]
  /** Resolved on the server so share links can't disagree across hydration. */
  url: string
  readableText?: string
  children: ReactNode
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function BlogPostLayout({
  post,
  relatedPosts,
  headings,
  url,
  readableText,
  children,
}: BlogPostLayoutProps) {
  return (
    <article className="relative min-h-screen bg-white text-black">
      <ReadingProgress />

      <div className="relative border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-0">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-black transition-colors duration-300 hover:text-black/60"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Back to articles</span>
          </Link>
        </div>
      </div>

      <header className="relative bg-white pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-block rounded-full border border-black/10 bg-black/[0.02] px-4 py-1.5 transition-colors hover:border-black/20"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-black/60">
                {post.category.title}
              </span>
            </Link>
          </div>

          <h1 className="mb-10 max-w-4xl text-3xl font-semibold leading-[1.1] tracking-tight text-black sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mb-10 max-w-3xl text-lg font-light leading-relaxed text-black/60 sm:text-xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm font-light text-black/40">
            <span className="font-medium text-black/70">{post.author.name}</span>
            <span className="flex items-center gap-2">
              <Calendar size={14} strokeWidth={2} />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} strokeWidth={2} />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      <div className="relative bg-white pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {readableText ? (
                <ReadArticle title={post.title} text={readableText} />
              ) : null}

              <ShareButtons title={post.title} url={url} description={post.excerpt} />

              <div className="max-w-none">{children}</div>

              <div className="mt-16 border-t border-black/10 pt-12">
                <ShareButtons title={post.title} url={url} description={post.excerpt} />
              </div>

              <NewsletterCTA />
            </div>

            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="relative border-t border-black/5 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
            <h2 className="mb-12 text-xl font-semibold tracking-tight text-black sm:text-2xl">
              Related reading
            </h2>

            <div className="grid gap-px bg-black/5 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <div
                  key={related.slug}
                  className="group bg-white p-8 transition-colors duration-500 hover:bg-black/[0.01] lg:p-10"
                >
                  <Link href={`/blog/${related.slug}`}>
                    <div className="mb-4 text-xs font-medium uppercase tracking-wider text-black/30">
                      {related.category.title}
                    </div>

                    <h3 className="mb-4 text-lg font-semibold leading-tight text-black transition-colors duration-300 group-hover:text-black/70 sm:text-xl">
                      {related.title}
                    </h3>

                    <p className="mb-6 text-sm font-light leading-relaxed text-black/50">
                      {related.excerpt}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
