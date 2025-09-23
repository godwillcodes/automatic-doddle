export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.com'
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin or private areas (if any)
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow all articles and public pages
Allow: /articles/
Allow: /about
Allow: /projects
Allow: /speaking
Allow: /uses

# Crawl delay (optional - be nice to servers)
Crawl-delay: 1`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
