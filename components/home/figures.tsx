/**
 * The figures for Selected Work. Hand-drawn SVG, hairline strokes, mono
 * labels; each carries a title/desc pair and an honest caption. These are
 * schematics of documented behaviour, never captured runs — the captions say
 * so.
 */

const MONO = 'var(--font-mono)'
const STONE = 'var(--color-stone)'
const RULE = 'var(--color-rule)'
const INK = 'var(--color-ink)'
const ACCENT = 'var(--color-accent)'
const ACCENT_LO = 'var(--color-accent-lo)'

function Label({
  x,
  y,
  children,
  anchor = 'start',
  color = STONE,
}: {
  x: number
  y: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
  color?: string
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em' }}
    >
      {children}
    </text>
  )
}

/** Fig. 02 — On-time delivery, before and after standardisation. */
export function DeliverySlope() {
  // 0–100 scale mapped onto y 150 (0) → 20 (100)
  const y = (v: number) => 150 - v * 1.3
  return (
    <svg
      viewBox="0 0 420 190"
      role="img"
      aria-labelledby="fig2-title fig2-desc"
      className="w-full"
    >
      <title id="fig2-title">On-time delivery rose from 70% to 95%</title>
      <desc id="fig2-desc">
        A slope between two observations on a 0 to 100 percent scale: before
        standardisation, on-time delivery was 70 percent; after, 95 percent.
      </desc>
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={60} x2={400} y1={y(v)} y2={y(v)} stroke={RULE} strokeWidth={1} />
          <Label x={48} y={y(v) + 3} anchor="end">
            {String(v)}
          </Label>
        </g>
      ))}
      <line x1={120} y1={y(70)} x2={340} y2={y(95)} stroke={ACCENT_LO} strokeWidth={1.5} />
      <circle cx={120} cy={y(70)} r={4} fill={INK} />
      <circle cx={340} cy={y(95)} r={4} fill={ACCENT} stroke={INK} strokeWidth={1} />
      <Label x={120} y={y(70) + 20} anchor="middle" color={INK}>
        70%
      </Label>
      <Label x={340} y={y(95) - 12} anchor="middle" color={INK}>
        95%
      </Label>
      <Label x={120} y={175} anchor="middle">
        BEFORE
      </Label>
      <Label x={340} y={175} anchor="middle">
        AFTER
      </Label>
    </svg>
  )
}

/** Fig. 03 — Binary search narrowing the quality interval. */
export function QualitySearch() {
  // Four stacked number lines; interval halves toward convergence.
  const rows = [
    { y: 34, a: 0, b: 1, probe: 0.5, label: 'i.1' },
    { y: 74, a: 0.5, b: 1, probe: 0.75, label: 'i.2' },
    { y: 114, a: 0.5, b: 0.75, probe: 0.625, label: 'i.3' },
    { y: 154, a: 0.59, b: 0.66, probe: 0.625, label: 'i.n', converged: true },
  ]
  const x = (t: number) => 70 + t * 310
  return (
    <svg
      viewBox="0 0 420 190"
      role="img"
      aria-labelledby="fig3-title fig3-desc"
      className="w-full"
    >
      <title id="fig3-title">Binary search narrowing the quality interval</title>
      <desc id="fig3-desc">
        Four stacked number lines from quality 1 to 100. Each iteration halves the
        candidate interval around a probe until the encoded size converges within
        tolerance of the target.
      </desc>
      <Label x={70} y={16}>
        Q1
      </Label>
      <Label x={380} y={16} anchor="end">
        Q100
      </Label>
      {rows.map((row) => (
        <g key={row.label}>
          <Label x={40} y={row.y + 3} anchor="end">
            {row.label}
          </Label>
          <line x1={x(0)} x2={x(1)} y1={row.y} y2={row.y} stroke={RULE} strokeWidth={1} />
          <line
            x1={x(row.a)}
            x2={x(row.b)}
            y1={row.y}
            y2={row.y}
            stroke={INK}
            strokeWidth={2}
          />
          <line x1={x(row.a)} x2={x(row.a)} y1={row.y - 5} y2={row.y + 5} stroke={INK} strokeWidth={1} />
          <line x1={x(row.b)} x2={x(row.b)} y1={row.y - 5} y2={row.y + 5} stroke={INK} strokeWidth={1} />
          <circle
            cx={x(row.probe)}
            cy={row.y}
            r={4}
            fill={row.converged ? ACCENT : 'var(--color-paper)'}
            stroke={row.converged ? INK : ACCENT_LO}
            strokeWidth={1.2}
          />
        </g>
      ))}
      <g>
        <circle cx={90} cy={180} r={3.5} fill="var(--color-paper)" stroke={ACCENT_LO} strokeWidth={1.2} />
        <Label x={100} y={183}>
          probe
        </Label>
        <circle cx={190} cy={180} r={3.5} fill={ACCENT} stroke={INK} strokeWidth={1} />
        <Label x={200} y={183}>
          within tolerance
        </Label>
      </g>
    </svg>
  )
}

/** Fig. 04 — Lab and field measurement paths into one store. */
export function MeasurementPaths() {
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    sub: string,
    accent = false
  ) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={accent ? ACCENT_LO : STONE}
        strokeWidth={1}
      />
      <Label x={x + 8} y={y + 16} color={INK}>
        {title}
      </Label>
      <Label x={x + 8} y={y + 29}>
        {sub}
      </Label>
    </g>
  )
  const arrow = (x1: number, y1: number, x2: number, y2: number) => (
    <g stroke={STONE} strokeWidth={1}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polyline
        points={`${x2 - 4},${y2 - 3} ${x2},${y2} ${x2 - 4},${y2 + 3}`}
        fill="none"
      />
    </g>
  )
  return (
    <svg
      viewBox="0 0 420 250"
      role="img"
      aria-labelledby="fig4-title fig4-desc"
      className="w-full"
    >
      <title id="fig4-title">Lab and field measurement paths</title>
      <desc id="fig4-desc">
        Synthetic audits are queued and processed by a built-in PHP worker that calls
        the Google PageSpeed Insights API. Separately, visitor browsers send real-user
        Core Web Vitals. Both write to custom database tables that feed the admin
        dashboard and a REST API.
      </desc>
      {box(10, 20, 120, 38, 'AUDIT QUEUE', 'url · schedule')}
      {box(160, 20, 120, 38, 'PHP WORKER', 'async · no node')}
      {arrow(130, 39, 158, 39)}
      <Label x={310} y={30}>
        PageSpeed
      </Label>
      <Label x={310} y={42}>
        Insights API
      </Label>
      {arrow(280, 39, 305, 39)}

      {box(10, 90, 120, 38, 'VISITOR', 'page view')}
      {box(160, 90, 150, 38, 'RUM BEACON', 'lcp cls fid fcp ttfb')}
      {arrow(130, 109, 158, 109)}

      {box(160, 160, 150, 38, 'CUSTOM TABLES', 'indexed · retention', true)}
      {arrow(220, 58, 220, 158)}
      {arrow(235, 128, 235, 158)}

      {box(10, 210, 140, 32, 'DASHBOARD', 'admin ui')}
      {box(180, 210, 200, 32, 'REST API', 'csv · html report')}
      {arrow(200, 198, 90, 208)}
      {arrow(250, 198, 270, 208)}
    </svg>
  )
}
