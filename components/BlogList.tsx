'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { BlogPost } from '@/lib/mdx'

interface BlogListProps {
  posts: BlogPost[]
  showHeader?: boolean
}

export default function BlogList({ posts, showHeader = true }: BlogListProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section 
      id="blog" 
      ref={sectionRef} 
      className="relative py-32 lg:py-40 bg-white overflow-hidden"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        {/* Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-32"
          >
            <motion.div 
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="px-4 py-1.5 rounded-full border border-black/10 bg-black/2">
                <span className="text-xs font-medium tracking-wider uppercase text-black/60">
                  Insights
                </span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black mb-6 leading-[1.1]">
              Recent Writing
            </h2>
            
            <p className="text-lg sm:text-xl text-black/50 max-w-2xl leading-relaxed font-light">
              Thoughts on architecture, performance, and building for scale.
            </p>
          </motion.div>
        )}

        {/* Articles */}
        <div className="space-y-px bg-black/5">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group bg-white"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block p-8 lg:p-12 hover:bg-black/1 transition-colors duration-500"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                  {/* Left: Metadata */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="text-xs font-medium tracking-wider uppercase text-black/30">
                      {post.category}
                    </div>
                    <time className="block text-sm text-black/40 font-light">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <div className="text-sm text-black/30 font-light">
                      {post.readTime}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="lg:col-span-9">
                    <div className="space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-black leading-tight tracking-tight group-hover:text-black/70 transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-base sm:text-lg text-black/50 leading-relaxed font-light max-w-3xl">
                        {post.excerpt}
                      </p>

                      <motion.div
                        className="flex items-center gap-2 text-sm font-medium text-black/60 pt-2"
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
                    </div>
                  </div>
                </div>

                {/* Bottom border on hover */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-px bg-black origin-left"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 0.05 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
