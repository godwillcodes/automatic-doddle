'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, User, Download, CheckCircle2, Loader2 } from 'lucide-react'

interface DownloadCVModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DownloadCVModal({ isOpen, onClose }: DownloadCVModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Replace with your actual API endpoint
      // const response = await fetch('/api/send-cv', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // if (!response.ok) throw new Error('Failed to send CV')

      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setFormData({ name: '', email: '' })
      }, 2000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Error sending CV:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setFormData({ name: '', email: '' })
      setError('')
      setIsSuccess(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white border border-black/10 shadow-2xl">
                {/* Subtle background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                <div className="relative p-8 sm:p-10">
                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="absolute top-6 right-6 p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close modal"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>

                  <AnimatePresence mode="wait">
                    {/* Success state */}
                    {isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black mb-6"
                        >
                          <CheckCircle2 size={32} className="text-white" strokeWidth={2} />
                        </motion.div>
                        <h3 className="text-2xl font-semibold text-black mb-3 tracking-tight">
                          Check your email
                        </h3>
                        <p className="text-base text-black/50 font-light">
                          Your CV has been sent to<br />
                          <span className="font-medium text-black">{formData.email}</span>
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Header */}
                        <div className="mb-8">
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black mb-6"
                          >
                            <Download size={24} className="text-white" strokeWidth={2} />
                          </motion.div>
                          <h2 className="text-3xl font-semibold text-black mb-3 tracking-tight">
                            Download CV
                          </h2>
                          <p className="text-base text-black/50 font-light">
                            Enter your details to receive my CV via email
                          </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">
                          {/* Name field */}
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-black/60 mb-2"
                            >
                              Name
                            </label>
                            <div className="relative">
                              <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                strokeWidth={2}
                              />
                              <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                                disabled={isSubmitting}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-black/10 text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Your name"
                              />
                            </div>
                          </div>

                          {/* Email field */}
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-black/60 mb-2"
                            >
                              Email
                            </label>
                            <div className="relative">
                              <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                                strokeWidth={2}
                              />
                              <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({ ...formData, email: e.target.value })
                                }
                                disabled={isSubmitting}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-black/10 text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="your@email.com"
                              />
                            </div>
                          </div>

                          {/* Error message */}
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-2xl bg-black/5 border border-black/10"
                            >
                              <p className="text-sm text-black/60">{error}</p>
                            </motion.div>
                          )}

                          {/* Submit button */}
                          <motion.button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                            className="w-full mt-6 py-4 px-6 rounded-2xl bg-black text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 size={18} className="animate-spin" strokeWidth={2} />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Download size={18} strokeWidth={2} />
                                <span>Send to Email</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}