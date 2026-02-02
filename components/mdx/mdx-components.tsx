import { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'

// Custom anchor component - no onClick for RSC compatibility
function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http') || href?.startsWith('//')
  
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

interface HeadingProps {
  children?: ReactNode
  id?: string
  className?: string
}

// Custom heading components with anchor links (RSC compatible - no onClick)
const H1 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h1 id={headingId} className="group scroll-mt-24 text-4xl sm:text-5xl font-semibold tracking-tight text-black mt-12 mb-8 leading-tight" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline text-2xl" aria-label={`Link to ${text}`}>#</a>
    </h1>
  )
}

const H2 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h2 id={headingId} className="group scroll-mt-24 text-3xl sm:text-4xl font-semibold tracking-tight text-black mt-16 mb-6 leading-tight" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline text-xl" aria-label={`Link to ${text}`}>#</a>
    </h2>
  )
}

const H3 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h3 id={headingId} className="group scroll-mt-24 text-2xl sm:text-3xl font-semibold tracking-tight text-black mt-12 mb-4 leading-tight" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline text-lg" aria-label={`Link to ${text}`}>#</a>
    </h3>
  )
}

const H4 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h4 id={headingId} className="group scroll-mt-24 text-xl sm:text-2xl font-semibold tracking-tight text-black mt-8 mb-3 leading-tight" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline text-base" aria-label={`Link to ${text}`}>#</a>
    </h4>
  )
}

// NOTE: We don't override `pre` here - let rehype-pretty-code handle code blocks
// Styling for code blocks is done via CSS in globals.css

// Custom inline code (only for inline `code` not inside `pre`)
function InlineCode({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) {
  // If this code has rehype-pretty-code attributes, don't add inline styles
  if (className?.includes('language-') || props['data-language']) {
    return <code className={className} {...props}>{children}</code>
  }
  
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-black/6 text-black/90 text-[0.9em] font-mono">
      {children}
    </code>
  )
}

// Custom paragraph with consistent styling
function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <p className="text-lg sm:text-xl leading-relaxed text-black/80 font-light mb-6">
      {children}
    </p>
  )
}

// Custom blockquote with elegant styling
function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-black/20 italic text-black/60 font-light text-lg sm:text-xl leading-relaxed">
      {children}
    </blockquote>
  )
}

// Custom unordered list
function UnorderedList({ children }: { children?: ReactNode }) {
  return (
    <ul className="my-8 space-y-3 pl-6">
      {children}
    </ul>
  )
}

// Custom ordered list
function OrderedList({ children }: { children?: ReactNode }) {
  return (
    <ol className="my-8 space-y-3 pl-6 list-decimal">
      {children}
    </ol>
  )
}

// Custom list item with consistent styling
function ListItem({ children }: { children?: ReactNode }) {
  return (
    <li className="text-lg sm:text-xl leading-relaxed text-black/80 font-light pl-2 marker:text-black/50 marker:font-semibold">
      {children}
    </li>
  )
}

// Custom strong/bold text
function Strong({ children }: { children?: ReactNode }) {
  return (
    <strong className="font-semibold text-black">
      {children}
    </strong>
  )
}

// Custom emphasis/italic text
function Emphasis({ children }: { children?: ReactNode }) {
  return (
    <em className="italic text-black/80">
      {children}
    </em>
  )
}

// Custom horizontal rule
function HorizontalRule() {
  return (
    <hr className="my-12 border-t border-black/10" />
  )
}

// Custom table components
function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  )
}

function TableHead({ children }: { children?: ReactNode }) {
  return (
    <thead className="border-b-2 border-black/20">
      {children}
    </thead>
  )
}

function TableBody({ children }: { children?: ReactNode }) {
  return (
    <tbody>
      {children}
    </tbody>
  )
}

function TableRow({ children }: { children?: ReactNode }) {
  return (
    <tr className="border-t border-black/10">
      {children}
    </tr>
  )
}

function TableHeader({ children }: { children?: ReactNode }) {
  return (
    <th className="text-left font-semibold text-black p-3">
      {children}
    </th>
  )
}

function TableCell({ children }: { children?: ReactNode }) {
  return (
    <td className="p-3 text-black/70">
      {children}
    </td>
  )
}

// MDX Components mapping - RSC compatible (no client components with event handlers)
export const mdxComponents: MDXComponents = {
  // Override default HTML elements - Typography
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: Paragraph,
  blockquote: Blockquote,
  
  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  
  // Inline elements
  a: CustomLink,
  strong: Strong,
  em: Emphasis,
  code: InlineCode,
  
  // Block elements - NOTE: pre is NOT overridden, let rehype-pretty-code handle it
  hr: HorizontalRule,
  
  // Tables
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,
}

export default mdxComponents
