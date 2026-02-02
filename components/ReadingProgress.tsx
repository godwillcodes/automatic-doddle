'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const handleScroll = () => {
      // Show progress bar after scrolling past the header (200px)
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/5"
    >
      <motion.div
        className="h-full bg-black origin-left"
        style={{ scaleX }}
      />
    </motion.div>
  )
}
