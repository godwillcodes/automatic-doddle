import Link from 'next/link'
import type { ReactNode } from 'react'

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
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Article page: reading quality first. Wide margins, one measure, mono
 * metadata, no sidebar clutter beyond the section index.
 */
export default function BlogPostLayout({
  post,
  relatedPosts,
  headings,
  url,
  readableText,
  children,
}: BlogPostLayoutProps) {
  return (
    <article className="bg-paper text-ink">
      <ReadingProgress />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Issue header */}
        <header className="rule-b pb-10 pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-8">
            <Link href="/blog" className="meta meta-ink">
              ← Field notes
            </Link>
            <p className="meta">
              {post.category.title}
              <span aria-hidden="true"> · </span>
              {post.readingTime} min read
            </p>
          </div>

          <h1 className="display max-w-4xl text-[clamp(2rem,5vw,3.8rem)]">{post.title}</h1>

          <p className="prose-body mt-6 max-w-3xl text-[1.05rem]">{post.excerpt}</p>

          <div className="meta mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="meta-ink">{post.author.name}</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.updatedAt && post.updatedAt !== post.publishedAt ? (
              <span>Revised {formatDate(post.updatedAt)}</span>
            ) : null}
          </div>
        </header>

        <div className="py-10 lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {readableText ? <ReadArticle title={post.title} text={readableText} /> : null}

            <div className="article-prose max-w-none">{children}</div>

            <div className="rule-t mt-14 pt-8">
              <ShareButtons title={post.title} url={url} description={post.excerpt} />
            </div>

            <NewsletterCTA />
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 space-y-10">
              <TableOfContents headings={headings} />
              <ShareButtons title={post.title} url={url} description={post.excerpt} compact />
            </div>
          </aside>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="rule-t">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
            <p className="meta mb-8">
              <span className="meta-accent">Related</span> — from the same notebook
            </p>
            <div className="grid gap-10 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group rule-t pt-6">
                  <p className="meta">{related.category.title}</p>
                  <h3 className="display mt-3 text-[clamp(1.2rem,2.2vw,1.6rem)] transition-colors group-hover:text-stone">
                    {related.title}
                  </h3>
                  <p className="prose-body mt-3 text-sm">{related.excerpt}</p>
                  <p className="meta meta-ink mt-4">
                    Read article <span className="text-accent-lo">→</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
