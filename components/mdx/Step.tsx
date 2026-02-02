'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StepProps {
  number: number
  title: string
  children: ReactNode
}

interface StepsProps {
  children: ReactNode
}

export function Step({ number, title, children }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: number * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12 pb-8 last:pb-0"
    >
      {/* Vertical line */}
      <div className="absolute left-[15px] top-10 bottom-0 w-px bg-black/10 last:hidden" />

      {/* Step number */}
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
        {number}
      </div>

      {/* Content */}
      <div>
        <h4 className="font-semibold text-black mb-3 text-lg">{title}</h4>
        <div className="text-black/70 leading-relaxed [&>p]:m-0 [&>p:not(:last-child)]:mb-3 [&>pre]:my-4 [&>ul]:my-3 [&>ol]:my-3">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="my-8 py-2">
      {children}
    </div>
  )
}
