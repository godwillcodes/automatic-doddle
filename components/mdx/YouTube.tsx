'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface YouTubeProps {
  id: string
  title?: string
}

function extractYouTubeId(idOrUrl: string): string {
  // If it's already just an ID, return it
  if (!idOrUrl.includes('/') && !idOrUrl.includes('.')) {
    return idOrUrl
  }

  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = idOrUrl.match(pattern)
    if (match) return match[1]
  }

  return idOrUrl
}

export default function YouTube({ id, title = 'YouTube Video' }: YouTubeProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const videoId = extractYouTubeId(id)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="my-10"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden border border-black/10 bg-black">
        {!isLoaded ? (
          // Thumbnail with play button (privacy-friendly lazy load)
          <button
            onClick={() => setIsLoaded(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Play ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl"
              >
                <Play size={32} className="text-white ml-1" fill="white" strokeWidth={0} />
              </motion.div>
            </div>

            {/* YouTube branding */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <svg viewBox="0 0 90 20" className="h-4 w-auto fill-white/90">
                <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              </svg>
            </div>
          </button>
        ) : (
          // Actual iframe
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>

      {/* Caption */}
      {title && title !== 'YouTube Video' && (
        <p className="mt-3 text-center text-sm text-black/50 italic">{title}</p>
      )}
    </motion.div>
  )
}
