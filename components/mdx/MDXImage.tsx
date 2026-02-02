'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

interface MDXImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function MDXImage({ 
  src, 
  alt, 
  caption,
  width = 1200,
  height = 630,
  priority = false
}: MDXImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Handle both relative and absolute URLs
  const imageSrc = src.startsWith('/') || src.startsWith('http') ? src : `/${src}`

  return (
    <>
      <figure className="my-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative group cursor-zoom-in overflow-hidden rounded-xl border border-black/5 bg-black/[0.02]"
          onClick={() => setIsZoomed(true)}
        >
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] via-black/[0.05] to-black/[0.02] animate-pulse" />
          )}
          
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className={`w-full h-auto transition-all duration-500 ${
              isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            } group-hover:scale-[1.02]`}
            onLoad={() => setIsLoading(false)}
          />

          {/* Zoom indicator */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ZoomIn size={20} className="text-black/70" strokeWidth={2} />
            </motion.div>
          </div>
        </motion.div>

        {/* Caption */}
        {(caption || alt) && (
          <figcaption className="mt-4 text-center text-sm text-black/50 italic">
            {caption || alt}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setIsZoomed(false)}
            >
              <X size={24} className="text-white" strokeWidth={2} />
            </motion.button>

            {/* Zoomed image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imageSrc}
                alt={alt}
                width={width * 2}
                height={height * 2}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              />
            </motion.div>

            {/* Caption in lightbox */}
            {(caption || alt) && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center max-w-lg px-4"
              >
                {caption || alt}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
