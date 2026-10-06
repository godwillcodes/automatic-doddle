# godwillbarasa.com — Site Review (Oct 2026)

Oct 6, 2026 · @Godwill Barasa

## Verdict

The site is technically clean and the writing is better than most engineering blogs, but it is not winning because the person entity is inconsistent, the M-Pesa content answers questions nobody types, and the design is a dark-only terminal aesthetic that does not show frontend mastery. In 38 days of Search Console data it earned 21 clicks from 1,119 impressions; 16 of those clicks were people typing your name, and blog posts earned 2.

The single biggest lever is not design. It is making one consistent, dated, third-party-corroborated "Godwill Barasa" entity that Google and Gemini can trust, then rebuilding the M-Pesa cluster around the exact questions developers search.

| Area | Grade | What decides it |
| --- | --- | --- |
| SEO (technical) | B+ | SSR, canonicals, sitemap, BlogPosting schema all correct. Weak on entity consistency, internal hubs, legacy-domain handling. |
| SEO (ranking outcomes) | D | Brand query averages position 2.75, not 1. Non-brand posts: 1,126 impressions, 2 clicks. |
| AISEO (Gemini / AI Overviews) | D | Nothing blocks Gemini. The site gives it too few corroborated facts and too few citable answers. llms.txt does not help Google. |
| Content posture | C+ | Strong, specific, experienced. Wrong intent match on key posts, no hubs, no external citations, no proof assets. |
| Writing (AI tells) | B− | No LLM vocabulary, em dashes already scrubbed. Remaining tells are structural: "not X, it is Y" cadence and one template for all 19 posts. |
| Design and motion | C | Coherent but derivative. Dark only, no light mode, 2 keyframes total, hover-only effects, muted text fails contrast. |
| Accessibility | B− | Skip link, landmarks, focus-visible, reduced-motion rule present. Contrast failures, 10–11px text, 143px sticky header on phones. |

## What Search Console actually says

Your "last 3 months" export only holds 38 days (27 Aug – 3 Oct 2026), so the property, or the www host, only started collecting data on 27 Aug. Treat every number here as an early baseline, not a trend.

&#91;embedded content: Chart.csv from your Search Console export, 27 Aug – 3 Oct 2026\]

Rankings got better while clicks stayed flat, which points at intent and snippet problems rather than authority.

- **Brand demand is tiny and you do not own it yet.** "godwill barasa" had 48 impressions at average position 2.75, with 16 clicks (33% CTR). Something else holds position 1 on some searches.
- **89% of impressions have no visible query.** The 48 listed queries cover 126 of 1,119 impressions; the rest are anonymised long-tail searches.
- **The blog is visible but unclicked.** 16 post URLs drew 1,126 impressions at positions 4.5–8.6 and 2 clicks. Positions that high with 0% CTR usually mean the result does not match what the searcher wanted.
- **The audience is not who you think.** Kenya: 122 impressions, 20 clicks. United States: 697 impressions, 1 click. Desktop: 1,002 impressions vs mobile 94, in a country where most browsing is on phones. A large share of impressions is likely automated (rank trackers, recruiter tooling, AI search fan-out). That is an inference; the export cannot prove it.
- **Three posts had zero impressions in 38 days:** cron-jobs-failing-in-silence, whatsapp-notifications-kenya and wordpress-performance-optimization. Check them in URL Inspection; they may not be indexed.
- **Contact had 318 impressions and 0 clicks** at position 7.3, almost certainly as a sitelink under brand searches.
- **No rich results.** The Search appearance export is empty. Expected: FAQ rich results stopped showing in Google on 7 May 2026.

**The query list is a background check.** Most visible queries are verification searches: "godwill barasa 2023 supervisor software developer", "godwill barasa 2021 full-time bachelor's degree", "godwill barasa team lead 2023", "godwill barasa teenager website", ""godwill.codes"". Someone (a recruiter, a vetting service, or an AI agent doing fan-out) is checking dated claims about you, and they land on pages at positions 7–16 that do not answer them. Your Record section has years but says "Fullstack Engineer" for 2021–2024, with no lead or supervisor role and no education line. Whatever your CV says for those years, the site must say the same thing, in plain dated text.

## SEO posture

The plumbing is right; the identity and the architecture are not. Fix the entity first, because every brand-query problem traces back to it.

### What is already correct (keep it)

- Server-rendered Next.js on Vercel. Pages return full HTML; the edge cache hits (x-vercel-cache: HIT); HSTS with preload.
- Self-referencing canonicals on every page checked; www is the canonical host; godwillbarasa.netlify.app redirects to it.
- robots.txt allows everything except /studio and points at the sitemap. All 19 posts are in sitemap.xml with image entries for the homepage photos.
- Each post has BlogPosting, BreadcrumbList, WebPage and a generated 1200×630 OG image, plus article:published\_time.
- 404s return a real 404 status with noindex.
- CLS measured 0.000; LCP about 1.1s on the homepage (one desktop run from Nairobi, not field data).

### Problems, in order of impact

| # | Problem | Evidence | Fix |
| --- | --- | --- | --- |
| 1 | Five different job titles for one person | Schema: "Software Engineer". Hero: "Senior Software Engineer". Record: "Senior Engineer, Web Platform". og:image:alt: "Senior Web Engineer". Lock & Mercer schema: "technology". | Pick one title and use it everywhere, including LinkedIn, GitHub bio and Lock & Mercer. |
| 2 | Schema names the wrong employer | Person.worksFor points to Lock & Mercer only, via an @id defined on another domain, which Google will not resolve. Visible copy says Piedmont Global. | worksFor: Piedmont Global as an inline Organization with url. Lock & Mercer goes in founder of, via an Organization node with sameAs. |
| 3 | Career history exists only as visual text | The Record section has six dated roles; none are in structured data. Verification queries for 2021 and 2023 rank 7–16. | Add hasOccupation / OrganizationRole entries with startDate and endDate, and a crawlable /about page with the same dated timeline. |
| 4 | knowsAbout omits what you rank for | Lists "Venture building", "Broadcast systems"; omits M-Pesa, Daraja, TypeScript, Node.js. | Lead knowsAbout with M-Pesa Daraja integration, payments reconciliation, TypeScript, Node.js, Next.js. |
| 5 | No /about page; /about redirects to home | A person site with one thin homepage has nowhere to put the long-form, dated biography that Google and AI systems quote. | Build /about as the canonical biography: ProfilePage + Person, 400–700 words, dated facts, photo, links out. |
| 6 | Topic cluster has no hub | 9 M-Pesa posts link only to 2 "related" posts each. No /blog/mpesa page. The blog index has one H1 and no headings per post. | Create an M-Pesa Daraja hub page that links every post in reading order and answers the top 10 questions in a sentence each. |
| 7 | Titles and H1s say different things | Title "M-Pesa Refunds and Reversals in Production" vs H1 "M-Pesa Refunds and Reversals: Undoing a Payment You Already Took". | Fine in principle, but write titles for the query (see Content), not the essay. |
| 8 | dateModified always equals datePublished | True on all 19 posts. | Set dateModified only when you edit content, and show "Updated" on the page when you do. |
| 9 | Legacy identities are loose ends | Queries for godwill.codes, godwillb.github.io and the Netlify URL. github.io returns a GitHub 404; godwill.codes did not load from here. | 301 every legacy host to the matching page. If you do not control a domain any more, remove it from profiles. |
| 10 | Duplicate robots meta on 404 | Two tags: "noindex" and "noindex, follow". | Emit one. Harmless today, but sloppy for a site that sells technical SEO. |
| 11 | Homepage FAQ schema | FAQ rich results were removed from Google on 7 May 2026. | Keep the visible Q&A (it helps AI answers) but stop expecting a SERP feature from it. |
| 12 | No RSS feed, email on a gmail address | /rss.xml and /feed.xml return 404. Footer uses godwill.codes@gmail.com. | Add /feed.xml (feeds get you picked up by aggregators and some AI crawlers). Use an address on your own domain. |

### The name problem

"Barasa" is a common Kenyan surname held by several politicians who dominate news results. On the non-Google engine I tested, "Godwill Barasa" returned only politicians, and even site:godwillbarasa.com returned none of your pages. Google does better (position 2.75), but you will not own the name until other sites repeatedly state "Godwill Barasa, software engineer, Nairobi" and link to you. That is off-page work, covered under AISEO.

## AISEO posture: why Gemini is not picking you up

Nothing on the site blocks Gemini. The problem is that Gemini has too little corroborated evidence about you and too few short, quotable answers in your posts.

### What it is not

- **Not robots.txt.** Your file allows all user agents, which includes Googlebot and Google-Extended. Google-Extended is the token that controls whether Gemini Apps may use your pages for grounding; it is allowed by your wildcard rule. ([Google crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers))
- **Not llms.txt.** Yours is good, but Google states plainly: "You don't need to create new machine readable files, AI text files, or markup to appear in these features." Gemini and AI Overviews draw from the Google Search index. ([AI features and your website](https://developers.google.com/search/docs/appearance/ai-features))
- **Not missing schema.** Google also says no special structured data is needed for AI features. Schema helps only by making facts consistent.

### What it is

1. **A weak, split entity.** Two Person nodes exist: godwillbarasa.com/#person and lockandmercer.com/team/godwill-barasa/#person, with different titles and photos. Gemini answers about people by agreeing facts across sources. Yours disagree, and few independent sources exist.
2. **Almost no third-party corroboration.** I found no press, conference listings, podcast pages, or Wikidata-style records naming you as a software engineer. Your own properties (GitHub, DEV, Medium, LinkedIn, Lock & Mercer) all point back to you, which is a closed loop.
3. **Answers are buried in narrative.** The refunds post never states the reversal window ("whatever window Safaricom applies"). The callback post is good, but its answer comes after an anecdote. AI systems quote the first clear, specific sentence under a heading that matches the question.
4. **No outbound citations.** 18 of 19 posts have zero links to Safaricom's Daraja docs; 0 of 19 have a table. Grounded systems prefer pages that look like they checked the primary source.
5. **A competing hub already owns the cluster.** mctaba.com/learn/mpesa ranks for the same callback and reconciliation topics with a summary under the H1, a named author bio, an FAQ block and a hub of linked lessons. ([example](https://mctaba.com/learn/mpesa/callback-urls-not-firing))

### Fixes, in order

1. Unify the entity: one @id (godwillbarasa.com/#person) used by both sites, one title, one photo, worksFor Piedmont Global, founder of Lock & Mercer, dated roles.
2. Publish /about as the canonical biography with dated facts that match your CV and LinkedIn word for word.
3. Earn five independent mentions in 90 days: a Daraja talk or meetup page in Nairobi, a guest post on a Kenyan tech publication, a podcast episode, a GitHub repo others star, a client case-study credit on SpaceYako or Business Report.
4. Rewrite each M-Pesa post so the first 60 words under every H2 answer the heading directly, with numbers, then tell the story. Link the Safaricom doc you are describing.
5. Add a 3–5 line summary block at the top of each post. Not marked up as anything special; just plain text a model can quote.
6. Submit the site to Bing Webmaster Tools and enable IndexNow. ChatGPT search and Copilot rely on Bing; the non-Google engine I tested had not indexed a single page.
7. Test monthly: ask Gemini, ChatGPT and Perplexity "Who is Godwill Barasa?" and "How do I reverse an M-Pesa transaction with Daraja?", and log whether you are cited.

## Content posture and 90-day plan

The raw material is strong: 19 posts from real production work, 9 of them on M-Pesa, with working code. What is missing is search intent, proof, and structure.

### Where the content falls short

- **Essay titles, not query titles.** "Our Trust Signal Could Be Earned by Clicking a Button" is a good headline and an invisible search result. Nobody types it.
- **Intent mismatch on the posts that do rank.** "mpesa refund" reached position 10. Most people typing that are customers who sent money to the wrong number; your post is for developers. Either target "Daraja reversal API" explicitly or add a short consumer section that answers the customer question and routes developers on.
- **Key facts left vague.** "Whatever window Safaricom applies", "whatever Safaricom's limit is". A production guide that will not name the limit loses to one that does. If the limit is not public, say exactly that and say what you observed.
- **No proof assets.** No images or diagrams in the three posts I inspected closely, and no tables in any of the 19. The homepage claims Safaricom and Co-operative Bank work with no case study, date or role attached.
- **The homepage sends readers away.** 7 of the 13 cards under Writing link to Lock & Mercer, and the counts disagree: "Pieces published 19", "All 13", "On this site 6", "Read all 19 pieces".
- **Publishing stopped.** Weekly from March to August, then nothing since 29 Aug.

### Three pillars

1. **M-Pesa Daraja in production** (the one you can own). A hub page plus one post per Daraja API and failure mode.
2. **Operating Kenyan web platforms.** Case studies with numbers for Business Report, Khendo FM, COFEK and SpaceYako: before/after Core Web Vitals, redirect counts, uptime, costs.
3. **Who Godwill Barasa is.** /about, a dated timeline, talks, a /uses page, and a short "now" page. This is what answers the verification searches.

### What to publish next

| Priority | Piece | Target query (check volume in Keyword Planner before writing) | Type |
| --- | --- | --- | --- |
| 1 | /about — dated biography | godwill barasa, godwill barasa software engineer | New page |
| 2 | M-Pesa Daraja integration hub | daraja api tutorial, mpesa api integration | New hub |
| 3 | Daraja STK Push result codes, explained | stk push result codes, 1032 / 1037 error | New, table-led |
| 4 | Reverse an M-Pesa payment with the Reversal API | daraja reversal api, mpesa reversal api | Rewrite of refunds post |
| 5 | Transaction Status Query as a callback safety net | mpesa transaction status api | New |
| 6 | Register C2B URLs without the usual failures | c2b register url daraja | New |
| 7 | Business Report migration: the redirect map, with numbers | wordpress to nextjs migration seo | Case study |
| 8 | COFEK on a 3G budget: what we measured | web performance kenya, core web vitals 3g | Case study |
| 9 | Generate the B2C SecurityCredential correctly | daraja security credential | New |
| 10 | Sandbox vs production: what changes on go-live | daraja go live, daraja production | Refresh of go-live post |

### Cadence and rules

1. Weeks 1–2: /about, hub page, fix titles and descriptions on the 9 M-Pesa posts.
2. Weeks 3–8: one post a week from the table above, each linking to the hub and to the Safaricom doc it covers.
3. Weeks 9–12: two case studies and one external piece (guest post or talk) that links back to /about.
4. Every post: query-shaped title, a 3–5 line summary, one table or diagram, one primary-source link, an "Updated" date when edited.

## Anti-AI writing audit

The word-level tells are already gone; the sentence-level and template-level tells are not. A reader who has seen a lot of model output will feel the rhythm before they spot any phrase.

There is no anti-AI writing skill in your account today (I checked your enabled skills). I have proposed one at the end of this session, built from the rules below.

### What I measured across all 19 posts (article text only, code removed)

| Signal | Result | Read |
| --- | --- | --- |
| LLM vocabulary (delve, robust, seamless, leverage, landscape, navigate, unlock…) | 1 hit in 19 posts | Clean |
| Em dashes in prose | Effectively none; the one per page is the "Listen — text-to-speech" label | Clean, possibly over-scrubbed |
| "Not X, it is Y" / "X, not Y" contrasts | 38 hits, in 17 of 19 posts | Main tell |
| Short fragment pairs ("Same amount, same person. Completely different records.") | 20 hits; 6 in one post | Secondary tell |
| nobody / somebody / anybody / everybody | 106 uses, about 5.6 per post | House tic |
| Length and structure | Every post 1,140–1,700 words, 4–10 H2s, cold-open anecdote, aphorism to close | Template |
| Tables | 0 of 19 | Missing |

The regex counts are approximate; treat them as a heat map, not a score.

### The tells, with your own lines

1. **The reveal contrast.** "Live domains, not case-study screenshots." "Weight measured on 3G, not on a Lighthouse run." "The deliverable on that migration was not the design — it was the verified redirect map." "A news site's traffic is not a curve, it is a cliff." "The fraud is not fake writing. It is stolen photographs." Each is fine alone. On every page, it reads generated.
2. **The two-beat summary.** Every description is a set-up sentence then a twist sentence. Read the llms.txt list top to bottom and the pattern is obvious.
3. **Aphorism closers.** "Verification that cannot be revoked is decoration." "Not for the code. For the conversation six months later." One per post is a signature; one per section is a template.
4. **Hedged facts inside confident prose.** "Whatever window Safaricom applies" sits next to very assured claims. Humans who did the work tend to name the number they saw.
5. **Performative UI copy.** "All systems nominal" (is it wired to real monitoring? If not, it is decoration), "Built and operated by the person whose name is on it", "I stay on the pager". Strong once; together they read as a persona.

### Rewrite rules

- Max one "not X, Y" contrast per post. Say what it is; skip what it is not.
- State the number, date, error code or limit you saw. If you do not know it, write "I could not find this documented; in our account it was N".
- Vary the opening: some posts start with the answer, some with code, some with a table. Not every post needs a story.
- Vary length to the topic: a result-code reference can be 600 words and a table; a migration case study can be 3,000.
- Use first-person specifics a model cannot invent: the client, the month, the shortcode type, the cost, the person who caught the bug.
- Allow some mess: a parenthetical, a mid-post correction, a "I still do not know why" that stays unresolved.
- Keep "nobody/somebody" under 2 per post.
- Read it aloud. If three sentences in a row have the same length and shape, break one.

## Design, motion and accessibility

The current site is tidy and consistent, but it is the 2024–25 "engineer's status page" look: near-black, one acid-lime accent, uppercase mono labels, a ticking clock and a marquee of tech names. It signals taste; it does not show frontend mastery, because almost nothing on it is hard to build.

### What I found

| Area | Finding | Evidence |
| --- | --- | --- |
| Theme | Dark only. No light theme, no toggle, no prefers-color-scheme rules. | Forcing light mode in the browser left the page dark; 0 colour-scheme media rules in the CSS. |
| Motion | Very little of it. 2 @keyframes in the whole stylesheet, a marquee, and fade-ins. No View Transitions, no scroll-driven animation. | Stylesheet scan (54 KB of CSS). |
| Motion quality | Blog list fades in slowly; the page looks empty for about a second. | Screenshot of /blog right after load. |
| Hover-only effects | "Colour returns on hover" on the photographs, which never happens on a phone. | Homepage, Photographs section. |
| Contrast | Muted grey #6E7887 measures 3.82:1 on cards and 4.23:1 on the page. Fails WCAG AA for body text (4.5:1). | Used for card body copy at 14.5–15px and all tag labels. |
| Small text | 10–11px uppercase mono labels with wide tracking throughout. | Nav, tags, metadata, buttons. |
| Mobile header | Nav stacks into four rows; the sticky header is 143px of an 812px screen (18%). | 375px emulation. |
| Hero name | H1 is two block spans with no space, so its raw text is "GodwillBarasa". | Screen readers usually cope; the fix is one character. |
| Good | Skip link, landmarks, focus-visible styles, one reduced-motion rule, anchor links with aria-labels, CLS 0. | DOM and CSS checks. |

### Redesign brief

**Direction.** Keep the operator idea (you run what you build) but prove it with real artefacts instead of decoration: live status pulled from your monitoring, real Core Web Vitals per platform, a working M-Pesa sandbox demo, diagrams that animate. Cards stay the main unit, as you prefer.

**Theme system.** Define colours as tokens on :root, swap them under prefers-color-scheme, and store a manual override on html\[data-theme\]. Set color-scheme so form controls and scrollbars follow.

- The lime accent (#CAFF00) is 16:1 on your dark background but 1.05:1 on your light manifest colour (#F4F2ED). Light mode needs its own accent, for example #4D6B00 at 5.49:1, with lime kept only for fills behind dark text.
- Raise muted text to about #8A94A3 (5.57:1 on cards) and use it at 14px or above.

**Motion system (the showcase).**

1. Cross-document View Transitions between list and article: the card title morphs into the H1.
2. Scroll-driven animations (animation-timeline: view()) for section reveals and a reading-progress bar, with no JavaScript.
3. One signature piece per case study: an animated M-Pesa callback sequence diagram, a redirect-map visual for Business Report, a live waveform or now-playing card for Khendo FM.
4. Tokenised durations and easings (for example 120ms for UI, 240ms for layout, 600ms for hero), declared once.
5. Everything wrapped in prefers-reduced-motion: reduce, with a visible motion toggle next to the theme toggle.
6. Budget: no animation on the LCP element, transforms and opacity only, test INP on a mid-range Android.

**Header and footer.** A compact single-row header on phones (name left, menu button right, about 56px). A footer that works as a sitemap: Writing by topic, Platforms, About, Contact, feeds, and your social links.

**Lock & Mercer content.** Move studio notes off the homepage writing grid into their own clearly labelled band, or link to them from /about. Your own writing stays the hero.

**Accessibility bar.** WCAG 2.2 AA as the floor: 4.5:1 text, 24×24px minimum targets (aim for 44px on mobile), visible focus, no hover-only information, motion opt-out, audited with axe and a real screen reader pass on VoiceOver and TalkBack.

## Prioritised fix list

Do the first block this week; none of it needs the redesign.

**This week (hours, not days)**

- [ ] Pick one job title; update schema, hero, Record, og:image:alt, Lock & Mercer, LinkedIn and GitHub to match.
- [ ] Person schema: worksFor Piedmont Global, Lock & Mercer as founded organisation, knowsAbout led by M-Pesa Daraja, TypeScript, Node.js.
- [ ] Make Lock & Mercer's Person node reuse https://www.godwillbarasa.com/#person instead of its own @id.
- [ ] Add a space inside the H1 between the two name spans.
- [ ] Raise muted text from #6E7887 to about #8A94A3.
- [ ] URL Inspection on the three posts with zero impressions; request indexing.
- [ ] Bing Webmaster Tools + IndexNow.
- [ ] Fix the homepage counts (19 / 13 / 6) so they agree.

**Next 2–4 weeks**

- [ ] /about page with a dated timeline that matches your CV word for word.
- [ ] M-Pesa Daraja hub page; link every M-Pesa post to it.
- [ ] Rewrite titles and the first 60 words under each H2 on the 9 M-Pesa posts; add Safaricom doc links and a summary block.
- [ ] /feed.xml; a contact address on your own domain.
- [ ] 301 or retire every legacy host (godwill.codes, the GitHub Pages user site).

**Redesign (4–8 weeks)**

- [ ] Token-based light and dark themes with a manual toggle.
- [ ] Motion system: View Transitions, scroll-driven reveals, reduced-motion fallbacks.
- [ ] Compact mobile header and a sitemap footer.
- [ ] One animated signature artefact per platform case study.
- [ ] Accessibility audit (axe + VoiceOver + TalkBack) before launch.

**Measure at 90 days:** brand query at position 1.0, non-brand clicks above 50 a month, cited at least once by Gemini or ChatGPT for a Daraja question.

## Method, limits and sources

I audited the live site on 6 Oct 2026 in a real browser: raw HTML of the homepage, /blog, /contact and three posts; robots.txt, sitemap.xml, llms.txt and manifest; text of all 19 posts for the writing counts; contrast computed from rendered colours; desktop and 375px mobile views. I did not use any connectors and did not have access to your Search Console account beyond the CSVs you attached.

Limits:

- **No live Google results.** My search tool is not Google, so I could not see your actual Google SERP or AI Overview. Positions here come from your export only.
- **Performance is one lab run** from one connection, not field data. Check CrUX or Vercel Speed Insights before acting on it.
- **The "automated impressions" point is an inference** from the US/desktop/zero-click pattern, not proven.
- **Third-party mentions:** my search found none, but its index is limited; a Google search for your name in quotes is the better check.
- **Writing counts are regex-based** and will include some false positives.

Sources:

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: common crawlers, Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Search Engine Journal: Google drops FAQ rich results](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/)
- [mctaba.com: M-Pesa callback guide (competitor example)](https://mctaba.com/learn/mpesa/callback-urls-not-firing)
- [Lock & Mercer team page](https://www.lockandmercer.com/team/godwill-barasa)
- [godwillbarasa.com](https://www.godwillbarasa.com/), [llms.txt](https://www.godwillbarasa.com/llms.txt), [robots.txt](https://www.godwillbarasa.com/robots.txt), [sitemap.xml](https://www.godwillbarasa.com/sitemap.xml)
- Your Search Console export: Chart, Queries, Pages, Countries, Devices, Search appearance (web, 27 Aug – 3 Oct 2026)
