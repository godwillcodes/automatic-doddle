'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Clock, Calendar } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { BlogPost } from '@/lib/mdx'
import Link from 'next/link'
import ReadArticle from './ReadArticle'
import ReadingProgress from './ReadingProgress'
import ShareButtons from './ShareButtons'
import NewsletterCTA from './NewsletterCTA'

interface BlogPostLayoutProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  children: ReactNode
}

export default function BlogPostLayout({ post, relatedPosts, children }: BlogPostLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, amount: 0.1 })
  const router = useRouter()

  const pathname = usePathname()
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://godwillbarasa.netlify.app'
  const articleUrl = `${siteUrl}${pathname}`

  return (
    <article className="relative bg-white min-h-screen text-black">
      {/* Reading Progress Bar */}
      <ReadingProgress />
      
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-size-[80px_80px] mask-[radial-gradient(ellipse_100%_100%_at_50%_0%,black_40%,transparent_80%)]" />
      
      {/* Back button */}
      <div className="relative border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0 py-8 bg-white">
          <motion.button
            onClick={() => router.push('/blog')}
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-black/70 transition-colors duration-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Back to articles</span>
          </motion.button>
        </div>
      </div>

      {/* Article header */}
      <header className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0 bg-white">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category badge */}
            <div className="mb-8">
              <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 bg-black/2">
                <span className="text-xs font-medium tracking-wider uppercase text-black/60">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black mb-12 leading-[1.1]">
              {post.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-black/40 font-light">
              <div className="flex items-center gap-2">
                <span className="text-black/70 font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} strokeWidth={2} />
                <time>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} strokeWidth={2} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Article content */}
      <div ref={contentRef} className="relative pb-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0 bg-white">
          {/* Read Article Feature */}
          <ReadArticle title={post.title} content={post.content} />

          {/* Share Buttons - Top */}
          <ShareButtons 
            title={post.title} 
            url={articleUrl} 
            description={post.excerpt} 
          />

          {/* MDX Content - styling handled by mdx-components */}
          <div className="max-w-none">
            {children}
          </div>

          {/* Share Buttons - Bottom */}
          <div className="mt-16 pt-12 border-t border-black/10">
            <ShareButtons 
              title={post.title} 
              url={articleUrl} 
              description={post.excerpt} 
            />
          </div>

          {/* Newsletter CTA */}
          <NewsletterCTA />
        </div>
      </div>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <div className="relative border-t border-black/5 py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-black mb-12">
                Related Reading
              </h2>

              <div className="grid sm:grid-cols-2 gap-px bg-black/5">
                {relatedPosts.map((related, index) => (
                  <motion.div
                    key={related.slug}
                    className="group bg-white p-8 lg:p-10 hover:bg-black/1 transition-colors duration-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.5 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -4 }}
                  >
                    <Link href={`/blog/${related.slug}`}>
                      <div className="mb-4">
                        <div className="text-xs font-medium tracking-wider uppercase text-black/30">
                          {related.category}
                        </div>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-semibold text-black mb-6 leading-tight group-hover:text-black/70 transition-colors duration-300">
                        {related.title}
                      </h3>

                      <motion.div
                        className="flex items-center gap-2 text-sm font-medium text-black/60"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>Read article</span>
                        <ArrowUpRight 
                          size={16} 
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" 
                          strokeWidth={2}
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </article>
  )
}
