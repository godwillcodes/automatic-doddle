'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { site } from '@/lib/site'

/**
 * The console chrome: a fixed left rail carrying the mark and the identity
 * links, and a sticky topbar carrying navigation and the Nairobi clock.
 *
 * The clock is not decoration. The site's whole claim is that these systems
 * are operated from here, live — a second hand ticking in EAT says so
 * without a word of copy. It renders as placeholders on the server and fills
 * in after hydration, so the markup never disagrees with itself.
 */

const NAV = [
  { label: 'Operating', href: '/#operating' },
  { label: 'Writing', href: '/blog' },
  { label: 'Record', href: '/#record' },
  { label: 'Contact', href: '/contact' },
]

const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.76-1.95C21.6 8.69 23 10.9 23 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.53-2.3 3.1V21h-4V9Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 4.86a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.5 6.9a3 3 0 0 0-2.1-2.13C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.4.52A3 3 0 0 0 .5 6.9C0 8.8 0 12 0 12s0 3.2.5 5.1a3 3 0 0 0 2.1 2.13c1.9.52 9.4.52 9.4.52s7.5 0 9.4-.52a3 3 0 0 0 2.1-2.13C24 15.2 24 12 24 12s0-3.2-.5-5.1ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
    </svg>
  ),
} as const

const RAIL_SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/godwillcodes', icon: ICONS.github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/godwillcodes/', icon: ICONS.linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/realgodwillbarasa/', icon: ICONS.instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@realgodwillbarasa', icon: ICONS.youtube },
]

function NairobiClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const paint = () => setTime(fmt.format(new Date()))
    paint()
    const id = setInterval(paint, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="meta flex items-center gap-2.5 whitespace-nowrap">
      <span className="co-dot" aria-hidden="true" />
      <span>
        Nairobi{' '}
        <b className="meta-ink font-medium" suppressHydrationWarning>
          {time ?? '--:--:--'}
        </b>{' '}
        EAT
      </span>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <aside className="co-rail no-print" aria-label="Site rail">
        <Link className="co-rail-mark" href="/">
          {site.name}
        </Link>

        <div className="flex flex-col items-center gap-3.5" aria-hidden="true">
          <span className="co-rail-line" />
          <span className="co-dot" title="Platforms in production" />
          <span className="co-rail-line up" />
        </div>

        <div className="co-rail-social">
          {RAIL_SOCIAL.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} rel="me noopener" target="_blank">
              {s.icon}
            </a>
          ))}
        </div>
      </aside>

      <header className="co-topbar co-page no-print">
        <nav className="meta" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <NairobiClock />
      </header>
    </>
  )
}
