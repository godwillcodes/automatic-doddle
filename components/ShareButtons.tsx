'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Twitter, Linkedin, Link2, Check, Mail } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:bg-black/5 hover:text-black',
    },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="my-12"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-sm font-medium text-black/50">Share this article</span>
        
        <div className="flex items-center gap-2">
          {/* Share buttons */}
          {shareLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full bg-black/5 text-black/60 transition-colors ${link.color}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Share on ${link.name}`}
            >
              <link.icon size={18} strokeWidth={2} />
            </motion.a>
          ))}

          {/* Copy link button */}
          <motion.button
            onClick={handleCopyLink}
            className="p-3 rounded-full bg-black/5 text-black/60 hover:bg-black/10 hover:text-black transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copy link"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-emerald-600"
                >
                  <Check size={18} strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div
                  key="link"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Link2 size={18} strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <motion.button
              onClick={() => {
                navigator.share({
                  title,
                  text: description,
                  url,
                })
              }}
              className="p-3 rounded-full bg-black/5 text-black/60 hover:bg-black/10 hover:text-black transition-colors sm:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Share"
            >
              <Share2 size={18} strokeWidth={2} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Copied notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-sm text-emerald-600 font-medium"
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
