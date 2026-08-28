'use client'

import { useEffect, useState } from 'react'

interface Readings {
  lcp?: string
  cls?: string
  inp?: string
  ttfb?: string
  transferred?: string
  requests?: string
}

const CELLS: { key: keyof Readings; label: string; description: string }[] = [
  { key: 'lcp', label: 'LCP', description: 'Largest contentful paint' },
  { key: 'cls', label: 'CLS', description: 'Cumulative layout shift' },
  { key: 'inp', label: 'INP', description: 'Interaction to next paint' },
  { key: 'ttfb', label: 'TTFB', description: 'Time to first byte' },
  { key: 'transferred', label: 'Transferred', description: 'Total over the wire' },
  { key: 'requests', label: 'Requests', description: 'Including this document' },
]

const ms = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`

const kb = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)}MB`
    : `${Math.round(bytes / 1024)}KB`

/**
 * The page measuring itself, on the visitor's device and connection, via the
 * Performance API. A reading, not a claim — the label says so. Everything is
 * feature-detected; browsers without an API simply keep their em-dash.
 */
export default function VitalsInstrument() {
  const [readings, setReadings] = useState<Readings>({})

  useEffect(() => {
    const set = (patch: Partial<Readings>) =>
      setReadings((current) => ({ ...current, ...patch }))

    const observers: PerformanceObserver[] = []

    const observe = (
      type: string,
      handler: (entries: PerformanceEntry[]) => void,
      extra: PerformanceObserverInit = {}
    ) => {
      if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return
      try {
        const observer = new PerformanceObserver((list) => handler(list.getEntries()))
        observer.observe({ type, buffered: true, ...extra } as PerformanceObserverInit)
        observers.push(observer)
      } catch {
        // Older engines throw on unknown types; the cell keeps its dash.
      }
    }

    observe('largest-contentful-paint', (entries) => {
      const last = entries.at(-1)
      if (last) set({ lcp: ms(last.startTime) })
    })

    let clsTotal = 0
    observe('layout-shift', (entries) => {
      for (const entry of entries) {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }
        if (!shift.hadRecentInput) clsTotal += shift.value
      }
      set({ cls: clsTotal.toFixed(3) })
    })

    let inpMax = 0
    observe(
      'event',
      (entries) => {
        for (const entry of entries) {
          if (entry.duration > inpMax) inpMax = entry.duration
        }
        if (inpMax > 0) set({ inp: ms(inpMax) })
      },
      { durationThreshold: 40 } as PerformanceObserverInit
    )

    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined
    if (nav) set({ ttfb: ms(nav.responseStart) })

    const tally = () => {
      const resources = performance.getEntriesByType(
        'resource'
      ) as PerformanceResourceTiming[]
      const bytes =
        (nav?.transferSize ?? 0) +
        resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0)
      set({
        transferred: kb(bytes),
        requests: String(resources.length + 1),
      })
    }
    // Give late resources a moment, then read the ledger.
    const timer = setTimeout(tally, 2500)

    return () => {
      clearTimeout(timer)
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const measured = Object.keys(readings).length > 0

  return (
    <div className="rule-t rule-b bg-paper-2/40 px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="meta meta-ink">Instrument — this page, measured on your device</h3>
        <p className="meta" aria-live="polite">
          {measured ? 'Live' : 'Measuring…'}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {CELLS.map((cell) => (
          <div key={cell.key}>
            <dt className="meta">{cell.label}</dt>
            <dd className="numeral mt-2 text-3xl" aria-label={cell.description}>
              {readings[cell.key] ?? '—'}
            </dd>
            <dd className="meta mt-2 normal-case tracking-normal">{cell.description}</dd>
          </div>
        ))}
      </dl>

      <p className="prose-body mt-6 text-sm">
        Read live from the Performance API in your browser, on your connection. Not a
        claim, a reading — and it will differ from anyone else&apos;s.
      </p>
    </div>
  )
}
