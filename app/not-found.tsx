import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 sm:px-8">
      <p className="meta">
        <span className="meta-accent">404</span>
        <span aria-hidden="true">{'  —  '}</span>
        Not in the record
      </p>
      <h1 className="display mt-6 max-w-3xl text-[clamp(2.4rem,7vw,5.5rem)]">
        That page doesn&apos;t exist.
      </h1>
      <p className="prose-body mt-6">
        The link may be out of date, or the page may have moved.
      </p>
      <div className="mt-10 flex flex-wrap gap-8">
        <Link href="/" className="meta meta-ink">
          The record <span className="text-accent-lo">→</span>
        </Link>
        <Link href="/blog" className="meta meta-ink">
          Field notes <span className="text-accent-lo">→</span>
        </Link>
      </div>
    </div>
  )
}
