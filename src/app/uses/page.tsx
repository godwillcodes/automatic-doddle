import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="13” MacBook Pro, i5, 8GB RAM (2016)">
            As a 2016 13” MacBook Pro owner, it's been a mixed bag of charm and
            struggle. The sleek design and vibrant display still impress, but
            the i5 processor and 8GB RAM sometimes feel like they're running a
            marathon with ankle weights. While it's great for everyday tasks,
            anything too demanding makes it break a sweat. It's like having a
            reliable but slightly aging friend – they're there for you, but you
            might need to give them a little extra TLC.
          </Tool>

          <Tool title="oraimo Smart Office Slim Wireless Keyboard Mouse Kit">
            This keyboard? It's like the ninja of keyboards—small, stealthy, and
            always ready to accompany you on your adventures. With its compact
            79 keys, including those handy arrow and Fn keys, it's like having a
            secret weapon in your pocket. And let's talk comfort—thanks to its
            scissor key structure, typing feels like a dream. So whether you're
            conquering spreadsheets or slaying emails, this keyboard has your
            back, ninja-style.
          </Tool>

          <Tool title="Lama Orthopedic Chair">
            This is an exclusive release from <a href="">Dignity Furniture</a>.
            Adjustable height, adjustable armrest, adjustable backrest,
            adjustable headrest, adjustable lumbar support, adjustable seat
            depth, adjustable seat tilt, adjustable seat height, adjustable
            backrest tilt, adjustable armrest height, adjustable armrest width,
            adjustable armrest angle, adjustable armrest depth, adjustable
            armrest pivot, adjustable armrest rotation
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="Visual Studio Code">
            Efficient, versatile, and user-friendly; Visual Studio Code
            streamlines coding with its robust features.
          </Tool>
          <Tool title="Postman">
            Streamlines API testing; intuitive interface, collaboration tools,
            simplifies workflows for developers.
          </Tool>
          <Tool title="TablePlus">
            Great software for working with databases. Has saved me from
            building about a thousand admin interfaces for my various projects
            over the years.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Design">
          <Tool title="Figma">
            We started using Figma as just a design tool but now it’s become our
            virtual whiteboard for the entire company. Never would have expected
            the collaboration features to be the real hook.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Productivity">
          <Tool title="Alfred">
            It’s not the newest kid on the block but it’s still the fastest. The
            Sublime Text of the application launcher world.
          </Tool>
          <Tool title="Reflect">
            Using a daily notes system instead of trying to keep things
            organized by topics has been super powerful for me. And with
            Reflect, it’s still easy for me to keep all of that stuff
            discoverable by topic even though all of my writing happens in the
            daily note.
          </Tool>
          <Tool title="SavvyCal">
            Great tool for scheduling meetings while protecting my calendar and
            making sure I still have lots of time for deep work during the week.
          </Tool>
          <Tool title="Focus">
            Simple tool for blocking distracting websites when I need to just do
            the work and get some momentum going.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
