import { getAllPosts } from '@/lib/mdx'
import { Metadata } from 'next'
import BlogList from '@/components/BlogList'

export const metadata: Metadata = {
  title: 'Blog | Godwill Barasa',
  description: 'Thoughts on architecture, performance, and building for scale.',
  openGraph: {
    title: 'Blog | Godwill Barasa',
    description: 'Thoughts on architecture, performance, and building for scale.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Godwill Barasa',
    description: 'Thoughts on architecture, performance, and building for scale.',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  
  return <BlogList posts={posts} />
}
