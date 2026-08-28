import type { PortableTextBlock } from '@portabletext/react'
import type { Image } from 'sanity'

export interface Author {
  name: string
  slug: string
  jobTitle?: string
  bio?: string
  image?: Image & { alt?: string }
  sameAs?: string[]
}

export interface Category {
  title: string
  slug: string
  description?: string
}

export interface CodeBlockValue {
  _type: 'code'
  _key: string
  code: string
  language?: string
  filename?: string
  highlightedLines?: number[]
}

export interface CalloutValue {
  _type: 'callout'
  _key: string
  tone?: 'note' | 'tip' | 'warning'
  title?: string
  body?: string
}

export interface FigureValue extends Image {
  _type: 'figure'
  _key: string
  alt: string
  caption?: string
}

export type ArticleBlock = PortableTextBlock | CodeBlockValue | CalloutValue | FigureValue

/** Everything the blog index and cards need, without dragging the body along. */
export interface PostSummary {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  readingTime: number
  featured?: boolean
  category: Category
  author: Author
  coverImage?: Image & { alt?: string }
}

export interface Post extends PostSummary {
  body: ArticleBlock[]
  categoryId?: string
  targetKeyword?: string
  keywords?: string[]
  metaTitle?: string
  noIndex?: boolean
}
