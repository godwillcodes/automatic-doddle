'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Adds `reveal-in` when the element enters the viewport. All motion lives in
 * CSS (see globals.css), so prefers-reduced-motion is honoured for free and
 * there is no animation library in the bundle.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li' | 'span' | 'figure'
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )

    observer.observe(el)
    // Draw child rules alongside the block itself.
    el.querySelectorAll('.draw').forEach((rule) => {
      const o = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('draw-in')
              o.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.1 }
      )
      o.observe(rule)
    })

    return () => observer.disconnect()
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={{ ['--d' as string]: `${delay}s` }}>
      {children}
    </Tag>
  )
}
