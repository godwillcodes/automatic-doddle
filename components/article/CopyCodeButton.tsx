'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard is unavailable outside secure contexts; the code is still
      // selectable, so there is nothing useful to tell the reader here.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white/90"
      aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
    >
      {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
