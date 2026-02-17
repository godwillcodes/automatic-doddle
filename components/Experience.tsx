'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

type ExperienceItem = {
  company: string
  title: string
  team?: string
  location: string
  dates: string
  bullets: string[]
  website?: string
}

const experience: ExperienceItem[] = [
  {
    company: 'Piedmont Global',
    title: 'Senior Web Engineer',
    team: '(Marketing)',
    location: 'Fairfax, VA',
    dates: 'May 2025 – Present (Remote)',
    website: 'https://piedmontglobal.com/',
    bullets: [
      'Frontend platform & performance: Led React and Next.js development for public-facing marketing properties, introducing standardized performance budgets, shared component libraries, and build optimizations (code splitting, memoization, lazy loading) that improved Core Web Vitals and yielded ~40% gains in page speed and accessibility scores on key routes',
      'Tooling & CI/CD: Collaborated with engineering and DevOps teams to refine GitHub Actions–based CI/CD workflows for these sites, including automated builds, Jest test suites, and preview deployments per branch, reducing time-to-merge and catching regressions earlier in the process.',
      'Observability & analytics: Owned Google Tag Manager configurations and GA4/Meta Pixel integrations, instrumenting key funnels and events while ensuring tracking scripts were loaded in a performance-conscious way and monitored via dashboards and alerts for data quality issues.',
      'Cross-team enablement: Created internal documentation and guidelines for SEO, accessibility, performance, and shared tooling, mentoring other engineers and content stakeholders to use the platform effectively.',
    ],
  },
  {
    company: 'Ogilvy Africa Kenya',
    title: 'Staff Frontend Engineer',
    location: 'Nairobi, Kenya',
    dates: 'July 2024 – May 2025 (Remote)',
    website: 'https://www.ogilvy.com/kenya/',
    bullets: [
      'Frontend platform & delivery at scale: Led a distributed engineering team building and operating multiple client-facing React/Next.js and WordPress properties in a multi-project monorepo-style setup, shipping 15+ website features and campaigns per quarter while improving on-time delivery from 70% to 95% and reducing production defects by 30%.',
      'Standards, tooling & performance budgets: Defined and enforced standardized frontend tooling (shared ESLint/Prettier configs, component patterns, TailwindCSS conventions) and performance budgets across projects, cutting average page load times by ~35% and pushing Lighthouse performance, accessibility, and SEO scores into the 90s on key marketing and landing pages.',
      'Experimentation & measurement: Partnered with product and marketing teams to run A/B tests on landing pages and funnels, using feature flags and analytics to analyze search performance, user behavior, and conversion impact, and feeding these insights back into shared templates and patterns.',
      'Developer experience & mentorship: Acted as a go-to for frontend platform questions, unblocking engineers on build issues, deployment workflows, and shared tooling, while mentoring cross-functional developers across time zones and reducing handoff delays by 40% through clearer documentation, async communication practices, and improved engineering processes.',
    ],
  },
  {
    company: 'Belva Digital Agency',
    title: 'Fullstack Engineer',
    location: 'Nairobi, Kenya',
    dates: 'April 2021 – June 2024 (Remote)',
    website: 'https://belva.co.ke/',
    bullets: [
      'Shared frontend platform for multiple products: Developed and maintained React and Next.js applications (with TailwindCSS) backed by Laravel, contributing to shared component libraries, configuration patterns, and deployment playbooks used across a central repo to keep behavior consistent and reduce duplication.',
      'Performance-focused tooling: Implemented code splitting, memoization, lazy loading as part of a standardized performance toolkit, significantly improving Core Web Vitals and page speed for SEO-critical and high-traffic landing pages, and documenting patterns so other teams could adopt them quickly.',
      'APIs and backend-intensive workflows: Designed and integrated RESTful and GraphQL APIs for complex, data-heavy interfaces, working closely with backend teams to define contracts, improve error handling, and ensure the frontend remained resilient to upstream changes.',
      'Testing and CI/CD: Wrote and maintained Jest unit tests for React/JavaScript components and integrated them into CI pipelines (e.g., GitHub/GitLab CI), improving confidence in refactors and enabling automated checks on every push/merge.',
    ],
  },
  {
    company: 'Legibra Agency',
    title: 'Mobile Engineer',
    location: 'Nairobi, Kenya',
    dates: 'Jan 2019 – April 2021',
    website: 'https://legibra.com/',
    bullets: [
      'Built and maintained cross-platform applications using React Native, Bootstrap, and Python, delivering production systems while enforcing clean code standards and performance optimization.',
      'Integrated RESTful APIs and middleware services in agile environments, collaborating with distributed teams to ship iterative features and maintain code quality.',
      'Wrote and maintained unit tests using Jest to ensure code reliability, catch regressions early, and uphold high test coverage across React Native and JavaScript projects.',
    ],
  },
  {
    company: 'Procter & Gamble',
    title: 'Web Engineer (Intern)',
    location: 'Nairobi, Kenya',
    dates: 'Feb 2018 – July 2018',
    website: 'https://us.pg.com/',
    bullets: [
      "Modernized regional brand microsites to align with P&G's global design systems and accessibility standards, supporting digital transformation initiatives.",
      'Implemented marketing automation workflows, integrating CMS-driven content with analytics and engagement platforms to improve campaign tracking and personalization.',
    ],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section ref={sectionRef} className="relative pb-12 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_110%_60%_at_50%_0%,black_35%,transparent_80%)]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/10 bg-black/2 mb-8">
            <span className="text-xs font-medium tracking-wider uppercase text-black/50">Work Experience</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black leading-[1.1]">
            Experience
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-black/50 leading-relaxed font-light">
            Roles focused on building high-performance web products, improving delivery reliability, and enabling teams through standards and tooling.
          </p>
        </motion.div>

        <div className="mt-14 lg:mt-16 max-w-7xl mx-auto">
          <div className="space-y-8">
            {experience.map((item, index) => (
              <motion.article
                key={`${item.company}-${item.title}-${item.dates}`}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl border border-black/10 bg-white p-7 sm:p-8"
              >
                <header className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xl sm:text-2xl font-semibold tracking-tight text-black">
                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 hover:text-black/80 transition-colors underline decoration-2 underline-offset-2 decoration-black/20"
                          >
                            {item.company}
                            <ExternalLink size={16} strokeWidth={1.5} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          item.company
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-black/40 font-light">{item.dates}</div>
                  </div>

                  <div className="text-base sm:text-lg text-black/55 font-light leading-relaxed">
                    <span className="text-black/70">{item.title}</span>
                    {item.team ? <span className="text-black/40"> {item.team}</span> : null}
                    <span className="text-black/30"> | </span>
                    <span className="text-black/40">{item.location}</span>
                  </div>
                </header>

                <div className="mt-6">
                  <ul className="space-y-3 text-sm sm:text-base text-black/55 font-light leading-relaxed">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/25 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 rounded-3xl border border-black/10 bg-black/2 p-7 sm:p-8"
          >
            <div className="text-xs font-medium tracking-wider uppercase text-black/40 mb-3">Open Source</div>
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-black mb-2">
              <a
                href="https://github.com/godwillcodes/PixelPress"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 hover:text-black/80 transition-colors underline decoration-2 underline-offset-2 decoration-black/20"
              >
                PixelPress
                <ExternalLink size={16} strokeWidth={1.5} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            <div className="text-sm sm:text-base text-black/55 font-light leading-relaxed">
              Next.js, Sharp, and TypeScript | High-performance image compression and conversion utility leveraging advanced algorithms to minimize file sizes while maintaining visual quality.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-3xl border border-black/10 bg-black/2 p-7 sm:p-8"
          >
            <div className="text-xs font-medium tracking-wider uppercase text-black/40 mb-3">Open Source</div>
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-black mb-2">
              <a
                href="https://github.com/godwillcodes/WPSitePerformanceTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 hover:text-black/80 transition-colors underline decoration-2 underline-offset-2 decoration-black/20"
              >
                Site Performance Tracker
                <ExternalLink size={16} strokeWidth={1.5} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            <div className="text-sm sm:text-base text-black/55 font-light leading-relaxed">
              WordPress plugin | Comprehensive website performance monitoring through automated synthetic audits and real user metrics. Built with Google PageSpeed Insights API integration, it delivers actionable insights to help you optimize your site's speed, Core Web Vitals, and overall user experience.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
