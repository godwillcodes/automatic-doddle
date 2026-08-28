import 'server-only'

import { createHighlighter, type Highlighter } from 'shiki'

import type { ArticleBlock, CodeBlockValue } from './types'

/**
 * The old setup ran rehype-pretty-code with the `github-light` theme and then
 * forced `background: #1e1e1e` in CSS, which left near-black tokens on a
 * near-black background. Shiki now owns both foreground and background, so the
 * two can no longer drift apart.
 */
const THEME = 'github-dark-dimmed'

const LANGUAGES = [
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'json',
  'bash',
  'shell',
  'php',
  'sql',
  'css',
  'html',
  'yaml',
  'apache',
  'diff',
  'python',
] as const

type SupportedLanguage = (typeof LANGUAGES)[number]

const ALIASES: Record<string, SupportedLanguage> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  zsh: 'bash',
  console: 'bash',
  htaccess: 'apache',
  apacheconf: 'apache',
  yml: 'yaml',
  py: 'python',
  text: 'bash',
}

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...LANGUAGES],
    })
  }
  return highlighterPromise
}

function normalizeLanguage(language?: string): SupportedLanguage {
  if (!language) return 'typescript'
  const lower = language.toLowerCase()
  if ((LANGUAGES as readonly string[]).includes(lower)) return lower as SupportedLanguage
  return ALIASES[lower] ?? 'bash'
}

function isCodeBlock(block: ArticleBlock): block is CodeBlockValue {
  return (block as CodeBlockValue)._type === 'code'
}

/**
 * Pre-renders every code block in one pass so the Portable Text components can
 * stay synchronous. Keyed by the block's `_key`.
 */
export async function highlightCodeBlocks(
  body: ArticleBlock[]
): Promise<Record<string, string>> {
  const blocks = body.filter(isCodeBlock).filter((block) => Boolean(block.code))
  if (blocks.length === 0) return {}

  const highlighter = await getHighlighter()

  return Object.fromEntries(
    blocks.map((block) => [
      block._key,
      highlighter.codeToHtml(block.code, {
        lang: normalizeLanguage(block.language),
        theme: THEME,
      }),
    ])
  )
}

export function languageLabel(language?: string): string {
  const normalized = normalizeLanguage(language)
  const labels: Partial<Record<SupportedLanguage, string>> = {
    typescript: 'TypeScript',
    tsx: 'TSX',
    javascript: 'JavaScript',
    jsx: 'JSX',
    json: 'JSON',
    bash: 'Shell',
    shell: 'Shell',
    php: 'PHP',
    sql: 'SQL',
    css: 'CSS',
    html: 'HTML',
    yaml: 'YAML',
    apache: 'Apache',
    diff: 'Diff',
    python: 'Python',
  }
  return labels[normalized] ?? normalized
}
