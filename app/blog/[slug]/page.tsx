import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import BlogPostLayout from '@/components/BlogPostLayout'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  
  return {
    title: `${post.title} | Godwill Barasa`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    category: post.category,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      url: postUrl,
      siteName: 'Godwill Barasa',
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : [],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: postUrl,
    },
    other: {
      'article:published_time': post.date,
      'article:author': post.author,
      'article:section': post.category,
      'article:tag': post.keywords?.join(', ') || '',
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = await getRelatedPosts(slug)
  
  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'github-light',
            keepBackground: false,
          },
        ] as any,
      ],
    },
  }
  
  // Generate JSON-LD for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: post.author,
    },
    url: `${siteUrl}/blog/${post.slug}`,
    keywords: post.keywords?.join(', '),
    articleSection: post.category,
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostLayout post={post} relatedPosts={relatedPosts}>
        <MDXRemote source={post.content} options={mdxOptions} />
      </BlogPostLayout>
    </>
  )
}
