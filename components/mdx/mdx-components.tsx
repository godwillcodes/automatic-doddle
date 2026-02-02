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
    <h1 id={headingId} className="group scroll-mt-24" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline" aria-label={`Link to ${text}`}>#</a>
    </h1>
  )
}

const H2 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h2 id={headingId} className="group scroll-mt-24" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline" aria-label={`Link to ${text}`}>#</a>
    </h2>
  )
}

const H3 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h3 id={headingId} className="group scroll-mt-24" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline" aria-label={`Link to ${text}`}>#</a>
    </h3>
  )
}

const H4 = ({ children, id, ...props }: HeadingProps) => {
  const text = typeof children === 'string' ? children : ''
  const headingId = id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  return (
    <h4 id={headingId} className="group scroll-mt-24" {...props}>
      {children}
      <a href={`#${headingId}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 hover:text-black/50 no-underline" aria-label={`Link to ${text}`}>#</a>
    </h4>
  )
}

// Custom code block (RSC compatible - simple styling)
function CodeBlock({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <pre className="my-8 rounded-xl border border-black/10 bg-[#fafafa] p-4 overflow-x-auto">
      <code className={className}>{children}</code>
    </pre>
  )
}

// Custom inline code
function InlineCode({ children }: { children?: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-black/[0.06] text-black/90 text-[0.9em] font-mono">
      {children}
    </code>
  )
}

// MDX Components mapping - RSC compatible (no client components with event handlers)
export const mdxComponents: MDXComponents = {
  // Override default HTML elements
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: CustomLink,
  pre: CodeBlock,
  code: InlineCode,
}

export default mdxComponents
