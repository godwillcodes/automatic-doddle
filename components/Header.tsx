'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { contact } from '@/lib/record'

const NAV = [
  { index: '01', label: 'Work', href: '/#work' },
  { index: '02', label: 'Experience', href: '/#experience' },
  { index: '03', label: 'Open Source', href: '/#lab' },
  { index: '04', label: 'Writing', href: '/blog' },
  { index: '05', label: 'About', href: '/about' },
  { index: '06', label: 'Contact', href: '/contact' },
]

const SOCIAL = [
  { label: 'GitHub', href: contact.github.href },
  { label: 'LinkedIn', href: contact.linkedin.href },
  { label: 'Medium', href: contact.medium.href },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const pathname = usePathname()
  // The overlay closes on route change by construction: it is only open for
  // the pathname it was opened on. No effect, no cascading render.
  const open = openedAt === pathname
  const setOpen = useCallback(
    (next: boolean) => setOpenedAt(next ? pathname : null),
    [pathname]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes; body scroll freezes while the overlay is up.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  const isActive = useCallback(
    (href: string) => {
      if (href.startsWith('/#')) return false
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  return (
    <>
      <header
        className={`no-print sticky top-0 z-50 bg-paper transition-shadow duration-500 ${
          scrolled ? 'rule-b' : ''
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-baseline justify-between gap-6 px-6 py-4 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="display text-[1.05rem] tracking-tight">Godwill Barasa</span>
            <span className="meta hidden sm:inline">Senior Web Engineer</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-baseline gap-5 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="nav-link text-sm"
              >
                <span className="dot" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-index"
            className="meta meta-ink flex items-center gap-2 md:hidden"
          >
            Index
            <span aria-hidden="true" className="grid gap-[3px]">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen index */}
      <div
        id="site-index"
        role="dialog"
        aria-modal="true"
        aria-label="Site index"
        className={`on-ink fixed inset-0 z-[100] flex flex-col transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-editorial)' }}
      >
        <div className="flex items-baseline justify-between px-6 py-4 sm:px-8">
          <span className="meta meta-ink">Index</span>
          <button type="button" onClick={() => setOpen(false)} className="meta meta-ink">
            Close
          </button>
        </div>

        <nav aria-label="Site index" className="flex-1 overflow-y-auto px-6 sm:px-8">
          <ul>
            {NAV.map((item) => (
              <li key={item.href} className="rule-t">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-5 py-5"
                >
                  <span className="meta meta-accent">{item.index}</span>
                  <span className="display text-[clamp(1.9rem,7vw,3rem)]">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rule-t px-6 py-6 sm:px-8">
          <a href={`mailto:${contact.email}`} className="meta meta-ink block">
            {contact.email}
          </a>
          <div className="mt-3 flex gap-6">
            {SOCIAL.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="meta"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
