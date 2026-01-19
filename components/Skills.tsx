'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Code, Layout, Zap, FlaskConical, Server, BarChart3, Wrench, FileText } from 'lucide-react'

const skillGroups = [
  {
    title: 'Frontend Core',
    icon: Code,
    skills: ['React.js', 'Next.js (SSR, SSG, dynamic routing)', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3'],
  },
  {
    title: 'Architecture & Design',
    icon: Layout,
    skills: ['Component-driven UI architecture', 'Responsive design', 'Accessibility', 'Design systems'],
  },
  {
    title: 'Performance',
    icon: Zap,
    skills: ['Performance profiling', 'Core Web Vitals optimization', 'Code splitting', 'Memoization', 'Lazy loading'],
  },
  {
    title: 'Experimentation',
    icon: FlaskConical,
    skills: ['Feature flags', 'A/B testing', 'Product experimentation', 'Data visualization', 'Collaborative UI'],
  },
  {
    title: 'Infrastructure',
    icon: Server,
    skills: ['Monorepo workflows (Nx / Turborepo)', 'Vite', 'Webpack', 'Docker', 'Kubernetes', 'AWS', 'Serverless patterns'],
  },
  {
    title: 'Observability',
    icon: BarChart3,
    skills: ['Observability (logging, monitoring, alerting, dashboards)', 'Metrics & performance monitoring', 'Incident resolution', 'Lighthouse & static asset analysis'],
  },
  {
    title: 'Development Tools',
    icon: Wrench,
    skills: ['Storybook', 'GitHub Actions', 'CI/CD pipelines', 'Preview environments', 'GTM / GA4 / Meta Pixel'],
  },
  {
    title: 'Process',
    icon: FileText,
    skills: ['Technical design documentation', 'Customer-focused iteration'],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section 
      id="skills" 
      ref={sectionRef} 
      className="relative  lg:pb-20 bg-white overflow-hidden"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24"
        >
          <motion.div 
            className="inline-block mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.02]">
              <span className="text-xs font-medium tracking-wider uppercase text-black/60">
                Expertise
              </span>
            </div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black mb-6 leading-[1.1]">
            Skills & Capabilities
          </h2>
          
          <p className="text-lg sm:text-xl text-black/50 max-w-2xl leading-relaxed font-light">
            A comprehensive foundation in modern web development, infrastructure, and product thinking.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5">
          {skillGroups.map((group, groupIndex) => {
            const Icon = group.icon
            return (
              <SkillCard
                key={group.title}
                group={group}
                icon={Icon}
                index={groupIndex}
                isInView={isInView}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SkillCard({
  group,
  icon: Icon,
  index,
  isInView,
}: {
  group: typeof skillGroups[0]
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
  index: number
  isInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const opacity = useTransform(
    mouseX,
    (x) => {
      const y = mouseY.get()
      const distance = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2))
      return Math.max(0, 1 - distance * 2)
    }
  )

  const springConfig = { stiffness: 200, damping: 30 }
  const smoothOpacity = useSpring(opacity, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.05,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white"
    >
      {/* Hover gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ opacity: smoothOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full p-8 lg:p-10">
        {/* Icon */}
        <motion.div
          className="mb-8"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="w-11 h-11 rounded-2xl border border-black/10 bg-white flex items-center justify-center group-hover:border-black/20 transition-colors duration-500">
            <Icon size={20} className="text-black" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-sm font-medium tracking-wide uppercase text-black/40 mb-6 group-hover:text-black/60 transition-colors duration-500">
          {group.title}
        </h3>

        {/* Skills list */}
        <ul className="space-y-3">
          {group.skills.map((skill, skillIndex) => (
            <motion.li
              key={skill}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: index * 0.05 + skillIndex * 0.03 + 0.2,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[15px] text-black/70 leading-relaxed font-normal group-hover:text-black/90 transition-colors duration-300"
            >
              {skill}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Bottom border that appears on hover */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-black origin-left"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 0.1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  )
}