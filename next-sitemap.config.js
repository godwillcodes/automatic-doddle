/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: 'public',
  exclude: ['/404', '/500', '/_not-found', '/google-site-verification'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin/', '/api/', '/_next/', '/private/'] },
    ],
    // Only advertise the index sitemap; child sitemaps are discovered via it
  },
  transform: async (config, path) => {
    const priorityMap = {
      '/': 1.0,
      '/about': 0.9,
      '/articles': 0.8,
      '/projects': 0.7,
      '/speaking': 0.6,
      '/uses': 0.5,
      '/thank-you': 0.4,
      '/seo-dashboard': 0.3,
      '/pwa-test': 0.3,
    }

    const isWeekly = path === '/' || path === '/articles'

    return {
      loc: path,
      changefreq: isWeekly ? 'weekly' : 'monthly',
      priority: priorityMap[path] ?? 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },
  additionalPaths: async () => {
    // Collect article pages directly from MDX files without importing TS modules
    const fg = require('fast-glob')
    const fs = require('fs')
    const path = require('path')

    const cwd = path.join(process.cwd(), 'src/app/articles')
    const files = await fg('**/page.mdx', { cwd })

    const items = files.map((file) => {
      const full = path.join(cwd, file)
      const content = fs.readFileSync(full, 'utf8')
      // naive extraction of date from `export const article = { ... date: 'YYYY-MM-DD', ... }`
      const match = content.match(/date:\s*['\"](.*?)['\"]/)
      const date = match ? match[1] : new Date().toISOString().split('T')[0]
      const slug = file.replace(/\/page\.mdx$/, '')
      return {
        loc: `/articles/${slug}`,
        lastmod: date,
        changefreq: 'monthly',
        priority: 0.8,
      }
    })

    return items
  },
}


