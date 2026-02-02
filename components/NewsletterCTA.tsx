'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react'

interface NewsletterCTAProps {
  title?: string
  description?: string
}

export default function NewsletterCTA({ 
  title = "Stay in the loop",
  description = "Get notified when I publish new articles. No spam, unsubscribe anytime."
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    // Simulate API call - replace with your actual newsletter API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, you would call your newsletter API here:
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
      
      setStatus('success')
      setMessage('Thanks for subscribing! Check your inbox to confirm.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="my-16 p-8 sm:p-10 rounded-2xl border border-black/10 bg-gradient-to-br from-black/[0.02] to-transparent"
    >
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-black/5 flex items-center justify-center">
          <Mail size={24} className="text-black/60" strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-semibold text-black mb-2">
            {title}
          </h3>
          <p className="text-black/50 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-5 py-3.5 rounded-xl border border-black/10 bg-white text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
            >
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    <span>Subscribing...</span>
                  </motion.div>
                ) : status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={18} />
                    <span>Subscribed!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Status message */}
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 text-sm ${
                  status === 'success' ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
