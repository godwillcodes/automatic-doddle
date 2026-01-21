'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Linkedin, ArrowUpRight, FileText } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Skills', href: '/skills' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    social: [
      { label: 'GitHub', href: 'https://github.com/godwillcodes', icon: Github },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/godwillcodes/', icon: Linkedin },
      { label: 'Medium', href: 'https://iamgodwillb.medium.com/', icon: FileText },
    ],
  }

  return (
    <footer className="relative bg-white border-t border-black/5">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black_20%,transparent_70%)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-0 py-12">
        <div className="flex justify-between items-center">
          {/* Social links */}
          <div className="flex gap-3">
            {footerLinks.social.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05,
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

          {/* Copyright */}
          <p className="text-lg text-black/30 font-light">
            © 2026 Godwill Barasa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}