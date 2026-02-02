import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  author: string
  content: string
  image?: string
  keywords?: string[]
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(contentDirectory)
  
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const fullPath = path.join(contentDirectory, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        readTime: data.readTime,
        category: data.category,
        author: data.author,
        content,
        image: data.image,
        keywords: data.keywords,
      } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return posts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      readTime: data.readTime,
      category: data.category,
      author: data.author,
      content,
      image: data.image,
      keywords: data.keywords,
    } as BlogPost
  } catch (error) {
    return null
  }
}

export async function getRelatedPosts(currentSlug: string, limit: number = 2): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  const currentPost = allPosts.find(post => post.slug === currentSlug)
  
  if (!currentPost) {
    return allPosts.filter(post => post.slug !== currentSlug).slice(0, limit)
  }

  // Score posts by relevance
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0

      // Same category = high relevance
      if (post.category === currentPost.category) {
        score += 10
      }

      // Matching keywords
      if (currentPost.keywords && post.keywords) {
        const matchingKeywords = post.keywords.filter(keyword => 
          currentPost.keywords?.includes(keyword)
        )
        score += matchingKeywords.length * 3
      }

      // Recency bonus (newer posts get slight preference)
      const daysDiff = Math.abs(
        new Date(post.date).getTime() - new Date(currentPost.date).getTime()
      ) / (1000 * 60 * 60 * 24)
      if (daysDiff < 30) score += 2
      else if (daysDiff < 90) score += 1

      return { post, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)

  // If no scored posts, fall back to recent posts
  if (scoredPosts.length === 0) {
    return allPosts.filter(post => post.slug !== currentSlug).slice(0, limit)
  }

  return scoredPosts
}
