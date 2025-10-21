import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import React from 'react'

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

function PhoneIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'Godwill Barasa - Senior Frontend Engineer with 5+ years building fast, accessible, and human-centered web experiences. Expert in React, Vue.js, TypeScript, and Ruby on Rails.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            
            <Image
              src={portraitImage2}
              alt="Godwill Barasa - Senior Frontend Engineer and Software Developer"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-2 mt-10 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
            Building Fast, Accessible, and Human-Centered Web Experiences
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              As a Senior Frontend Engineer with 5+ years of experience, I'm passionate about building fast, accessible, and human-centered web experiences that empower creators and small businesses. I thrive in early-stage product environments, specializing in rapid prototyping, iterative development, and shipping performant applications that deliver real value.
            </p>
            <p>
              Currently at Piedmont Global Language Solutions, I lead technical delivery of scalable, business-critical front-end platforms using React, Next.js, Tailwind, and TypeScript. I've successfully handled 40% traffic surges while maintaining performance, resilience, and cross-environment compatibility. I've established robust test discipline by developing comprehensive unit and component test suites with Jest, improving code reliability and reducing production defects.
            </p>
            <p>
              Previously at Ogilvy Africa Kenya, I engineered data-heavy UIs, including complex tables and reconciliation workflows, on scalable web platforms using Vue.js, TypeScript, and Node.js. I integrated headless CMSs like Contentful via GraphQL to deliver dynamic, high-concurrency content while maintaining 99.9% uptime. I built containerized cloud environments with Docker and orchestrated deployments via Kubernetes, halving deployment duration from 40 to 20 minutes and lowering production failures by 30%.
            </p>
            <p>
              At Belva Digital Agency, I architected and migrated high-traffic platforms to Ruby on Rails backends with GraphQL and REST APIs, integrating real-time updates via Turbo Streams and Hotwire. I deployed on AWS and orchestrated with Kubernetes, achieving 99.95% uptime and supporting 1.2M+ monthly users. I led accessibility and internationalization efforts, extending platform usability across 15+ languages and boosting engagement by 32%.
            </p>
            <p>
              My technical expertise spans React, Vue.js, TypeScript, Ruby on Rails, Node.js, and PHP, with a strong foundation in accessibility (WCAG 2.1), Core Web Vitals optimization, and thoughtful UX. I'm experienced in driving end-to-end delivery—design systems, API integration, CI/CD automation—and mentoring teams toward rapid, reliable delivery. I'm passionate about creating inclusive digital experiences that work for everyone, regardless of their abilities or the technologies they use.
            </p>
            <p>
              Based in Nairobi, Kenya, I'm fluent in English and have elementary proficiency in French. I'm open to travel and thrive in fast-paced, high-ownership environments where I can make a meaningful impact on both technology and people.
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
            <SocialLink
              href="tel:+254781249443"
              icon={PhoneIcon}
              className="mt-4"
            >
              +254 781 249 443
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
