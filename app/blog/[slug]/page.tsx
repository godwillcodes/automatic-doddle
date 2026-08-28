import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ArticleBody, { extractHeadings, toReadableText } from '@/components/article/ArticleBody'
import BlogPostLayout from '@/components/BlogPostLayout'
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/sanity/queries'
import { urlForOpenGraph } from '@/lib/sanity/client'
import { absoluteUrl, site } from '@/lib/site'

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    wordCount: post.readingTime * 200,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: site.url,
      jobTitle: post.author.jobTitle,
      sameAs: post.author.sameAs,
    },
    publisher: { '@type': 'Person', name: post.author.name, url: site.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    keywords: post.keywords?.join(', '),
    articleSection: post.category.title,
  }

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
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
