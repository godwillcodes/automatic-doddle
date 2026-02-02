'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, ChevronRight } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  selector?: string
}

export default function TableOfContents({ selector = 'h2, h3' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Find all headings in the article
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll(selector)
    const items: TOCItem[] = []

    elements.forEach((element) => {
      const id = element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
      
      // Add ID to element if it doesn't have one
      if (!element.id && id) {
        element.id = id
      }

      items.push({
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
      })
    })

    setHeadings(items)
  }, [selector])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  if (headings.length === 0) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="my-10 rounded-xl border border-black/10 bg-black/[0.01] overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <List size={18} className="text-black/50" strokeWidth={2} />
          <span className="font-semibold text-black text-sm">Table of Contents</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} className="text-black/40" strokeWidth={2} />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-5 space-y-1">
              {headings.map((heading, index) => (
                <motion.li
                  key={heading.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <button
                    onClick={() => handleClick(heading.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                      heading.level === 3 ? 'pl-6' : ''
                    } ${
                      activeId === heading.id
                        ? 'bg-black/5 text-black font-medium'
                        : 'text-black/50 hover:text-black/70 hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="line-clamp-1">{heading.text}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
