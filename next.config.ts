import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },

  compress: true,

  async redirects() {
    return [
      // One hostname. www is canonical because that is the URL the Lock &
      // Mercer entity asserts in its sameAs; the apex must not serve a second
      // copy of the same page. Explicit 301 rather than `permanent: true`,
      // which emits 308.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'godwillbarasa.com' }],
        destination: 'https://www.godwillbarasa.com/:path*',
        statusCode: 301,
      },
      // Routes retired in the person-entity restructure. Their content lives
      // on the homepage now; the redirect preserves whatever equity they had.
      { source: '/about', destination: '/', statusCode: 301 },
      { source: '/skills', destination: '/', statusCode: 301 },
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Security headers only. The previous config also sent
        // `Cache-Control: no-store` on `/:path*`, which matched the hashed
        // assets under /_next/static and made every visit re-download the
        // entire bundle. Caching is left to Next's own defaults, which are
        // correct per route type.
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
