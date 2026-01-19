'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Twitter, Instagram, Github, Linkedin, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

type Photo = {
  id: number
  src: string
  alt: string
}

const photos: Photo[] = [
  { id: 1, src: '/header-images/1.jpg', alt: 'Photo 1' },
  { id: 2, src: '/header-images/2.jpg', alt: 'Photo 2' },
  { id: 3, src: '/header-images/3.jpg', alt: 'Photo 3' },
  { id: 4, src: '/header-images/4.jpg', alt: 'Photo 4' },
  { id: 5, src: '/header-images/5.jpg', alt: 'Photo 5' },
]

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-white flex items-center overflow-hidden"
    >
      {/* Ultra-subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,black_40%,transparent_80%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 sm:px-8 lg:px-12 py-20 lg:py-24">
        <div className="max-w-7xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.02]">
              <span className="text-xs font-medium tracking-wider uppercase text-black/50">
                Web Applications Developer
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] mb-12 text-black"
          >
            <span itemProp="name">Meet Godwill Barasa</span>,{' '}
            <span className="text-black/40" itemProp="jobTitle">Web Applications Developer building high-performance digital assets at</span>{' '}
            <span itemProp="worksFor">Piedmont Global</span>.
          </motion.h1>

          {/* Bio paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-base sm:text-lg leading-relaxed text-black/60 font-light mb-16"
          >
            <p>
              I build application layers that move product media, licensing metadata, and multilingual content across global publishing networks. The work integrates DAM-as-a-Service systems, modern WordPress-to-React pipelines, and performance observability to keep every asset fast, traceable, and distribution-ready.
            </p>

            <p>
              At Piedmont Global, I architect enterprise WordPress-Next.js delivery pipelines, model scalable taxonomies, and automate content supply chains that support international volume while maintaining Core Web Vitals compliance and strict data governance.
            </p>

           
          </motion.div>

          {/* Photo Gallery */}
          <PhotoGallery photos={photos} isInView={isInView} />

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 mb-12"
          >
            <Link href="/blog">
              <motion.div
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-black/10 hover:border-black/20 bg-white hover:bg-black/2 transition-all duration-300"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base font-medium text-black/70">Read my articles</span>
                <ArrowRight size={18} strokeWidth={2} className="text-black/40" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mt-12"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: 0.6 + index * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-2xl border border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.02] transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon size={18} className="text-black/60" strokeWidth={1.5} />
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PhotoGallery({ photos, isInView }: { photos: Photo[]; isInView: boolean }) {
  const galleryRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={galleryRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex flex-wrap gap-3">
        {photos.map((photo: Photo, index: number) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.5 + index * 0.06,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-black/10 bg-black/5"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 112px, 128px"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}