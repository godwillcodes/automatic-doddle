import 'server-only'

import { cache } from 'react'
import { groq } from 'next-sanity'

import { readClient } from './server-client'
import type { Post, PostSummary } from './types'

/**
 * `readingTime` is derived rather than hand-entered so it can never drift from
 * the body. GROQ can't walk Portable Text spans, so we count characters across
 * every block's children and convert at ~1,000 characters per minute.
 */
const READING_TIME = `"readingTime": math::max([1, round(length(pt::text(body)) / 1000)])`

const SUMMARY_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  featured,
  ${READING_TIME},
  coverImage,
  "category": category->{ title, "slug": slug.current, description },
  "author": author->{ name, "slug": slug.current, jobTitle, bio, image, sameAs }
`

const postsQuery = groq`
  *[_type == "post" && !(noIndex == true)] | order(featured desc, publishedAt desc) {
    ${SUMMARY_FIELDS}
  }
`

const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${SUMMARY_FIELDS},
    "categoryId": category._ref,
    body,
    targetKeyword,
    keywords,
    metaTitle,
    noIndex
  }
`

const slugsQuery = groq`*[_type == "post" && defined(slug.current)].slug.current`

/**
 * Related posts, scored in GROQ so we never pull the full corpus into Node:
 * same category is worth 10, each shared keyword 3.
 */
const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && !(noIndex == true)] {
    ${SUMMARY_FIELDS},
    "score": (
      select(category._ref == $categoryId => 10, 0) +
      (count(keywords[@ in $keywords]) * 3)
    )
  } | order(score desc, publishedAt desc) [0...$limit]
`

/**
 * `cache()` dedupes within a single render pass — a blog post page asks for the
 * same document from generateMetadata, the page body and the JSON-LD, and this
 * collapses those into one request. `next.tags` lets a Sanity webhook bust the
 * whole blog with one revalidateTag call.
 */
const options: { next: { tags: string[] } } = { next: { tags: ['post'] } }

export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
  return readClient.fetch<PostSummary[]>(postsQuery, {}, options)
})

export const getPostSlugs = cache(async (): Promise<string[]> => {
  return readClient.fetch<string[]>(slugsQuery, {}, options)
})

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return readClient.fetch<Post | null>(postBySlugQuery, { slug }, options)
})

export const getRelatedPosts = cache(
  async (slug: string, limit = 2): Promise<PostSummary[]> => {
    const post = await getPostBySlug(slug)
    if (!post) {
      const all = await getAllPosts()
      return all.filter((p) => p.slug !== slug).slice(0, limit)
    }

    const related = await readClient.fetch<PostSummary[]>(
      relatedPostsQuery,
      {
        slug,
        categoryId: post.categoryId ?? null,
        keywords: post.keywords ?? [],
        limit,
      },
      options
    )

    return related
  }
)
