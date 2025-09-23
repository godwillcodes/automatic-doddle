import { type Metadata } from 'next'

interface ArticleMetadata {
  title: string
  description: string
  author: string
  date: string
  slug: string
  keywords?: string[]
}

export function generateArticleMetadata(article: ArticleMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.com'
  
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords || [
      'software engineering',
      'technical leadership',
      'product management',
      'Godwill Barasa'
    ],
    authors: [{ name: article.author, url: baseUrl }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      url: `${baseUrl}/articles/${article.slug}`,
      siteName: 'Godwill Barasa',
      images: [
        {
          url: `${baseUrl}/images/portrait.jpg`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@godwill_codes',
      creator: '@godwill_codes',
      title: article.title,
      description: article.description,
      images: [`${baseUrl}/images/portrait.jpg`],
    },
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  keywords?: string[]
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.com'
  
  return {
    title,
    description,
    keywords: keywords || [
      'Godwill Barasa',
      'Software Engineer',
      'Technical Lead',
      'Product Engineering'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${path}`,
      siteName: 'Godwill Barasa',
      images: [
        {
          url: `${baseUrl}/images/portrait.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@godwill_codes',
      creator: '@godwill_codes',
      title,
      description,
      images: [`${baseUrl}/images/portrait.jpg`],
    },
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
