'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Send, CheckCircle2, Phone, Github, Linkedin, FileText } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'godwill.codes@gmail.com',
    href: 'mailto:godwill.codes@gmail.com'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+254 781 249 443',
    href: 'tel:+254781249443'
  }
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/godwillcodes', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/godwillcodes/', label: 'LinkedIn' },
  { icon: FileText, href: 'https://iamgodwillb.medium.com/', label: 'Medium' },
]

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) return
    
    setIsSubmitting(true)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setIsSuccess(false), 4000)
    }, 1500)
  }

  return (
    <section id="contact" ref={sectionRef} className="relative pt-8 bg-white overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="mb-12">
              <motion.div 
                className="inline-block mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.02]">
                  <span className="text-xs font-medium tracking-wider uppercase text-black/60">
                    Get in Touch
                  </span>
                </div>
              </motion.div>
              
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-black mb-6 leading-[1.1]">
                Let's Talk
              </h2>
              
              <p className="text-xl sm:text-2xl text-black/50 leading-relaxed font-light">
                Have a project in mind? Let's discuss how we can work together.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6 mb-12">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <motion.a
                    key={method.label}
                    href={method.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="group flex items-center gap-4 text-black/60 hover:text-black transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl border border-black/10 flex items-center justify-center group-hover:border-black/20 group-hover:bg-black/[0.02] transition-all duration-300">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-xs font-medium tracking-wider uppercase text-black/40 mb-1">
                        {method.label}
                      </div>
                      <div className="text-base font-light">
                        {method.value}
                      </div>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-xs font-medium tracking-wider uppercase text-black/40 mb-4">
                Connect
              </div>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        delay: 0.6 + index * 0.05,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="w-11 h-11 rounded-2xl border border-black/10 flex items-center justify-center text-black/40 hover:text-black hover:border-black/20 hover:bg-black/[0.02] transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black/60 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-black/10 text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black/60 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-black/10 text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black/60 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-black/10 text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: isSubmitting || isSuccess ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting || isSuccess ? 1 : 0.99 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-black text-white text-lg font-medium rounded-2xl hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={20} strokeWidth={2} />
                    <span>Message sent</span>
                  </>
                ) : (
                  <>
                    <Send size={20} strokeWidth={2} />
                    <span>Send message</span>
                  </>
                )}
              </motion.button>

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-black/5 border border-black/10"
                >
                  <p className="text-sm text-black/60 font-light">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}