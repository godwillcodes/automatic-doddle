#!/usr/bin/env node
/**
 * SEO / AISEO audit of the built site.
 *
 * Runs against .next/server/app after `next build` and checks the rendered
 * HTML — not the source — for the class of problem an outside reviewer found
 * in Oct 2026 and we had not: five job titles for one person, a worksFor @id
 * nobody could resolve, an H1 whose text read "GodwillBarasa", a redirect
 * where the biography should be, counts on one screen that disagreed.
 *
 * Every check here is one of those, or the next one like it. The script is
 * deliberately dependency-free so it runs anywhere the build does.
 *
 *   node scripts/seo-audit.mjs            # report, exit 1 on any error
 *   node scripts/seo-audit.mjs --quiet    # errors only
 *
 * Severities:
 *   error  — ships something wrong. Fails the run.
 *   warn   — below the bar we set ourselves. Does not fail the run.
 *   note   — editorial or judgement; surfaced so it is not forgotten.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const OUT = join(ROOT, '.next/server/app')
const SITE = 'https://www.godwillbarasa.com'
const QUIET = process.argv.includes('--quiet')

/* ── what the site declares about itself ─────────────────────── */

/**
 * Read from lib/site.ts rather than hard-coded, so the audit cannot drift
 * from the thing it audits. A regex on the source is enough: the value is a
 * single-quoted literal.
 */
const siteSrc = readFileSync(join(ROOT, 'lib/site.ts'), 'utf8')
const CANONICAL_TITLE = /jobTitle:\s*'([^']+)'/.exec(siteSrc)?.[1]
if (!CANONICAL_TITLE) throw new Error('could not read jobTitle from lib/site.ts')

/** Routes that exist but are not prerendered HTML. */
const DYNAMIC_ROUTES = new Set([
  '/studio',
  '/sitemap.xml',
  '/robots.txt',
  '/opengraph-image',
  '/feed.xml',
  '/llms.txt',
  '/manifest.webmanifest',
])

/* ── findings ─────────────────────────────────────────────────── */

const findings = []
const add = (severity, page, check, detail) => findings.push({ severity, page, check, detail })
const error = (p, c, d) => add('error', p, c, d)
const warn = (p, c, d) => add('warn', p, c, d)
const note = (p, c, d) => add('note', p, c, d)

/* ── helpers ──────────────────────────────────────────────────── */

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (name.endsWith('.html')) out.push(full)
  }
  return out
}

const attr = (tag, name) => new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1]
const all = (html, re) => [...html.matchAll(re)]
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#x27;|&rsquo;/g, '’').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')

function pathOf(file) {
  const rel = '/' + relative(OUT, file).replace(/\.html$/, '')
  return rel === '/index' ? '/' : rel
}

/* ── per-page checks ──────────────────────────────────────────── */

const pages = walk(OUT)
  .map((file) => ({ file, path: pathOf(file), html: readFileSync(file, 'utf8') }))
  .filter((p) => !p.path.startsWith('/_')) // _not-found and _global-error are checked separately

const titles = new Map()
const descriptions = new Map()
let profilePages = 0
const jobTitlesSeen = new Set()

for (const page of pages) {
  const { path, html } = page
  const head = /<head>([\s\S]*?)<\/head>/.exec(html)?.[1] ?? ''
  const main = /<main[\s\S]*?<\/main>/.exec(html)?.[0] ?? html

  /* title */
  const titleTags = all(head, /<title>([\s\S]*?)<\/title>/g)
  if (titleTags.length !== 1) error(path, 'title', `${titleTags.length} <title> tags`)
  const title = decode(titleTags[0]?.[1] ?? '')
  if (!title) error(path, 'title', 'missing')
  if (title.length > 60) warn(path, 'title', `${title.length} chars, will truncate in results: "${title}"`)
  if (title.includes(' | ')) warn(path, 'title', `uses " | " — lib/site.ts declares the middle dot as the one separator`)
  if (titles.has(title)) error(path, 'title', `duplicate of ${titles.get(title)}: "${title}"`)
  titles.set(title, path)

  /* description */
  const desc = decode(attr(/<meta name="description"[^>]*>/.exec(head)?.[0] ?? '', 'content') ?? '')
  if (!desc) error(path, 'description', 'missing')
  else {
    if (desc.length < 70) warn(path, 'description', `${desc.length} chars, short`)
    if (desc.length > 160) warn(path, 'description', `${desc.length} chars, will truncate`)
    if (descriptions.has(desc)) error(path, 'description', `duplicate of ${descriptions.get(desc)}`)
    descriptions.set(desc, path)
  }

  /* canonical */
  const canonical = attr(/<link rel="canonical"[^>]*>/.exec(head)?.[0] ?? '', 'href')
  if (!canonical) error(path, 'canonical', 'missing')
  else {
    const expected = path === '/' ? SITE : `${SITE}${path}`
    if (canonical !== expected) error(path, 'canonical', `${canonical} — expected ${expected}`)
  }

  /* robots meta — the review found two on the 404 */
  const robotsTags = all(head, /<meta name="robots"[^>]*>/g).map((m) => attr(m[0], 'content'))
  if (robotsTags.length > 1) error(path, 'robots', `${robotsTags.length} robots meta tags: ${robotsTags.join(' / ')}`)

  /* H1 */
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((m) => text(m[1]))
  if (h1s.length !== 1) error(path, 'h1', `${h1s.length} H1s: ${h1s.map((h) => `"${h}"`).join(', ')}`)
  for (const h1 of h1s) {
    // "GodwillBarasa": two words glued because the spans had no whitespace.
    // Only a single-token H1 with an internal capital — PixelPress and
    // WhatsApp in a sentence are names, not a bug.
    if (!/\s/.test(h1) && /^[A-Z][a-z]+[A-Z][a-z]+/.test(h1)) error(path, 'h1', `words run together: "${h1}"`)
  }

  /* Open Graph / Twitter */
  const og = (p) => attr(new RegExp(`<meta property="${p}"[^>]*>`).exec(head)?.[0] ?? '', 'content')
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!og(p)) error(path, 'og', `${p} missing`)
  if (og('og:url') && canonical && og('og:url') !== canonical) warn(path, 'og', `og:url ${og('og:url')} ≠ canonical`)
  if (og('og:image') && !/^https?:\/\//.test(og('og:image'))) error(path, 'og', `og:image is relative: ${og('og:image')}`)
  if (og('og:type') === 'profile' && !og('profile:first_name')) warn(path, 'og', 'og:type profile with no profile:* fields')
  if (!attr(/<meta name="twitter:card"[^>]*>/.exec(head)?.[0] ?? '', 'content')) warn(path, 'twitter', 'twitter:card missing')
  if (!/<link rel="alternate" type="application\/rss\+xml"/.test(head)) warn(path, 'feed', 'page does not advertise the RSS feed')
  const ogAlt = og('og:image:alt')
  // Only a title-shaped alt is held to the canonical title; "web engineering"
  // in a description of the blog is not a job title.
  if (ogAlt && /\b(?:Senior|Software|Web|Front[- ]End)\s+(?:\w+\s+)?Engineer\b/.test(ogAlt) && !ogAlt.includes(CANONICAL_TITLE))
    error(path, 'og', `og:image:alt carries a different title: "${ogAlt}"`)

  /* JSON-LD */
  const ldScripts = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
  if (ldScripts.length !== 1) error(path, 'jsonld', `${ldScripts.length} JSON-LD scripts (one @graph per page)`)
  for (const [, raw] of ldScripts) {
    let graph
    try {
      graph = JSON.parse(raw.replace(/\\u003c/g, '<'))
    } catch (e) {
      error(path, 'jsonld', `does not parse: ${e.message}`)
      continue
    }
    const nodes = graph['@graph'] ?? [graph]
    const defined = new Set(nodes.map((n) => n['@id']).filter(Boolean))
    const referenced = []
    const seenTypes = []

    const visit = (v, parentKey) => {
      if (Array.isArray(v)) return v.forEach((x) => visit(x, parentKey))
      if (!v || typeof v !== 'object') return
      const keys = Object.keys(v)
      if (keys.length === 1 && keys[0] === '@id') return referenced.push([v['@id'], parentKey])
      if (v['@type']) seenTypes.push(v['@type'])
      for (const k of keys) visit(v[k], k)
    }
    nodes.forEach((n) => visit(n, 'graph'))

    // Dangling references: the worksFor @id on another domain was one of these.
    for (const [id, via] of referenced)
      if (!defined.has(id)) error(path, 'jsonld', `@id referenced via ${via} but not defined in this graph: ${id}`)

    for (const n of nodes) {
      if (n['@type'] === 'ProfilePage') profilePages++
      if (n['@type'] === 'Person') {
        if (n.jobTitle) jobTitlesSeen.add(n.jobTitle)
        if (n.jobTitle !== CANONICAL_TITLE) error(path, 'entity', `Person.jobTitle "${n.jobTitle}" ≠ "${CANONICAL_TITLE}"`)
        // The Role convention: a Role's inner property repeats the outer one.
        for (const r of [n.worksFor].flat().filter(Boolean))
          if (/Role$/.test(r['@type'] ?? '') && !r.worksFor) error(path, 'jsonld', `${r['@type']} under worksFor has no inner worksFor`)
        if (n.hasOccupation && [n.hasOccupation].flat().some((o) => o['@type'] !== 'Occupation'))
          error(path, 'jsonld', 'hasOccupation must be an Occupation')
      }
      if (n['@type'] === 'BlogPosting') {
        if (!n.datePublished) error(path, 'article', 'BlogPosting without datePublished')
        if (!n.dateModified) error(path, 'article', 'BlogPosting without dateModified')
        if (n.dateModified && n.datePublished && n.dateModified < n.datePublished)
          error(path, 'article', `dateModified ${n.dateModified} before datePublished ${n.datePublished}`)
        if (!n.author) error(path, 'article', 'BlogPosting without author')
        if (!n.image) warn(path, 'article', 'BlogPosting without image')
      }
      if (n['@type'] === 'ImageObject' && !n.creditText) warn(path, 'image', `ImageObject without creditText: ${n.url ?? n['@id']}`)
    }
  }

  /* images */
  for (const [img] of all(main, /<img[^>]*>/g))
    if (!/\balt="/.test(img)) error(path, 'img', `<img> with no alt: ${attr(img, 'src')}`)

  /* internal links resolve to something that exists */
  for (const [a] of all(html, /<a [^>]*href="(\/[^"#?]*)[^"]*"[^>]*>/g)) {
    const href = /href="(\/[^"#?]*)/.exec(a)[1].replace(/\/$/, '') || '/'
    if (href.startsWith('//')) continue
    const asFile = href === '/' ? join(OUT, 'index.html') : join(OUT, `${href}.html`)
    const dynamic = [...DYNAMIC_ROUTES].some((d) => href === d || href.startsWith(`${d}/`))
    if (!existsSync(asFile) && !dynamic) error(path, 'link', `internal link to a page that is not built: ${href}`)
  }

  /* writing tells the review measured — notes only, this is judgement */
  if (path.startsWith('/blog/')) {
    const prose = text(main.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, ''))
    const contrasts = (prose.match(/\bnot\b[^.;]{2,60}?[,;:—]\s*(?:it is|it’s|but|they are|that is)\b/gi) ?? []).length
    if (contrasts > 1) note(path, 'writing', `${contrasts} "not X, it is Y" contrasts (review: max one per post)`)
    const pronouns = (prose.match(/\b(?:nobody|somebody|anybody|everybody)\b/gi) ?? []).length
    if (pronouns > 2) note(path, 'writing', `${pronouns}× nobody/somebody/anybody/everybody (review: under 2)`)
    if (/m-?pesa|daraja/i.test(path) && !/developer\.safaricom\.co\.ke|daraja/i.test(all(main, /href="(https?:[^"]+)"/g).map((m) => m[1]).join(' ')))
      note(path, 'citation', 'M-Pesa post with no link to Safaricom’s Daraja documentation')
    if (!/<table/.test(main)) note(path, 'structure', 'no table (review: one table or diagram per post)')
  }
}

/* ── sitewide checks ──────────────────────────────────────────── */

if (profilePages !== 1) error('site', 'entity', `${profilePages} ProfilePage nodes across the site — one person, one profile`)
if (jobTitlesSeen.size > 1) error('site', 'entity', `Person.jobTitle differs between pages: ${[...jobTitlesSeen].join(' / ')}`)

/* the visible title must agree with the schema */
const variants = new Set()
for (const { html } of pages)
  for (const m of all(text(html), /\b(Senior (?:Web|Software|Front[- ]End) Engineer|Software Engineer, Nairobi)\b/g)) variants.add(m[1])
for (const v of variants)
  if (!v.includes(CANONICAL_TITLE) && !/Front[- ]End/.test(v)) warn('site', 'entity', `visible text carries another title: "${v}"`)

/* 404 */
const notFound = join(OUT, '_not-found.html')
if (existsSync(notFound)) {
  const html = readFileSync(notFound, 'utf8')
  const robots = all(html, /<meta name="robots"[^>]*>/g).map((m) => attr(m[0], 'content'))
  if (robots.length !== 1) error('/404', 'robots', `${robots.length} robots meta tags: ${robots.join(' / ')}`)
  else if (!/noindex/.test(robots[0])) error('/404', 'robots', `404 is indexable: ${robots[0]}`)
}

/* sitemap vs built pages */
const sitemapBody = join(OUT, 'sitemap.xml.body')
if (!existsSync(sitemapBody)) error('/sitemap.xml', 'sitemap', 'not in the build output')
else {
  const xml = readFileSync(sitemapBody, 'utf8')
  const locs = new Set(all(xml, /<loc>([^<]+)<\/loc>/g).map((m) => m[1].replace(SITE, '') || '/'))
  for (const { path } of pages) if (!locs.has(path)) error(path, 'sitemap', 'built page missing from sitemap')
  for (const loc of locs) {
    const asFile = loc === '/' ? join(OUT, 'index.html') : join(OUT, `${loc}.html`)
    if (!existsSync(asFile)) error('/sitemap.xml', 'sitemap', `lists a page that is not built: ${loc}`)
  }
  for (const [, mod] of all(xml, /<lastmod>([^<]+)<\/lastmod>/g))
    if (Number.isNaN(Date.parse(mod))) error('/sitemap.xml', 'sitemap', `unparseable lastmod: ${mod}`)
}

/* robots.txt */
const robotsBody = join(OUT, 'robots.txt.body')
if (!existsSync(robotsBody)) error('/robots.txt', 'robots', 'not in the build output')
else if (!/Sitemap:\s*https?:\/\//.test(readFileSync(robotsBody, 'utf8'))) error('/robots.txt', 'robots', 'no Sitemap: line')

/* feed */
if (!existsSync(join(OUT, 'feed.xml.body')) && !existsSync(join(OUT, 'rss.xml.body')))
  warn('site', 'feed', 'no /feed.xml — aggregators and some AI crawlers discover by feed')

/* ── report ───────────────────────────────────────────────────── */

const order = { error: 0, warn: 1, note: 2 }
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.page.localeCompare(b.page))

const counts = { error: 0, warn: 0, note: 0 }
for (const f of findings) counts[f.severity]++

const mark = { error: '✗', warn: '△', note: '·' }
let lastSeverity
for (const f of findings) {
  if (QUIET && f.severity !== 'error') continue
  if (f.severity !== lastSeverity) {
    console.log(`\n${f.severity.toUpperCase()}`)
    lastSeverity = f.severity
  }
  console.log(`  ${mark[f.severity]} ${f.page.padEnd(44)} ${f.check.padEnd(12)} ${f.detail}`)
}

console.log(`\n${pages.length} pages audited — ${counts.error} errors, ${counts.warn} warnings, ${counts.note} notes`)
if (counts.error) {
  console.log('Errors ship something wrong. Fix them before this deploys.')
  process.exit(1)
}
