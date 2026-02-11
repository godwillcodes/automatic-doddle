const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'
const contentDir = path.join(process.cwd(), 'content/blog')
const outPath = path.join(process.cwd(), 'public', 'sitemap.xml')

const staticRoutes = [
  { url: baseUrl, changefreq: 'weekly', priority: '1.0' },
  { url: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.8' },
  { url: `${baseUrl}/skills`, changefreq: 'monthly', priority: '0.9' },
  { url: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.9' },
  { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.7' },
]

function getBlogEntries() {
  if (!fs.existsSync(contentDir)) return []
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'))
  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const fullPath = path.join(contentDir, file)
    const { data } = matter(fs.readFileSync(fullPath, 'utf8'))
    const lastmod = data.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    }
  })
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlNode(entry) {
  const lastmod = entry.lastmod ? `\n  <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''
  return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${lastmod}
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`
}

const blogEntries = getBlogEntries()
const allEntries = [
  ...staticRoutes.map((r) => ({ ...r, lastmod: new Date().toISOString().slice(0, 10) })),
  ...blogEntries,
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(urlNode).join('\n')}
</urlset>
`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, xml, 'utf8')
console.log('Generated public/sitemap.xml with', allEntries.length, 'URLs')
