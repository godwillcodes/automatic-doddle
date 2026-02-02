'use client'

import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="my-6 rounded-xl border border-black/10 overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.02] transition-colors"
      >
        <span className="font-semibold text-black">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown size={20} className="text-black/40" strokeWidth={2} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 text-black/70 leading-relaxed border-t border-black/5 [&>p]:m-0 [&>p:not(:last-child)]:mb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Details/Summary alternative (HTML5 native feel)
interface DetailsProps {
  summary: string
  children: ReactNode
}

export function Details({ summary, children }: DetailsProps) {
  return <Accordion title={summary}>{children}</Accordion>
}
