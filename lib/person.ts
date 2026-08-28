/**
 * The verified record for the person site. Every section reads from here.
 * Nothing may be added that is not on the verified-facts list: no years of
 * experience, no client counts, no traffic or revenue figures, no education,
 * no awards. If a number cannot be sourced, it is not here.
 */
import { lockAndMercer } from './site'

export const identity = {
  name: 'Godwill Barasa',
  h1Line: 'I build web platforms in Kenya, and then I run them.',
  summary:
    'Software engineer in Nairobi. I founded Lock & Mercer, a venture studio, and I run its technology.',
  stack: ['React', 'Next.js', 'Laravel', 'WordPress', 'TypeScript', 'Sanity', 'Vercel'],
  areas: [
    'Product engineering',
    'Editorial platforms and newsroom CMS',
    'Broadcast web systems',
    'Site migration',
    'Web performance and infrastructure cost',
    'Technical SEO',
    'Trust and verification systems',
  ],
} as const

export interface Platform {
  index: string
  name: string
  role: string
  url: string
  /** First-person account: decisions and mechanisms, not outcomes. */
  account: string[]
  /** The company side's full case study. Never reproduced here. */
  caseStudy: string
  caseStudyLabel: string
}

export const platforms: Platform[] = [
  {
    index: '01',
    name: 'SpaceYako',
    role: 'Property platform for Kenya, owned and operated by Lock & Mercer',
    url: 'https://www.spaceyako.com',
    account: [
      'The decision that shaped everything else: agents pay to list, seekers never pay, and no money moves between users. That rules out escrow, rules out disputes over deposits, and keeps the platform out of the flow of funds entirely.',
      'Verification was the harder call. A badge sits against an agent only while it can be substantiated. The moment it cannot, it comes off. A verification that never gets withdrawn is decoration, not verification.',
    ],
    caseStudy: `${lockAndMercer.url}/ventures/spaceyako`,
    caseStudyLabel: 'The venture, at Lock & Mercer',
  },
  {
    index: '02',
    name: 'Business Report',
    role: 'Independent Kenyan business publication',
    url: 'https://www.businessreport.co.ke',
    account: [
      'I rebuilt it as a server-rendered newsroom and carried the archive across on a redirect map verified against production. The map is the deliverable: every indexed URL either resolves or redirects, and the check runs against the live site, not a spreadsheet.',
      'What went wrong first: after the cutover, certificate renewal lapsed. Mail was up the whole time, but to everyone on the outside it looked down. The fault was the certificate, not DNS. I now treat certificate issuance as part of the cutover itself, not a thing that follows it.',
    ],
    caseStudy: `${lockAndMercer.url}/work/business-report`,
    caseStudyLabel: 'The full case study, at Lock & Mercer',
  },
  {
    index: '03',
    name: 'Khendo FM',
    role: 'Radio station across Western Kenya and the North Rift',
    url: 'https://www.khendofm.co.ke',
    account: [
      'Migrated off WordPress. The part I care about: the site reads on-air state and now-playing from the broadcast itself. A station site that says what is playing because someone typed it into a CMS is wrong within the hour. One that reads the broadcast cannot drift.',
    ],
    caseStudy: `${lockAndMercer.url}/work/khendo-fm`,
    caseStudyLabel: 'The full case study, at Lock & Mercer',
  },
  {
    index: '04',
    name: 'COFEK',
    role: 'Consumers Federation of Kenya',
    url: 'https://cofek.africa',
    account: [
      'A rebuild of cofek.africa. The constraint that mattered: the audience is on the connection people actually have, not the one in a device lab. Everything about the build follows from taking that seriously.',
    ],
    caseStudy: `${lockAndMercer.url}/work/cofek`,
    caseStudyLabel: 'The full case study, at Lock & Mercer',
  },
]

export interface Note {
  title: string
  line: string
  href: string
}

/**
 * Published on lockandmercer.com, attributed to him as author. Listed here
 * with one line each and linked across. Never copied: duplicating them across
 * two domains splits the signal for both.
 */
export const notes: Note[] = [
  {
    title: 'The redirect map is the deliverable',
    line: 'Why a migration is finished when the map verifies against production, not when the new site is up.',
    href: `${lockAndMercer.url}/notes/redirect-map-is-the-deliverable`,
  },
  {
    title: 'M-Pesa phone numbers are personal data',
    line: 'The number that pays is the number that identifies, and what that obliges a platform to do.',
    href: `${lockAndMercer.url}/notes/mpesa-phone-numbers-are-personal-data`,
  },
  {
    title: 'A badge is only worth what removes it',
    line: 'Verification that cannot be withdrawn is decoration. The withdrawal path is the product.',
    href: `${lockAndMercer.url}/notes/a-badge-is-worth-what-removes-it`,
  },
  {
    title: 'The cutover runbook nobody writes',
    line: 'DNS, certificates and mail during a migration: the hour where most cutovers actually fail.',
    href: `${lockAndMercer.url}/notes/the-cutover-runbook`,
  },
  {
    title: 'You are paying twice to resize the same image',
    line: 'Where image pipelines quietly double their cost, and how to notice.',
    href: `${lockAndMercer.url}/notes/paying-twice-to-resize-the-same-image`,
  },
  {
    title: 'A station site should know if it is on air',
    line: 'Reading broadcast state instead of typing it into a CMS.',
    href: `${lockAndMercer.url}/notes/a-station-site-should-know-if-its-on-air`,
  },
  {
    title: 'Building for the connection people actually have',
    line: 'Designing for the network conditions of the audience you have, not the office you sit in.',
    href: `${lockAndMercer.url}/notes/building-for-the-connection-people-actually-have`,
  },
]

export const profiles = [
  { label: 'Lock & Mercer', href: lockAndMercer.teamProfile, me: true },
  { label: 'GitHub', href: 'https://github.com/godwillcodes', me: false },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/godwillcodes/', me: false },
  { label: 'Medium', href: 'https://iamgodwillb.medium.com/', me: false },
  { label: 'DEV', href: 'https://dev.to/godwillb', me: false },
] as const

export interface Faq {
  question: string
  answer: string
}

/** Each answer must make sense quoted on its own with no page around it. */
export const faqs: Faq[] = [
  {
    question: 'Who is Godwill Barasa?',
    answer:
      'Godwill Barasa is a software engineer based in Nairobi, Kenya. He founded Lock & Mercer, a venture studio, and runs its technology.',
  },
  {
    question: 'What does Godwill Barasa do?',
    answer:
      'He builds and operates web platforms in Kenya: product engineering, editorial platforms, broadcast web systems, site migrations, web performance, technical SEO, and trust and verification systems. He works in React, Next.js, Laravel, WordPress, TypeScript, Sanity and Vercel.',
  },
  {
    question: 'Where is Godwill Barasa based?',
    answer: 'Godwill Barasa is based in Nairobi, Kenya.',
  },
  {
    question: 'What has Godwill Barasa built?',
    answer:
      'He built and operates SpaceYako, a property platform for Kenya; rebuilt Business Report, an independent Kenyan business publication, as a server-rendered newsroom; migrated Khendo FM, a radio station in Western Kenya and the North Rift, off WordPress; and rebuilt cofek.africa for the Consumers Federation of Kenya.',
  },
]
