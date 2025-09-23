import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.com'
  const articles = await getAllArticles()

  const staticPages = [
    '',
    '/about',
    '/articles',
    '/projects',
    '/speaking',
    '/uses',
  ]

  const articlePages = articles.map((article) => `/articles/${article.slug}`)

  const allPages = [...staticPages, ...articlePages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      const url = `${baseUrl}${page}`
      const lastmod = page.startsWith('/articles/') 
        ? articles.find(a => a.slug === page.replace('/articles/', ''))?.date || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.startsWith('/articles/') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/articles/') ? '0.8' : '0.6'}</priority>
  </url>`
    })
    .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
