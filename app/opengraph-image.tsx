import { ImageResponse } from 'next/og'

export const alt = 'Godwill Barasa — Senior Web Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#f4f2ed',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#101012',
          }}
        >
          Godwill Barasa
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '24px',
            fontSize: 40,
            lineHeight: 1.3,
            color: '#5f5c56',
            maxWidth: '900px',
          }}
        >
          Senior Web Engineer — React, Next.js, TypeScript, Laravel and WordPress
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '56px',
            fontSize: 28,
            color: '#5f5c56',
          }}
        >
          godwillbarasa.com
        </div>
      </div>
    ),
    size
  )
}
