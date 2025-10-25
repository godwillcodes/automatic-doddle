import { getAllArticles } from '@/lib/articles'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'
  const articles = await getAllArticles()
  const currentDate = new Date().toISOString().split('T')[0]

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'weekly', lastmod: currentDate },
    { path: '/about', priority: '0.9', changefreq: 'monthly', lastmod: currentDate },
    { path: '/articles', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { path: '/projects', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { path: '/speaking', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { path: '/uses', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { path: '/seo-dashboard', priority: '0.3', changefreq: 'monthly', lastmod: currentDate },
    { path: '/pwa-test', priority: '0.3', changefreq: 'monthly', lastmod: currentDate },
  ]

  // Article pages with dynamic data
  const articlePages = articles.map((article) => ({
    path: `/articles/${article.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: article.date,
    article: article
  }))

  const allPages = [...staticPages, ...articlePages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${allPages
    .map((page) => {
      const url = `${baseUrl}${page.path}`
      const isArticle = page.path.startsWith('/articles/')
      
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${isArticle ? `
    <image:image>
      <image:loc>${baseUrl}/images/portrait.jpg</image:loc>
      <image:title>${(page as any).article?.title || 'Article Image'}</image:title>
      <image:caption>${(page as any).article?.description || 'Article featured image'}</image:caption>
      <image:license>${baseUrl}</image:license>
    </image:image>
    <news:news>
      <news:publication>
        <news:name>Godwill Barasa</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${page.lastmod}</news:publication_date>
      <news:title>${(page as any).article?.title || ''}</news:title>
    </news:news>` : ''}
  </url>`
    })
    .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
      'X-Robots-Tag': 'index, follow',
    },
  })
}
