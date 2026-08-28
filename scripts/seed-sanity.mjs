/**
 * Seeds Sanity from the markdown in content/articles.
 *
 * The markdown files are the initial import only — once this has run, Sanity
 * Studio is the source of truth. Re-running is safe: every document is upserted
 * against a deterministic _id derived from its slug, so edits made in Studio to
 * fields this script doesn't set are preserved, and re-seeding restores the
 * article body to what's in git.
 *
 *   node scripts/seed-sanity.mjs            # upsert everything
 *   node scripts/seed-sanity.mjs --dry-run  # print what would change
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClient } from '@sanity/client'
import { marked } from 'marked'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ARTICLES_DIR = path.join(ROOT, 'content/articles')
const DRY_RUN = process.argv.includes('--dry-run')

loadEnv(path.join(ROOT, '.env.local'))

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing Sanity credentials. Expected NEXT_PUBLIC_SANITY_PROJECT_ID, ' +
      'NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN in .env.local.'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-08-01',
  useCdn: false,
})

let keyCounter = 0
const nextKey = () => `k${(keyCounter++).toString(36)}${Math.floor(keyCounter * 2654435761 % 46656).toString(36)}`

const DECORATOR_FOR = { strong: 'strong', em: 'em', codespan: 'code' }

/**
 * Flattens marked's inline token tree into Portable Text spans, carrying the
 * active decorators down through nesting so `**bold with `code`**` keeps both.
 */
function inlineToSpans(tokens, marks = [], markDefs = []) {
  const spans = []

  for (const token of tokens ?? []) {
    switch (token.type) {
      case 'strong':
      case 'em':
      case 'codespan': {
        const mark = DECORATOR_FOR[token.type]
        const next = marks.includes(mark) ? marks : [...marks, mark]
        if (token.type === 'codespan') {
          spans.push({ _type: 'span', _key: nextKey(), text: token.text, marks: next })
        } else {
          spans.push(...inlineToSpans(token.tokens, next, markDefs))
        }
        break
      }
      case 'link': {
        const key = nextKey()
        markDefs.push({ _key: key, _type: 'link', href: token.href })
        spans.push(...inlineToSpans(token.tokens, [...marks, key], markDefs))
        break
      }
      case 'br':
        spans.push({ _type: 'span', _key: nextKey(), text: '\n', marks })
        break
      case 'text':
        if (token.tokens?.length) {
          spans.push(...inlineToSpans(token.tokens, marks, markDefs))
        } else {
          spans.push({ _type: 'span', _key: nextKey(), text: decodeEntities(token.text), marks })
        }
        break
      case 'escape':
      case 'html':
        spans.push({ _type: 'span', _key: nextKey(), text: decodeEntities(token.text), marks })
        break
      default:
        if (token.tokens?.length) {
          spans.push(...inlineToSpans(token.tokens, marks, markDefs))
        } else if (token.text) {
          spans.push({ _type: 'span', _key: nextKey(), text: decodeEntities(token.text), marks })
        }
    }
  }

  return spans
}

function decodeEntities(text = '') {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function textBlock(tokens, style = 'normal', listItem, level) {
  const markDefs = []
  const children = inlineToSpans(tokens, [], markDefs)
  if (children.length === 0) return null
  return {
    _type: 'block',
    _key: nextKey(),
    style,
    markDefs,
    children,
    ...(listItem ? { listItem, level: level ?? 1 } : {}),
  }
}

/**
 * marked's lexer gives a token tree that maps almost one-to-one onto Portable
 * Text. Going through the tokens rather than round-tripping via HTML keeps code
 * samples byte-exact and avoids double-escaped entities.
 */
function tokensToBlocks(tokens, listContext) {
  const blocks = []

  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const style = token.depth <= 2 ? 'h2' : token.depth === 3 ? 'h3' : 'h4'
        const block = textBlock(token.tokens, style)
        if (block) blocks.push(block)
        break
      }
      case 'paragraph': {
        const block = textBlock(token.tokens, 'normal', listContext?.listItem, listContext?.level)
        if (block) blocks.push(block)
        break
      }
      case 'text': {
        const block = textBlock(token.tokens ?? [{ type: 'text', text: token.text }], 'normal', listContext?.listItem, listContext?.level)
        if (block) blocks.push(block)
        break
      }
      case 'code': {
        const [language, filename] = String(token.lang ?? '').trim().split(/\s+/, 2)
        blocks.push({
          _type: 'code',
          _key: nextKey(),
          language: language || 'text',
          ...(filename ? { filename } : {}),
          code: token.text,
        })
        break
      }
      case 'blockquote': {
        for (const inner of tokensToBlocks(token.tokens, listContext)) {
          blocks.push({ ...inner, style: inner._type === 'block' ? 'blockquote' : inner.style })
        }
        break
      }
      case 'list': {
        const listItem = token.ordered ? 'number' : 'bullet'
        const level = (listContext?.level ?? 0) + 1
        for (const item of token.items) {
          blocks.push(...tokensToBlocks(item.tokens, { listItem, level }))
        }
        break
      }
      case 'table': {
        // No table type in the schema; render as a fenced block so the data
        // survives the import and an editor can decide what to do with it.
        const rows = [
          token.header.map((cell) => cell.text),
          ...token.rows.map((row) => row.map((cell) => cell.text)),
        ]
        blocks.push({
          _type: 'code',
          _key: nextKey(),
          language: 'text',
          code: rows.map((row) => row.join(' | ')).join('\n'),
        })
        break
      }
      case 'space':
      case 'hr':
      case 'html':
        break
      default:
        if (token.tokens?.length) blocks.push(...tokensToBlocks(token.tokens, listContext))
    }
  }

  return blocks
}

function markdownToPortableText(markdown) {
  return tokensToBlocks(marked.lexer(markdown, { gfm: true }))
}

function readArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`No articles directory at ${ARTICLES_DIR}`)
    process.exit(1)
  }
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8')
      const { data, content } = matter(raw)
      const slug = data.slug || file.replace(/\.md$/, '')
      return { file, slug, frontmatter: data, markdown: content }
    })
}

const AUTHOR_ID = 'author.godwill-barasa'

const author = {
  _id: AUTHOR_ID,
  _type: 'author',
  name: 'Godwill Barasa',
  slug: { _type: 'slug', current: 'godwill-barasa' },
  jobTitle: 'Senior Web Engineer',
  bio:
    'Senior Web Engineer with 8+ years building, scaling and optimising high-traffic web ' +
    'applications. Works in React, Next.js, TypeScript, Laravel and WordPress, with a focus ' +
    'on performance budgets, experimentation and delivery reliability. Based in Nairobi.',
  sameAs: [
    'https://github.com/godwillcodes',
    'https://www.linkedin.com/in/godwillcodes/',
    'https://iamgodwillb.medium.com/',
    'https://dev.to/godwillb',
  ],
}

function categoryDoc(title, description) {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
  return {
    _id: `category.${slug}`,
    _type: 'category',
    title,
    slug: { _type: 'slug', current: slug },
    description,
  }
}

const CATEGORIES = {
  'Mobile Money': categoryDoc(
    'Mobile Money',
    'Building on M-Pesa and the Daraja API: STK Push, callbacks, reconciliation and everything that breaks in production.'
  ),
  Performance: categoryDoc(
    'Performance',
    'Core Web Vitals, rendering strategy and the measurement discipline that keeps a site fast after launch.'
  ),
  Engineering: categoryDoc(
    'Engineering',
    'Architecture, tooling and delivery practice from production web systems.'
  ),
  Fintech: categoryDoc(
    'Fintech',
    'Payments and financial infrastructure in emerging markets.'
  ),
  'Editorial Platforms': categoryDoc(
    'Editorial Platforms',
    'Newsroom systems: publishing under deadline, archives that survive a migration, and pages that hold up when a story breaks.'
  ),
  'Broadcast Systems': categoryDoc(
    'Broadcast Systems',
    'Web systems for radio and streaming: reading on-air state from the broadcast rather than retyping it into a CMS.'
  ),
}

async function main() {
  const articles = readArticles()
  console.log(`Found ${articles.length} article(s) in content/articles\n`)

  const usedCategories = new Set(articles.map((a) => a.frontmatter.category))
  for (const name of usedCategories) {
    if (!CATEGORIES[name]) {
      console.error(`Article category "${name}" has no definition in seed-sanity.mjs`)
      process.exit(1)
    }
  }

  const documents = [author, ...[...usedCategories].map((name) => CATEGORIES[name])]

  for (const article of articles) {
    const { frontmatter: fm, slug, markdown } = article
    const body = markdownToPortableText(markdown)
    const codeBlocks = body.filter((b) => b._type === 'code').length

    documents.push({
      _id: `post.${slug}`,
      _type: 'post',
      title: fm.title,
      slug: { _type: 'slug', current: slug },
      excerpt: fm.excerpt,
      publishedAt: new Date(fm.date).toISOString(),
      ...(fm.updated ? { updatedAt: new Date(fm.updated).toISOString() } : {}),
      author: { _type: 'reference', _ref: AUTHOR_ID },
      category: { _type: 'reference', _ref: CATEGORIES[fm.category]._id },
      body,
      featured: Boolean(fm.featured),
      ...(fm.targetKeyword ? { targetKeyword: fm.targetKeyword } : {}),
      ...(fm.keywords ? { keywords: fm.keywords } : {}),
      ...(fm.metaTitle ? { metaTitle: fm.metaTitle } : {}),
    })

    console.log(
      `  ${slug}\n    ${body.length} blocks, ${codeBlocks} code sample(s), ` +
        `target: ${fm.targetKeyword ?? '—'}`
    )
  }

  if (DRY_RUN) {
    console.log(`\nDry run — ${documents.length} document(s) would be written.`)
    return
  }

  const tx = documents.reduce((acc, doc) => acc.createOrReplace(doc), client.transaction())
  await tx.commit()
  console.log(`\nWrote ${documents.length} document(s) to ${projectId}/${dataset}.`)
}

/** Minimal .env.local reader so the script needs no extra dependency. */
function loadEnv(file) {
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    process.env[key] = rawValue.replace(/^["']|["']$/g, '')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
