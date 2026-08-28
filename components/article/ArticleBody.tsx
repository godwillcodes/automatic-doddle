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
  note: { Icon: Info, ring: 'border-black/10 bg-black/[0.02]', icon: 'text-black/50' },
  tip: { Icon: Lightbulb, ring: 'border-emerald-200 bg-emerald-50/60', icon: 'text-emerald-600' },
  warning: { Icon: TriangleAlert, ring: 'border-amber-200 bg-amber-50/60', icon: 'text-amber-600' },
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
      ? 'text-3xl sm:text-4xl mt-16 mb-6'
      : level === 3
        ? 'text-2xl sm:text-3xl mt-12 mb-4'
        : 'text-xl sm:text-2xl mt-8 mb-3'

  return (
    <Tag
      id={id}
      className={`group scroll-mt-28 font-semibold tracking-tight text-black leading-tight ${size}`}
    >
      {children}
      <a
        href={`#${id}`}
        className="ml-2 align-middle text-black/20 opacity-0 transition-opacity duration-200 hover:text-black/50 group-hover:opacity-100 no-underline"
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
        <p className="mb-6 text-lg sm:text-xl font-light leading-relaxed text-black/80">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-8 border-l-4 border-black/20 pl-6 text-lg sm:text-xl font-light italic leading-relaxed text-black/60">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="my-8 space-y-3 pl-6 list-disc">{children}</ul>,
      number: ({ children }) => <ol className="my-8 space-y-3 pl-6 list-decimal">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="pl-2 text-lg sm:text-xl font-light leading-relaxed text-black/80 marker:text-black/40">
          {children}
        </li>
      ),
      number: ({ children }) => (
        <li className="pl-2 text-lg sm:text-xl font-light leading-relaxed text-black/80 marker:font-semibold marker:text-black/40">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.875em] text-black/90">
          {children}
        </code>
      ),
      link: ({ children, value }) => {
        const href: string = value?.href ?? '#'
        const isExternal = /^https?:\/\//.test(href)
        const className =
          'underline decoration-black/25 decoration-2 underline-offset-2 transition-colors hover:decoration-black/60'

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
          <figure className="group relative my-8 overflow-hidden rounded-2xl border border-black/10">
            <figcaption className="flex items-center justify-between border-b border-white/5 bg-[#22272e] px-4 py-2.5">
              <span className="font-mono text-xs text-white/60">
                {value.filename || languageLabel(value.language)}
              </span>
              <CopyCodeButton code={value.code} />
            </figcaption>
            {/* Shiki emits its own <pre> carrying both the theme background and
                token colours, so nothing here may override them. */}
            <div
              className="overflow-x-auto text-sm leading-relaxed [&_pre]:m-0 [&_pre]:px-5 [&_pre]:py-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </figure>
        )
      },
      figure: ({ value }: { value: FigureValue }) => {
        if (!value?.asset) return null
        return (
          <figure className="my-10">
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-black/[0.02]">
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
              <figcaption className="mt-3 text-center text-sm font-light italic text-black/50">
                {value.caption}
              </figcaption>
            ) : null}
          </figure>
        )
      },
      callout: ({ value }: { value: CalloutValue }) => {
        const { Icon, ring, icon } = CALLOUT_TONES[value.tone ?? 'note']
        return (
          <aside className={`my-8 flex gap-4 rounded-2xl border p-5 sm:p-6 ${ring}`}>
            <Icon size={20} strokeWidth={2} className={`mt-0.5 shrink-0 ${icon}`} />
            <div>
              {value.title ? (
                <p className="mb-1 font-semibold text-black">{value.title}</p>
              ) : null}
              {value.body ? (
                <p className="text-base font-light leading-relaxed text-black/70">{value.body}</p>
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
