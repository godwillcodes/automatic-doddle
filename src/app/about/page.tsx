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
    'Godwill Barasa - Technical Lead with 7+ years delivering scalable, user-centered products and leading cross-functional teams across Sub-Saharan Africa.',
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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
            Leading Product Engineering Teams Across Sub-Saharan Africa
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              As a Technical Lead with 7+ years of experience, I specialize in delivering scalable, user-centered products while leading cross-functional teams and building high-performing engineering talent. My expertise spans the full product lifecycle, from user research and design documentation to impact-driven prioritization and experimentation.
            </p>
            <p>
              Currently at Piedmont Global Language Solutions, I define roadmaps, prioritize features, and lead distributed teams across multiple time zones. I've increased product adoption by 25%, reduced customer drop-off by 15%, and accelerated feature rollout timelines by 20%. My work includes designing internal dashboards, automated deployment pipelines, and workflow tools that improved team efficiency by 30% and reduced rollout errors by 40%.
            </p>
            <p>
              Previously at Ogilvy Africa Kenya, I delivered enterprise-grade digital solutions for Safaricom and M-Pesa, including a complete redesign of the agent onboarding portal and mobile dashboard for microloan tracking. I achieved 20-25% adoption growth among active users and reduced agent onboarding friction by 30%. My experience spans building and owning fintech products across Sub-Saharan Africa, managing ambiguous projects, and collaborating across multicultural, remote teams.
            </p>
            <p>
              Beyond technical leadership, I excel in end-to-end technical recruiting, leveraging Greenhouse ATS and structured evaluation rubrics to reduce time-to-hire by 35% and improve candidate quality. I've successfully grown engineering teams from 10 to 25 engineers in 12 months while maintaining a 90% senior hire acceptance rate. I'm passionate about mentorship, team development, and creating inclusive talent pipelines that drive diversity and innovation.
            </p>
            <p>
              Based in Nairobi, Kenya, I'm fluent in English and have elementary proficiency in French. I'm open to travel across Sub-Saharan Africa and thrive in fast-paced, high-ownership environments where I can make a meaningful impact on both technology and people.
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
