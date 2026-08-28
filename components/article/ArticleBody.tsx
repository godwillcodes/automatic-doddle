import Image from 'next/image'
import Link from 'next/link'
import { PortableText, toPlainText, type PortableTextComponents } from '@portabletext/react'
import { Info, Lightbulb, TriangleAlert } from 'lucide-react'

import { urlForImage } from '@/lib/sanity/client'
import { highlightCodeBlocks, languageLabel } from '@/lib/sanity/highlight'
import type { ArticleBlock, CalloutValue, CodeBlockValue, FigureValue } from '@/lib/sanity/types'
import { slugify } from '@/lib/slug'
import CopyCodeButton from './CopyCodeButton'

const CALLOUT_TONES = {
  note: { Icon: Info, ring: 'border-rule bg-paper-2/50', icon: 'text-stone' },
  tip: { Icon: Lightbulb, ring: 'border-rule bg-paper-2/50', icon: 'text-accent-lo' },
  warning: { Icon: TriangleAlert, ring: 'border-accent-lo/40 bg-paper-2/50', icon: 'text-accent-lo' },
} as const

function Heading({
  level,
  children,
}: {
  level: 2 | 3 | 4
  children?: React.ReactNode
}) {
  const text = typeof children === 'string' ? children : extractText(children)
  const id = slugify(text)
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4'
  const size =
    level === 2
      ? 'text-[clamp(1.6rem,3vw,2.2rem)] mt-14 mb-5'
      : level === 3
        ? 'text-[clamp(1.3rem,2.4vw,1.7rem)] mt-11 mb-4'
        : 'text-[clamp(1.1rem,2vw,1.35rem)] mt-8 mb-3'

  return (
    <Tag
      id={id}
      className={`display group scroll-mt-28 ${size}`}
    >
      {children}
      <a
        href={`#${id}`}
        className="ml-2 align-middle text-rule opacity-0 transition-opacity duration-200 hover:text-accent-lo group-hover:opacity-100 no-underline"
        aria-label={text ? `Link to section: ${text}` : 'Link to this section'}
      >
        #
      </a>
    </Tag>
  )
}

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: React.ReactNode } }).props.children)
  }
  return ''
}

function buildComponents(highlighted: Record<string, string>): PortableTextComponents {
  return {
    block: {
      h2: ({ children }) => <Heading level={2}>{children}</Heading>,
      h3: ({ children }) => <Heading level={3}>{children}</Heading>,
      h4: ({ children }) => <Heading level={4}>{children}</Heading>,
      normal: ({ children }) => (
        <p className="mb-6 max-w-[68ch] text-[1.0625rem] leading-[1.75] text-ink/85">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-9 border-l-2 border-accent pl-6 text-[1.1rem] italic leading-relaxed text-stone">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="my-8 max-w-[68ch] list-disc space-y-3 pl-6">{children}</ul>,
      number: ({ children }) => <ol className="my-8 max-w-[68ch] list-decimal space-y-3 pl-6">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="pl-2 text-[1.0625rem] leading-[1.7] text-ink/85 marker:text-accent-lo">
          {children}
        </li>
      ),
      number: ({ children }) => (
        <li className="pl-2 text-[1.0625rem] leading-[1.7] text-ink/85 marker:font-medium marker:text-accent-lo">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-[520] text-ink">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
          {children}
        </code>
      ),
      link: ({ children, value }) => {
        const href: string = value?.href ?? '#'
        const isExternal = /^https?:\/\//.test(href)
        const className =
          'underline decoration-accent decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-accent-lo'

        if (isExternal) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
              {children}
            </a>
          )
        }
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        )
      },
    },
    types: {
      code: ({ value }: { value: CodeBlockValue }) => {
        const html = highlighted[value._key]
        if (!html) return null
        return (
          <figure className="group relative my-9 overflow-hidden rule-t rule-b">
            <figcaption className="flex items-center justify-between bg-[#22272e] px-4 py-2.5">
              <span className="font-mono text-xs text-white/60">
                {value.filename || languageLabel(value.language)}
              </span>
              <CopyCodeButton code={value.code} />
            </figcaption>
            {/* Shiki emits its own <pre> carrying both the theme background and
                token colours, so nothing here may override them. */}
            <div
              className="article-code"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </figure>
        )
      },
      figure: ({ value }: { value: FigureValue }) => {
        if (!value?.asset) return null
        return (
          <figure className="my-10">
            <div className="overflow-hidden bg-paper-2">
              <Image
                src={urlForImage(value).width(1600).url()}
                alt={value.alt}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 768px, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
            {value.caption ? (
              <figcaption className="meta mt-3 normal-case tracking-normal">
                {value.caption}
              </figcaption>
            ) : null}
          </figure>
        )
      },
      callout: ({ value }: { value: CalloutValue }) => {
        const { Icon, ring, icon } = CALLOUT_TONES[value.tone ?? 'note']
        return (
          <aside className={`my-9 flex max-w-[68ch] gap-4 border p-5 sm:p-6 ${ring}`}>
            <Icon size={20} strokeWidth={2} className={`mt-0.5 shrink-0 ${icon}`} />
            <div>
              {value.title ? (
                <p className="meta meta-ink mb-2">{value.title}</p>
              ) : null}
              {value.body ? (
                <p className="text-[0.95rem] leading-relaxed text-stone">{value.body}</p>
              ) : null}
            </div>
          </aside>
        )
      },
    },
  }
}

export default async function ArticleBody({ body }: { body: ArticleBlock[] }) {
  const highlighted = await highlightCodeBlocks(body)
  return <PortableText value={body} components={buildComponents(highlighted)} />
}

/** Headings for the table of contents, derived from the same blocks and slugs. */
export function extractHeadings(body: ArticleBlock[]) {
  return body
    .filter((block) => {
      const style = (block as { _type?: string; style?: string })
      return style._type === 'block' && (style.style === 'h2' || style.style === 'h3')
    })
    .map((block) => {
      const text = toPlainText(block as never)
      return {
        id: slugify(text),
        text,
        level: (block as { style: string }).style === 'h2' ? 2 : 3,
      }
    })
    .filter((heading) => heading.text.length > 0)
}

/**
 * Plain prose for text-to-speech. Code blocks are deliberately excluded — the
 * old implementation fed raw markdown to the speech engine, so listeners heard
 * every backtick, hash and curly brace read aloud.
 */
export function toReadableText(body: ArticleBlock[]): string {
  return body
    .filter((block) => (block as { _type?: string })._type === 'block')
    .map((block) => toPlainText(block as never))
    .filter(Boolean)
    .join('. ')
    .replace(/\.\s*\./g, '.')
}
