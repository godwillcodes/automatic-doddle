import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/photos/image-3.jpg'
import portraitImage2 from '@/images/photos/image-4.jpg'


function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'Godwill Barasa is Crafting Immersive Digital Experiences, One Line of Code at a Time!',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            
            <Image
              src={portraitImage2}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-2 mt-10 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Crafting Immersive Digital Experiences, One Line of Code at a Time!
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
            At the ripe age of 26, I, Godwill, proudly wear the mantle of a seasoned Lead Web Developer, tracing my journey back to the dawn of the digital age. Picture this: a sprightly 6-year-old version of myself, armed with nothing but curiosity and a newfound Macintosh LC 550, diving headfirst into the enigmatic world of coding. Ah, the memories!
            </p>
            <p>
              The only thing I loved more than computers as a kid was automotive engineering, I decided to upgrade my dad's trusty old lawnmower. Armed with nothing but a toolbox and boundless enthusiasm, I set out to give it a turbo boost. Let's just say, the end result wasn't quite what I expected. Instead of mowing the lawn, it performed a thrilling sprint down the driveway, leaving a trail of freshly cut grass in its wake. Needless to say, my dad wasn't too thrilled with the "improvement," but hey, it was worth a shot!
            </p>
            <p>
            From intern to innovator, my journey through the tech landscape has been nothing short of an adventure. It all began at Procter & Gamble, where I cut my teeth as an IT intern from 2018 to 2019, diving headfirst into the world of tech with ambition and a knack for problem-solving. Next, at Legibra Solutions from 2019 to 2021, I embraced the challenges of the digital frontier as a Web Developer, transforming pixels into possibilities one line of code at a time. And now, at Belva Digital, I've risen to the ranks of Software Engineer, where amidst the whirlwind of innovation and creativity, I continue to push the boundaries of what's possible in the digital realm. My journey is a testament to the power of perseverance and a sprinkle of wit along the way.
            </p>
            <p>
              I’m also Founder of Nestbella, a real estate AI company on a mission to give 10,000 Kenyans their dream homes. Talk about reaching for the stars while keeping your feet firmly planted on the ground!
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://twitter.com/godwill_codes" icon={TwitterIcon}>
              Follow on Twitter
            </SocialLink>
            <SocialLink href="https://instagram.com/godwillcodes" icon={InstagramIcon} className="mt-4">
              Follow on Instagram
            </SocialLink>
            <SocialLink href="https://github.com/godwillcodes/" icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/godwillcodes/" icon={LinkedInIcon} className="mt-4">
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:godwill.codes@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              godwill.codes@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
