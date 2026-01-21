'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import DownloadCVModal from './DownloadCVModal'

const navItems = [
  { name: 'Skills', href: '/skills' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl' 
            : 'bg-white'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xl font-semibold tracking-tight text-black transition-colors duration-300 group-hover:text-black/70"
              >
                Godwill Barasa
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05 + 0.2,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <Link
                    href={item.href}
                    className="relative group px-4 py-2 text-lg font-medium transition-colors duration-300"
                  >
                    <span className="relative z-10 transition-colors duration-300 text-black/50 group-hover:text-black">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Download CV Button - Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: navItems.length * 0.05 + 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="hidden md:block"
            >
              <motion.button
                onClick={() => setIsCVModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-full bg-black text-white text-lg font-medium hover:bg-black/90 transition-all duration-300 flex items-center gap-2"
              >
                <Download size={16} strokeWidth={2} />
                <span>Download CV</span>
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl text-black/60 hover:text-black hover:bg-black/5 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} strokeWidth={2} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} strokeWidth={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 top-20 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-xl"
              >
                <div className="px-6 py-8 space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 text-black/50 hover:bg-black/5 hover:text-black"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Download CV Button */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      delay: navItems.length * 0.05,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="pt-4"
                  >
                    <button
                      onClick={() => {
                        setIsCVModalOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-black text-white text-base font-medium flex items-center justify-center gap-2 hover:bg-black/90 transition-all duration-300"
                    >
                      <Download size={18} strokeWidth={2} />
                      <span>Download CV</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Spacer */}
      <div className="h-20" />
      
      {/* Download CV Modal */}
      <DownloadCVModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
      />
    </>
  )
}