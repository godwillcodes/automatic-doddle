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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allPages
    .map((page) => {
      const url = `${baseUrl}${page}`
      const lastmod = page.startsWith('/articles/') 
        ? articles.find(a => a.slug === page.replace('/articles/', ''))?.date || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      
      const isArticle = page.startsWith('/articles/')
      const article = isArticle ? articles.find(a => a.slug === page.replace('/articles/', '')) : null
      
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${isArticle ? 'monthly' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : isArticle ? '0.8' : '0.6'}</priority>
    ${isArticle ? `<image:image>
      <image:loc>${baseUrl}/images/portrait.jpg</image:loc>
      <image:title>${article?.title || 'Article Image'}</image:title>
      <image:caption>${article?.description || 'Article featured image'}</image:caption>
    </image:image>` : ''}
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
