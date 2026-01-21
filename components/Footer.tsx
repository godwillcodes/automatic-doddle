'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Linkedin, ArrowUpRight } from 'lucide-react'

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
    ],
  }

  return (
    <footer className="relative bg-white border-t border-black/5">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black_20%,transparent_70%)]" />
      
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-20 lg:py-32">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 mb-20">
          {/* Brand - Takes more space */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black">
                Godwill Barasa
              </h3>
              <p className="text-lg text-black/50 font-light leading-relaxed max-w-md">
                Architecting high-performance content delivery systems and building for scale.
              </p>
            </div>
            
            {/* Social links - Integrated into brand section */}
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
          </div>

          {/* Navigation - Compact, right-aligned */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="inline-block mb-6">
              <div className="px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.02]">
                <span className="text-xs font-medium tracking-wider uppercase text-black/40">
                  Navigate
                </span>
              </div>
            </div>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-base text-black/50 hover:text-black transition-colors duration-300 font-light"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight 
                      size={14} 
                      strokeWidth={2}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" 
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <p className="text-sm text-black/30 font-light">
              © {currentYear} Godwill Barasa. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link
                href="/privacy"
                className="text-sm text-black/30 hover:text-black/60 transition-colors duration-300 font-light"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-black/30 hover:text-black/60 transition-colors duration-300 font-light"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}