/**
 * The professional record, in one place. Every section of the site reads from
 * here so a fact can never drift between two components. Nothing in this file
 * may be invented — it is transcribed from the CV and repository READMEs.
 */

export interface Role {
  period: string
  company: string
  title: string
  detail: string
  location: string
  bullets: string[]
  website?: string
}

export const roles: Role[] = [
  {
    period: '2025 — Now',
    company: 'Piedmont Global',
    title: 'Senior Web Engineer (Marketing)',
    detail: 'Public-facing marketing properties',
    location: 'Fairfax, VA · Remote',
    website: 'https://piedmontglobal.com/',
    bullets: [
      'Led React and Next.js development for public-facing marketing properties, introducing standardised performance budgets, shared component libraries, and build optimisations — code splitting, memoization, lazy loading — that improved Core Web Vitals and yielded ~40% gains in page speed and accessibility scores on key routes.',
      'Collaborated with engineering and DevOps to refine GitHub Actions–based CI/CD workflows: automated builds, Jest test suites, and preview deployments per branch — reducing time-to-merge and catching regressions earlier.',
      'Owned Google Tag Manager configuration and GA4 / Meta Pixel integrations, instrumenting key funnels and events while keeping tracking scripts loaded in a performance-conscious way.',
      'Created internal documentation and guidelines for SEO, accessibility, performance and shared tooling, mentoring engineers and content stakeholders.',
    ],
  },
  {
    period: '2024 — 2025',
    company: 'Ogilvy Africa Kenya',
    title: 'Staff Frontend Engineer',
    detail: 'Multi-project frontend platform',
    location: 'Nairobi, Kenya · Remote',
    website: 'https://www.ogilvy.com/kenya/',
    bullets: [
      'Led a distributed engineering team building and operating multiple client-facing React/Next.js and WordPress properties in a multi-project monorepo-style setup — shipping 15+ website features and campaigns per quarter while improving on-time delivery from 70% to 95% and reducing production defects by 30%.',
      'Defined and enforced standardised frontend tooling (shared ESLint/Prettier configs, component patterns, TailwindCSS conventions) and performance budgets across projects, cutting average page load times by ~35%.',
      'Partnered with product and marketing to run A/B tests on landing pages and funnels, using feature flags and analytics to analyse search performance, user behaviour and conversion impact.',
      'Acted as a go-to for frontend platform questions — unblocking engineers on build issues, deployment workflows and shared tooling, mentoring cross-functional developers across time zones and reducing handoff delays by 40%.',
    ],
  },
  {
    period: '2021 — 2024',
    company: 'Belva Digital Agency',
    title: 'Fullstack Engineer',
    detail: 'React, Next.js, Laravel',
    location: 'Nairobi, Kenya · Remote',
    website: 'https://belva.co.ke/',
    bullets: [
      'Developed and maintained React and Next.js applications (with TailwindCSS) backed by Laravel, contributing to shared component libraries, configuration patterns and deployment playbooks.',
      'Implemented code splitting, memoization and lazy loading as part of a standardised performance toolkit, significantly improving Core Web Vitals and page speed for SEO-critical and high-traffic landing pages.',
      'Designed and integrated RESTful and GraphQL APIs for complex, data-heavy interfaces, working with backend teams to define contracts and improve error handling.',
      'Wrote and maintained Jest unit tests for React/JavaScript components and integrated them into CI pipelines.',
    ],
  },
  {
    period: '2019 — 2021',
    company: 'Legibra Agency',
    title: 'Mobile Engineer',
    detail: 'React Native, Python',
    location: 'Nairobi, Kenya',
    website: 'https://legibra.com/',
    bullets: [
      'Built and maintained cross-platform applications using React Native, Bootstrap and Python, delivering production systems while enforcing clean code standards and performance optimisation.',
      'Integrated RESTful APIs and middleware services in agile environments, collaborating with distributed teams to ship iterative features.',
      'Wrote and maintained unit tests using Jest to ensure code reliability, catch regressions early and uphold high test coverage across React Native and JavaScript projects.',
    ],
  },
  {
    period: '2018',
    company: 'Procter & Gamble',
    title: 'Web Engineer, Intern',
    detail: 'Brand microsites',
    location: 'Nairobi, Kenya',
    website: 'https://us.pg.com/',
    bullets: [
      "Modernised regional brand microsites to align with P&G's global design systems and accessibility standards.",
      'Implemented marketing automation workflows, integrating CMS-driven content with analytics and engagement platforms.',
    ],
  },
]

export interface Metric {
  figure: string
  title: string
  context: string
  attribution: string
}

export const metrics: Metric[] = [
  {
    figure: '~40%',
    title: 'Page speed & accessibility gains',
    context:
      'On key routes, after performance budgets, shared component libraries and build optimisations were standardised.',
    attribution: 'Piedmont Global · 2025 — Now',
  },
  {
    figure: '95%',
    title: 'On-time delivery, up from 70%',
    context:
      'Standardised tooling and performance budgets applied across every project rather than per campaign.',
    attribution: 'Ogilvy Africa Kenya · 2024 — 2025',
  },
  {
    figure: '−35%',
    title: 'Average page load time',
    context:
      'Shared ESLint and Prettier configs, component patterns and TailwindCSS conventions, enforced across projects.',
    attribution: 'Ogilvy Africa Kenya · 2024 — 2025',
  },
  {
    figure: '−30%',
    title: 'Production defects',
    context: 'Recorded over the same standardisation programme that lifted delivery reliability.',
    attribution: 'Ogilvy Africa Kenya · 2024 — 2025',
  },
  {
    figure: '15+',
    title: 'Features & campaigns, per quarter',
    context:
      'Sustained cadence across multiple client-facing React/Next.js and WordPress properties.',
    attribution: 'Ogilvy Africa Kenya · 2024 — 2025',
  },
  {
    figure: '−40%',
    title: 'Handoff delays',
    context:
      'Outcome of owning frontend platform questions — build issues, deployment workflows, shared tooling — across time zones.',
    attribution: 'Ogilvy Africa Kenya · 2024 — 2025',
  },
]

export interface StackGroup {
  index: string
  title: string
  items: { tool: string; purpose: string }[]
}

export const stack: StackGroup[] = [
  {
    index: '01',
    title: 'Interface',
    items: [
      { tool: 'React', purpose: 'Component architecture' },
      { tool: 'Next.js', purpose: 'SSR · SSG · routing' },
      { tool: 'TypeScript', purpose: 'Type safety' },
      { tool: 'JavaScript ES6+', purpose: 'Language' },
      { tool: 'TailwindCSS', purpose: 'Styling conventions' },
      { tool: 'HTML5 · CSS3', purpose: 'Semantics · layout' },
      { tool: 'React Native', purpose: 'Cross-platform' },
      { tool: 'Storybook', purpose: 'Design systems' },
    ],
  },
  {
    index: '02',
    title: 'Platform',
    items: [
      { tool: 'WordPress', purpose: 'CMS architecture' },
      { tool: 'Laravel · PHP', purpose: 'Application backend' },
      { tool: 'REST · GraphQL', purpose: 'API contracts' },
      { tool: 'Python', purpose: 'Services · tooling' },
      { tool: 'Nx · Turborepo', purpose: 'Monorepo workflows' },
      { tool: 'Docker · Kubernetes', purpose: 'Runtime' },
      { tool: 'AWS · Serverless', purpose: 'Infrastructure' },
    ],
  },
  {
    index: '03',
    title: 'Quality',
    items: [
      { tool: 'Core Web Vitals', purpose: 'The scoreboard' },
      { tool: 'Performance budgets', purpose: 'The constraint' },
      { tool: 'Profiling', purpose: 'Where time goes' },
      { tool: 'Code splitting', purpose: 'Ship less' },
      { tool: 'Memoization · lazy load', purpose: 'Do less' },
      { tool: 'Accessibility', purpose: 'Non-optional' },
      { tool: 'Jest', purpose: 'Unit & regression' },
      { tool: 'Lighthouse', purpose: 'Static asset analysis' },
    ],
  },
  {
    index: '04',
    title: 'Delivery',
    items: [
      { tool: 'GitHub Actions', purpose: 'CI/CD' },
      { tool: 'Preview environments', purpose: 'Per branch' },
      { tool: 'Vite · Webpack', purpose: 'Build' },
      { tool: 'ESLint · Prettier', purpose: 'Shared configs' },
      { tool: 'GTM · GA4 · Pixel', purpose: 'Instrumentation' },
      { tool: 'Feature flags · A/B', purpose: 'Experimentation' },
      { tool: 'Logging · alerting', purpose: 'Observability' },
      { tool: 'Incident resolution', purpose: 'When it breaks' },
    ],
  },
]

export interface Instrument {
  spec: string
  name: string
  summary: string
  facts: { key: string; value: string }[]
  repo: string
}

export const instruments: Instrument[] = [
  {
    spec: 'Spec. 01',
    name: 'PixelPress',
    summary:
      'A compression and conversion utility that treats "smallest acceptable file" as a search problem rather than a setting. Binary search across quality 1–100 with tolerance-based convergence; parallel probes; dimension scaling as a fallback when quality alone will not reach the target.',
    facts: [
      { key: 'Engineering problem', value: 'Convergence without visible damage' },
      { key: 'Stack', value: 'Next.js · React · Sharp · TypeScript' },
      { key: 'Delivery', value: 'Installable PWA · offline' },
      { key: 'Licence', value: 'MIT' },
      { key: 'Status', value: 'In development' },
    ],
    repo: 'https://github.com/godwillcodes/PixelPress',
  },
  {
    spec: 'Spec. 02',
    name: 'Site Performance Tracker',
    summary:
      'A WordPress plugin that runs synthetic audits against the PageSpeed Insights API and collects real-user Core Web Vitals from live traffic, storing both in indexed custom tables with a retention policy. The background worker is plain PHP, so it runs on ordinary hosting.',
    facts: [
      { key: 'Engineering problem', value: 'Async work without a Node runtime' },
      { key: 'Stack', value: 'PHP 8 · WordPress 6 · PSI API' },
      { key: 'Access', value: 'Admin UI · REST · WP-CLI' },
      { key: 'Licence', value: 'GPLv2 or later' },
      { key: 'Status', value: 'v1.0.0 · maintained' },
    ],
    repo: 'https://github.com/godwillcodes/WPSitePerformanceTracker',
  },
]

export const progression = [
  'Web Engineer',
  'Mobile Engineer',
  'Fullstack Engineer',
  'Staff Frontend Engineer',
  'Senior Web Engineer',
]

export const contact = {
  email: 'godwill.codes@gmail.com',
  phone: '+254 781 249 443',
  phoneHref: 'tel:+254781249443',
  github: { label: 'github.com/godwillcodes', href: 'https://github.com/godwillcodes' },
  linkedin: { label: 'in/godwillcodes', href: 'https://www.linkedin.com/in/godwillcodes/' },
  medium: { label: 'iamgodwillb.medium.com', href: 'https://iamgodwillb.medium.com/' },
}
