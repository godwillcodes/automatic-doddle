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

    // Belt and braces: an IntersectionObserver that never delivers — a
    // throttled background tab, an embedded webview, an unusual crawler —
    // must not leave content at opacity 0 forever. If nothing has fired
    // within a beat of the element being near the viewport, show it anyway.
    const failsafe = window.setTimeout(() => {
      el.classList.add('reveal-in')
      el.querySelectorAll('.draw').forEach((rule) => rule.classList.add('draw-in'))
    }, 1800)
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

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={{ ['--d' as string]: `${delay}s` }}>
      {children}
    </Tag>
  )
}
