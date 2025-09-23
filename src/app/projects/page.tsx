import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import logoAnimaginary from '@/images/logos/animaginary.svg'
import logoCosmos from '@/images/logos/cosmos.svg'
import logoHelioStream from '@/images/logos/helio-stream.svg'
import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
import logoPlanetaria from '@/images/logos/planetaria.svg'

const projects = [
  {
    name: 'M-Pesa Agent Portal Redesign',
    description: 'Complete redesign of agent onboarding portal for Safaricom M-Pesa, reducing onboarding friction by 30% and achieving 20-25% adoption growth among active users.',
    role: 'Engineering Team Lead',
    link: { href: 'https://www.safaricom.co.ke/', label: 'safaricom.co.ke' },
    stack: ['React', 'TypeScript', 'GraphQL', 'GCP'],
  },
  {
    name: 'Microloan Tracking Dashboard',
    description: 'Mobile dashboard for microloan tracking and management, delivering enterprise-grade digital solutions for financial services across Sub-Saharan Africa.',
    role: 'Engineering Team Lead',
    link: { href: 'https://www.safaricom.co.ke/', label: 'safaricom.co.ke' },
    stack: ['React', 'TypeScript', 'GraphQL', 'Mobile'],
  },
  {
    name: 'Language Operations Platform',
    description: 'Scalable, user-centered language operation products with internal dashboards and automated deployment pipelines, increasing adoption by 25% and reducing customer drop-off by 15%.',
    role: 'Product Engineering Lead',
    link: { href: 'https://pgls.com/', label: 'pgls.com' },
    stack: ['React', 'TypeScript', 'CI/CD', 'Monitoring'],
  },
  {
    name: 'Technical Recruiting Pipeline',
    description: 'End-to-end technical recruiting system using Greenhouse ATS, reducing time-to-hire by 35% and growing engineering capacity from 10 to 25 engineers in 12 months.',
    role: 'Technical Lead',
    link: { href: 'https://pgls.com/', label: 'pgls.com' },
    stack: ['Greenhouse ATS', 'Process Optimization', 'Data Analytics'],
  },
  {
    name: 'Internal Tooling & Automation',
    description: 'Workflow tools and automated deployment pipelines that improved team efficiency by 30%, reduced rollout errors by 40%, and cut release cycle times from 4 weeks to 2.5 weeks.',
    role: 'Product Engineering Lead',
    link: { href: 'https://pgls.com/', label: 'pgls.com' },
    stack: ['Automation', 'DevOps', 'Monitoring', 'Observability'],
  },
  {
    name: 'Cross-Functional Team Leadership',
    description: 'Led distributed teams across multiple time zones, managing ambiguous projects and collaborating across multicultural, remote teams to deliver scalable products.',
    role: 'Technical Lead',
    link: { href: 'https://pgls.com/', label: 'pgls.com' },
    stack: ['Team Leadership', 'Remote Collaboration', 'Product Strategy'],
  },

]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Technical leadership and product engineering achievements across fintech and language solutions.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Leading Product Engineering Teams and Delivering Impact at Scale"
      intro="As a Technical Lead with 7+ years of experience, I've delivered scalable, user-centered products across fintech and language solutions. These projects showcase my expertise in full product lifecycle management, cross-functional team leadership, and building high-performing engineering talent."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Card as="li" key={project.name}>
            
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href}>{project.name}</Card.Link>
            </h2>
            <Card.Description>{project.description}</Card.Description>
            <p className="text-teal-400 my-2 text-xs">{project.role}</p>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
