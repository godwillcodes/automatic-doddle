'use client'

import { useMemo, useState } from 'react'

import { anchorFor, type DarajaCode } from '@/lib/mpesa'

/**
 * The filter over the code reference.
 *
 * Client-side and nothing else: the whole table is in the server-rendered HTML
 * before this mounts, so every code is crawlable, linkable and readable with
 * JavaScript off. The input only hides rows — it never fetches, and it is the
 * only interactive element on the page, which is what keeps the route's JS
 * cost near zero.
 *
 * Filtering matches the code, the meaning and the cause, because people arrive
 * here having searched either a number they saw in a log or a phrase they saw
 * in a response body.
 */
export default function CodeTable({ codes }: { codes: DarajaCode[] }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return codes
    return codes.filter((c) =>
      `${c.code} ${c.meaning} ${c.cause}`.toLowerCase().includes(needle)
    )
  }, [codes, q])

  return (
    <>
      <div className="co-codefilter">
        <label htmlFor="code-filter" className="meta">
          Filter
        </label>
        <input
          id="code-filter"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="1032, cancelled, phone number…"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="meta co-codecount" role="status">
          {filtered.length} of {codes.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="co-detail">
          No code matches “{q}”. If you have hit one that is not here, it is worth
          telling me — this list is the codes I have actually seen.
        </p>
      ) : null}

      <ol className="co-codelist">
        {filtered.map((c) => (
          <li key={c.code} id={anchorFor(c.code)} className="co-code">
            <div className="co-code-head">
              <code className="co-code-num">{c.code}</code>
              <span className="meta">
                {c.family === 'result' ? 'ResultCode · callback' : 'errorCode · response'}
              </span>
              <span className={c.retryable ? 'co-pill retry' : 'co-pill'}>
                {c.retryable ? 'Retry can help' : 'Retry will not help'}
              </span>
              {/* A per-code anchor, so a Stack Overflow answer can link the exact row. */}
              <a
                className="co-code-anchor meta"
                href={`#${anchorFor(c.code)}`}
                aria-label={`Link to code ${c.code}`}
              >
                #
              </a>
            </div>
            <h3 className="co-code-meaning">{c.meaning}</h3>
            <dl className="co-code-body">
              <dt className="meta">What causes it</dt>
              <dd>{c.cause}</dd>
              <dt className="meta">What to do</dt>
              <dd>{c.action}</dd>
              <dt className="meta">Attested</dt>
              <dd className="co-detail">{c.attested}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </>
  )
}
