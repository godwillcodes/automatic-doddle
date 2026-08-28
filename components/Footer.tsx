import Link from 'next/link'

import { contact } from '@/lib/record'

const NAV = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Open Source', href: '/#lab' },
  { label: 'Writing', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="no-print rule-t bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-baseline md:justify-between">
          <div>
            <p className="display text-base">Godwill Barasa</p>
            <p className="meta mt-1">Senior Web Engineer · Nairobi / Remote</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link text-sm">
                <span className="dot" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="rule-t mt-8 flex flex-col gap-3 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${contact.email}`} className="meta meta-ink">
              {contact.email}
            </a>
            <a href={contact.github.href} target="_blank" rel="noopener noreferrer" className="meta">
              GitHub
            </a>
            <a href={contact.linkedin.href} target="_blank" rel="noopener noreferrer" className="meta">
              LinkedIn
            </a>
            <a href={contact.medium.href} target="_blank" rel="noopener noreferrer" className="meta">
              Medium
            </a>
          </div>
          <p className="meta">© {year} Godwill Barasa</p>
        </div>
      </div>
    </footer>
  )
}
