'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Twitter, Youtube, Globe } from 'lucide-react'

interface LinkPreviewProps {
  href: string
  title: string
  description?: string
  image?: string
}

function getIconForUrl(url: string) {
  if (url.includes('github.com')) return Github
  if (url.includes('twitter.com') || url.includes('x.com')) return Twitter
  if (url.includes('youtube.com') || url.includes('youtu.be')) return Youtube
  return Globe
}

function getDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain
  } catch {
    return url
  }
}

export default function LinkPreview({ href, title, description, image }: LinkPreviewProps) {
  const Icon = getIconForUrl(href)
  const domain = getDomainFromUrl(href)

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group block my-8 rounded-xl border border-black/10 overflow-hidden bg-white hover:border-black/20 hover:shadow-lg transition-all duration-300 no-underline"
    >
      <div className="flex">
        {/* Image */}
        {image && (
          <div className="hidden sm:block w-48 flex-shrink-0 bg-black/[0.02]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Domain */}
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-black/40" strokeWidth={2} />
                <span className="text-xs text-black/40 font-medium">{domain}</span>
              </div>

              {/* Title */}
              <h4 className="font-semibold text-black group-hover:text-black/70 transition-colors line-clamp-2 mb-1">
                {title}
              </h4>

              {/* Description */}
              {description && (
                <p className="text-sm text-black/50 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 p-2 rounded-full bg-black/[0.02] group-hover:bg-black/[0.05] transition-colors">
              <ExternalLink 
                size={16} 
                className="text-black/40 group-hover:text-black/60 transition-colors" 
                strokeWidth={2} 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}
