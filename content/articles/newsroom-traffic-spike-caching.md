---
title: "A Newsroom Site That Survives the Story That Breaks It"
metaTitle: "Newsroom Caching: Surviving a Traffic Spike"
slug: newsroom-traffic-spike-caching
excerpt: "A news site's traffic is not a curve, it is a series of cliffs. The architecture that serves a quiet Tuesday is not the one that survives the afternoon a story lands, and the difference is mostly cache strategy."
date: "2026-05-27"
category: "Editorial Platforms"
targetKeyword: "news website traffic spike caching"
keywords:
  - "newsroom CMS"
  - "news site caching"
  - "ISR"
  - "traffic spike"
  - "editorial platform"
  - "stale-while-revalidate"
featured: false
---

Most web applications have traffic that looks like a wave. A news site has traffic that looks like a cliff. Ninety-nine percent of the time it is quiet, and then one story gets picked up and the same page that was serving forty people a minute is serving forty thousand.

The uncomfortable part is that the spike arrives on the *newest* page: the one that was published minutes ago, has never been cached, and whose author is still editing it. Everything convenient about a CMS-backed site works against you at exactly that moment.

I rebuilt an independent Kenyan business publication as a server-rendered newsroom. This is what the cache strategy has to do.

## The article is not the problem. The index is.

A single article page is easy. It is one document, it barely changes after publication, and any cache will hold it.

What falls over is everything around it. The homepage, the section fronts, the "latest" rail, the related-articles block, the story count in the navigation. Those are the pages that change every time anything is published, and they are also the pages the spike lands on when people arrive from a social link and then click through.

So the shape of the problem is: **articles are cacheable for a long time, listings are cacheable for a short time, and the spike hits both.**

The mistake is to pick one revalidation window for the whole site. Too long and the newsroom publishes into a void for ten minutes. Too short and every listing page recomputes constantly under exactly the load you cannot afford it.

## Cache by how the content actually changes

Split it by lifecycle rather than by route:

```typescript app/articles/[slug]/page.tsx
/**
 * Articles change rarely after publication, and when they do it is a
 * correction that must appear immediately. Long window plus tag invalidation:
 * cheap in the common case, instant when it matters.
 */
export const revalidate = 3600

export async function generateStaticParams() {
  // Only the recent ones are prerendered. An archive of tens of thousands
  // does not need to be built to be fast; it needs to be cacheable on first
  // request, which it is.
  const recent = await getRecentArticleSlugs({ limit: 500 })
  return recent.map((slug) => ({ slug }))
}
```

```typescript app/(fronts)/page.tsx
/**
 * Fronts change on every publish. Short window, so an unrevalidated front is
 * never more than a minute stale, and a publish busts it explicitly anyway.
 */
export const revalidate = 60
```

Then invalidate on the event, not on the clock:

```typescript app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

/**
 * Called by the CMS on publish. Two tags, because the blast radius differs:
 * one article changing should not rebuild every front, but a new article
 * appearing must.
 */
export async function POST(request: Request) {
  const { type, slug } = await verifiedPayload(request)

  if (type === 'article') {
    revalidateTag(`article:${slug}`, 'max')
    revalidateTag('fronts', 'max')
  }

  return Response.json({ revalidated: true })
}
```

The revalidation window is now a safety net rather than the mechanism. In normal operation the webhook makes publishing instant. If the webhook fails, the site is stale for sixty seconds instead of stale forever, which is the right failure mode for a newsroom: degraded, not broken.

## Serve stale rather than serve nothing

The single most valuable header on a news site is `stale-while-revalidate`.

Under a spike, the difference between a cache that blocks on revalidation and one that serves stale content while it refreshes is the difference between a slow site and a down site. Blocking means every request that arrives during a revalidation queues behind it. At forty thousand a minute, that queue is the outage.

```typescript
return new Response(body, {
  headers: {
    // Fresh for a minute. Stale for a day, served instantly, refreshed in
    // the background. A reader seeing a ninety-second-old front page is a
    // non-event. A reader seeing a timeout is the story.
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
  },
})
```

The long `stale-while-revalidate` is deliberate. It is not saying the content may be a day old; it is saying that if the origin is unreachable for a day, keep serving readers rather than showing them an error. During an incident that is the behaviour you want, and it costs nothing when things are healthy.

## The editor is a load pattern

Here is the thing about newsroom software that general-purpose caching advice misses: someone is editing the article while it is being read by forty thousand people.

A typo gets fixed. A headline gets sharpened. A correction goes on. Each of those is a write during peak read load, and each one invalidates the hottest page on the site.

If a publish invalidates broadly, an editor fixing three typos in a minute triggers three full rebuilds of the fronts during the spike. The CMS becomes a denial of service against the site it publishes.

Two mitigations, both cheap:

**Scope invalidation tightly.** A body edit touches `article:${slug}` only. Nothing about the fronts changed, because the headline and the ordering did not. Only a change to what appears *in* a listing should invalidate listings.

**Debounce it.** Editors save constantly. Collapsing invalidations for the same document inside a short window turns ten saves into one rebuild, and nobody can perceive the difference.

```typescript
/**
 * Editors save far more often than readers need to see. Collapsing repeated
 * invalidations of the same document keeps a burst of typo fixes from
 * rebuilding the same page ten times during a spike.
 */
const pending = new Map<string, NodeJS.Timeout>()

export function scheduleInvalidation(tag: string, ms = 5000) {
  clearTimeout(pending.get(tag))
  pending.set(
    tag,
    setTimeout(() => {
      revalidateTag(tag, 'max')
      pending.delete(tag)
    }, ms)
  )
}
```

That in-memory map is per-instance, which is fine for debouncing and wrong for anything that must be exactly once. If you need the guarantee, move it to shared storage. For collapsing editor saves, best effort is really enough.

## What actually breaks under load

From watching it happen rather than from theory.

**The related-articles query.** It is a per-article query, it is usually the most expensive one on the page, and it is almost always cached with the article rather than separately. Under a spike on one article, that single query runs on every cache miss. Precompute related articles at publish time and store them on the document. It is a denormalisation, and it is worth it.

**The image origin.** Everyone caches HTML and forgets that a lead image is fetched by every reader too. If images resize on demand, the first spike is a bill and the second is a timeout. Resize on upload, cache aggressively, and never let a query string become part of the cache key by accident.

**Analytics and embeds.** A third-party script on the article page is a third-party dependency in your critical path. When a story goes wide, the embed provider is getting your spike too, and they may handle it worse than you do. Load them after the content, and make sure a failure degrades the page rather than blocking it.

**The newsletter signup.** It is a write endpoint on the busiest page. It will get more traffic in an hour than in the previous month. Rate limit it before you need to.

## What I would do first

If a newsroom site is already live and the question is where to start:

1. **Split revalidation by content type.** Articles long, fronts short. This is a one-line change per route and the biggest single win.
2. **Add `stale-while-revalidate` everywhere.** It converts the worst failure mode into a mild one.
3. **Precompute related articles at publish.** It removes the most expensive query from the hottest path.
4. **Scope your invalidation tags.** Then watch what an editor actually does during a live story, because it will not be what you assumed.

None of this is exotic. It is mostly deciding, per piece of content, how stale it is allowed to be, and then being honest that the answer for a front page is not the answer for a three-year-old article. Newsrooms that fall over usually have one number applied to everything.
