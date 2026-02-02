'use client'

import { useState, useRef, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Terminal } from 'lucide-react'

interface CodeBlockProps {
  children: ReactNode
  className?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export default function CodeBlock({ 
  children, 
  className = '',
  filename,
  showLineNumbers = false,
  highlightLines = []
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  // Extract language from className (e.g., "language-typescript")
  const language = className.replace(/language-/, '') || 'text'

  const handleCopy = async () => {
    if (preRef.current) {
      const code = preRef.current.textContent || ''
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative my-8 rounded-xl border border-black/10 bg-[#fafafa] overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-black/[0.02]">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          
          {/* Filename or language */}
          <div className="flex items-center gap-2 text-xs text-black/50 font-mono">
            {filename ? (
              <span className="font-medium text-black/70">{filename}</span>
            ) : (
              <>
                <Terminal size={14} strokeWidth={2} />
                <span>{language}</span>
              </>
            )}
          </div>
        </div>

        {/* Copy button */}
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-black/50 hover:text-black/70 hover:bg-black/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 text-emerald-600"
              >
                <Check size={14} strokeWidth={2} />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <Copy size={14} strokeWidth={2} />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Code content */}
      <div className="relative overflow-x-auto">
        <pre
          ref={preRef}
          className={`p-4 text-sm leading-relaxed font-mono ${showLineNumbers ? 'pl-12' : ''}`}
        >
          {children}
        </pre>
      </div>
    </motion.div>
  )
}

// Pre component wrapper for MDX
interface PreChildProps {
  className?: string
  'data-filename'?: string
  children?: ReactNode
}

export function Pre({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  // Check if the child is a code element with props
  const childElement = children as React.ReactElement<PreChildProps> | undefined
  const childProps = childElement?.props || {}
  const className = childProps.className || ''
  const filename = childProps['data-filename']
  
  return (
    <CodeBlock 
      className={className}
      filename={filename}
      {...props}
    >
      {childProps.children || children}
    </CodeBlock>
  )
}

// Inline code component
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-black/[0.06] text-black/90 text-[0.9em] font-mono before:content-none after:content-none">
      {children}
    </code>
  )
}
