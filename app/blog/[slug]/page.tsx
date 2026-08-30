import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ArticleBody, { extractHeadings, toReadableText } from '@/components/article/ArticleBody'
import BlogPostLayout from '@/components/BlogPostLayout'
import StructuredData from '@/components/StructuredData'
import { articleGraph } from '@/lib/seo/graph'
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/sanity/queries'
import { urlForOpenGraph } from '@/lib/sanity/client'
import { absoluteUrl, site } from '@/lib/site'

/**
 * Four hours, not the hourly window the index pages use. Every regeneration
 * re-runs Shiki across the article's code blocks, which makes these the most
 * CPU-expensive renders on the site — and an article body changes only when a
 * published piece is corrected. New articles don't arrive through this window
 * at all: dynamicParams is false, so a new slug needs a deploy regardless.
 * The webhook at /api/revalidate still makes corrections immediate once it is
 * configured; until then a fix takes at most four hours to appear.
 */
export const revalidate = 14400


export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: 'Article not found' }

  const url = absoluteUrl(`/blog/${post.slug}`)
  // The root layout already appends "| Godwill Barasa" via the title template,
  // so the article title must not carry its own suffix.
  const ogImage = post.coverImage
    ? urlForOpenGraph(post.coverImage)
    : absoluteUrl(`/blog/${post.slug}/opengraph-image`)

  return {
    title: post.metaTitle || post.title,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author.name, url: site.url }],
    category: post.category.title,
    alternates: { canonical: url },
    robots: post.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      url,
      siteName: site.name,
      locale: site.locale,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
      section: post.category.title,
      tags: post.keywords,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(slug)
  const headings = extractHeadings(post.body)
  const readableText = toReadableText(post.body)
  const url = absoluteUrl(`/blog/${post.slug}`)
  const ogImage = post.coverImage
    ? urlForOpenGraph(post.coverImage)
    : absoluteUrl(`/blog/${post.slug}/opengraph-image`)


  return (
    <>
      <StructuredData
        graph={articleGraph({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          category: post.category.title,
          keywords: post.keywords,
          // Counted from the prose actually rendered, rather than inferred
          // from reading time, which was a guess dressed as a measurement.
          wordCount: readableText.trim().split(/\s+/).filter(Boolean).length,
          readingTime: post.readingTime,
          imageUrl: ogImage,
        })}
      />
      <BlogPostLayout
        post={post}
        relatedPosts={relatedPosts}
        headings={headings}
        url={url}
        readableText={readableText}
      >
        <ArticleBody body={post.body} />
      </BlogPostLayout>
    </>
  )
}
