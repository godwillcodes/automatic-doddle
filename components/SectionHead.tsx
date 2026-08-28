import Reveal from './Reveal'

export default function SectionHead({
  number,
  label,
  title,
  lede,
}: {
  number: string
  label: string
  title: string
  lede?: string
}) {
  return (
    <div className="sec-head rule-t">
      <Reveal>
        <p className="meta">
          <span className="meta-accent">{number}</span>
          <span aria-hidden="true">{'  —  '}</span>
          {label}
        </p>
        <h2 className="display mt-4 text-[clamp(1.9rem,4.5vw,3.4rem)]">{title}</h2>
        {lede ? <p className="prose-body mt-4">{lede}</p> : null}
      </Reveal>
    </div>
  )
}
