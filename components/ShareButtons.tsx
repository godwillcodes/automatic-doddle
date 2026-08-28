'use client'

import { useState } from 'react'

import { useClientFeature } from '@/lib/use-client-feature'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
  compact?: boolean
}

export default function ShareButtons({ title, url, description, compact }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  // navigator doesn't exist on the server, so reading it during render would
  // guarantee a hydration mismatch React will not patch up.
  const canNativeShare = useClientFeature(() => 'share' in navigator)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const links = [
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(description ?? '')}%0A%0A${encodedUrl}`,
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable outside secure contexts; the URL bar still works.
    }
  }

  return (
    <div className={compact ? '' : 'flex flex-wrap items-baseline gap-x-8 gap-y-3'}>
      <p className="meta">{compact ? 'Share' : 'Share this article'}</p>
      <ul className={`flex gap-6 ${compact ? 'mt-3 flex-wrap' : 'flex-wrap'}`}>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="meta meta-ink transition-colors hover:text-accent-lo"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={handleCopy}
            className="meta meta-ink transition-colors hover:text-accent-lo"
          >
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
        </li>
        {canNativeShare ? (
          <li className="sm:hidden">
            <button
              type="button"
              onClick={() => {
                navigator.share({ title, text: description, url }).catch(() => {
                  // The user dismissed the share sheet. Not an error.
                })
              }}
              className="meta meta-ink transition-colors hover:text-accent-lo"
            >
              Share…
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
