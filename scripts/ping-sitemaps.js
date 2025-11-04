// Ping search engines with the latest sitemap after build
// Works on Netlify/Node 18+ (global fetch available)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'
const sitemapIndexUrl = `${siteUrl.replace(/\/$/, '')}/sitemap.xml`

async function ping(url) {
  try {
    const res = await fetch(url, { method: 'GET' })
    const ok = res.ok
    const text = await res.text()
    console.log(`Pinged: ${url} → ${ok ? 'OK' : res.status}`)
    if (!ok) {
      console.log(text.slice(0, 300))
    }
  } catch (err) {
    console.error(`Ping failed: ${url}`)
    console.error(err.message)
  }
}

async function main() {
  console.log('Sitemap ping start')
  console.log(`Sitemap index: ${sitemapIndexUrl}`)

  const encoded = encodeURIComponent(sitemapIndexUrl)
  const targets = [
    `https://www.google.com/ping?sitemap=${encoded}`,
    `https://www.bing.com/ping?sitemap=${encoded}`,
  ]

  for (const target of targets) {
    // eslint-disable-next-line no-await-in-loop
    await ping(target)
  }

  console.log('Sitemap ping done')
}

main()


