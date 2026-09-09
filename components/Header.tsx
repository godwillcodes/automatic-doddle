'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { site } from '@/lib/site'
import { GitHubIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '@/components/icons'

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

// Icons live in components/icons.tsx, shared with the footer.

const RAIL_SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/godwillcodes', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/godwillcodes/', icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/realgodwillbarasa/', icon: InstagramIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@realgodwillbarasa', icon: YouTubeIcon },
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
    <div className="co-clock meta flex items-center gap-2.5 whitespace-nowrap">
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
        <div className="co-topbar-in co-inner">
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
        </div>
      </header>
    </>
  )
}
