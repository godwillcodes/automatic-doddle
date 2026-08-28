import { ImageResponse } from 'next/og'

import { getPostBySlug, getPostSlugs } from '@/lib/sanity/queries'

export const alt = 'Article by Godwill Barasa'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

/**
 * Generated rather than uploaded. The previous setup referenced /og-image.png
 * and per-post /blog/*.jpg files that were never committed, so every social
 * preview resolved to a 404.
 */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  const title = post?.title ?? 'Godwill Barasa'
  const category = post?.category?.title ?? 'Writing'
  const readingTime = post?.readingTime

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              padding: '8px 20px',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '999px',
              fontSize: 22,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.55)',
            }}
          >
            {category}
          </div>
          {readingTime ? (
            <div style={{ display: 'flex', fontSize: 22, color: 'rgba(0,0,0,0.35)' }}>
              {readingTime} min read
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 60 : 72,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#000000',
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: '#000000' }}>
            Godwill Barasa
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: 'rgba(0,0,0,0.4)' }}>
            godwillbarasa.com
          </div>
        </div>
      </div>
    ),
    size
  )
}
