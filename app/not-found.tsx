import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white">
      <div className="px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-black/40">
          404
        </p>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
          That page doesn&apos;t exist
        </h1>
        <p className="mx-auto mb-10 max-w-md text-base font-light text-black/50">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-black/90"
          >
            Go home
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-black/10 px-6 py-3 text-base font-medium text-black/70 transition-colors hover:border-black/25 hover:text-black"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  )
}
