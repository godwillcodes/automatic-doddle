/**
 * The Studio is mounted inside the Next app so editing and the site deploy
 * together. It must never be indexed.
 */
import { NextStudio } from 'next-sanity/studio'
import type { Metadata, Viewport } from 'next'

import config from '@/sanity.config'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
