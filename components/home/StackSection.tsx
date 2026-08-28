import Reveal from '@/components/Reveal'
import SectionHead from '@/components/SectionHead'
import { stack } from '@/lib/record'

/**
 * 06 — The stack, organised by what it is for. The tool is never the story.
 */
export default function StackSection() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 sm:px-8"
    >
      <SectionHead
        number="06"
        label="The stack"
        title="Organised by what it is for"
        lede="Tools are listed under the job they do. The tool is never the story."
      />

      <div className="grid gap-x-10 gap-y-12 pb-[clamp(2.5rem,5vw,4rem)] sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((group, index) => (
          <Reveal key={group.title} delay={index * 0.06}>
            <p className="meta mb-4">
              <span className="meta-accent">{group.index}</span>
              <span aria-hidden="true">{'  /  '}</span>
              {group.title}
            </p>
            <ul className="stack-col text-stone">
              {group.items.map((item) => (
                <li key={item.tool}>
                  <span className="text-sm font-[440] text-ink">{item.tool}</span>
                  <span className="meta text-right">{item.purpose}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
