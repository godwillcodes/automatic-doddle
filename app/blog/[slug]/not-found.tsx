'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-black mb-4">404</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-black/70 mb-6">
            Article not found
          </h2>
          <p className="text-base text-black/50 mb-12 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/10 hover:border-black/20 bg-white hover:bg-black/2 transition-all duration-300 text-black/70 hover:text-black"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="font-medium">Back to articles</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
