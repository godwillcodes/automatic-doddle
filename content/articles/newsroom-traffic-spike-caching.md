---
title: "A Newsroom Site That Survives the Story That Breaks It"
metaTitle: "Newsroom Caching: Surviving a Traffic Spike"
slug: newsroom-traffic-spike-caching
excerpt: "A news site's traffic is not a curve, it is a cliff. And the spike lands on the newest page, the one that was published four minutes ago and whose author is still editing it."
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

Most web applications have traffic shaped like a wave. A news site has traffic shaped like a cliff.

Ninety-nine percent of the time it is quiet. Then a story gets picked up, and the page that was serving forty people a minute is serving forty thousand.

The cruel part is where the spike lands. It arrives on the *newest* page. The one published four minutes ago, that has never been cached, whose author is still in the CMS fixing a typo in the second paragraph. Everything convenient about a content management system is working against you at precisely that moment.

I rebuilt [Business Report](https://www.businessreport.co.ke), an independent Kenyan business publication, as a server-rendered newsroom. This is what I learned about what actually falls over.

## The article is not the problem. The index is.

A single article page is easy. One document, barely changes after publication, any cache will hold it happily.

What falls over is everything around it. The homepage. The section fronts. The latest rail. The related-articles block. The story count in the navigation. Those are the pages that change every time anything is published, and they are also the pages the spike hits when somebody arrives from a social link and then clicks through to see what else you have.

So the shape of the problem is this: articles are cacheable for a long time, listings are cacheable for a short time, and the spike hits both at once.

The mistake almost everyone makes, including me, is picking one revalidation window for the whole site. Too long and the newsroom publishes into a void for ten minutes, which editors will not tolerate and should not have to. Too short and every listing page recomputes constantly under exactly the load you cannot afford it.

## Cache by how the content actually changes

Split by lifecycle, not by route.

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

Then invalidate on the event rather than the clock:

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

Now the revalidation window is a safety net rather than the mechanism. Normally the webhook makes publishing instant. If the webhook fails, the site is stale for sixty seconds instead of stale forever, which is the right failure mode for a newsroom: degraded, not broken.

## Serve stale rather than serve nothing

The single most valuable header on a news site is `stale-while-revalidate`, and it took an incident for me to understand why.

Under a spike, the difference between a cache that blocks during revalidation and one that serves stale content while refreshing in the background is the difference between a slow site and a site that is down. Blocking means every request arriving during a revalidation queues behind it. At forty thousand requests a minute, that queue *is* the outage.

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

The long stale window is deliberate and it is not saying the content may be a day old. It is saying that if the origin becomes unreachable for a day, keep serving readers rather than showing them an error page. During an incident that is exactly the behaviour you want, and it costs nothing when everything is healthy.

## The editor is a load pattern

Here is the thing general caching advice never mentions, because it does not apply to most software: somebody is editing the article while forty thousand people are reading it.

A typo gets fixed. A headline gets sharpened. A correction goes on the bottom. Each of those is a write during peak read load, and each one invalidates the hottest page on the site.

If a publish invalidates broadly, an editor fixing three typos in a minute triggers three full rebuilds of every front page during the spike. Your CMS becomes a denial of service attack against the site it publishes.

Two mitigations, both cheap.

Scope invalidation tightly. A body edit touches `article:${slug}` and nothing else. The headline did not change and the ordering did not change, so nothing about the fronts is stale. Only a change to what appears *in* a listing should invalidate listings.

And debounce it. Editors save constantly, far more often than any reader needs to see:

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

That map is per-instance, which is fine for debouncing and wrong for anything requiring an exactly-once guarantee. If you need the guarantee, move it to shared storage. For collapsing editor saves, best effort is genuinely enough.

## What actually breaks under load

From watching it happen, not from theory.

**The related-articles query.** It is per-article, it is usually the most expensive query on the page, and it is almost always cached alongside the article rather than separately. Under a spike on one article that single query runs on every cache miss. Precompute related articles at publish time and store them on the document. It is a denormalisation and it is worth it.

**The image origin.** Everyone caches HTML and forgets that the lead image is fetched by every single reader too. If images resize on demand, your first spike is a bill and your second is a timeout. Resize on upload, cache hard, and never let a query string sneak into the cache key.

**Analytics and embeds.** A third-party script on the article page is a third-party dependency in your critical path. When a story goes wide, the embed provider is receiving your spike too, and they may handle it worse than you do. Load them after the content, and make sure a failure degrades the page instead of blocking it.

**The newsletter signup.** It is a write endpoint sitting on your busiest page, and during a spike it will receive more traffic in an hour than in the previous month. Rate limit it before you need to, not after.

## Where I would start

If a newsroom site is already live and you are wondering what to do first.

Split revalidation by content type. Articles long, fronts short. One line per route and it is the biggest single win available.

Add `stale-while-revalidate` everywhere, because it converts the worst failure mode into a mild one for almost no effort.

Precompute related articles at publish, which removes the most expensive query from the hottest path.

Scope your invalidation tags, and then go and watch what an editor actually does during a live story. It will not be what you assumed. Mine saved eleven times in four minutes while a story was climbing, and every one of those saves was rebuilding the homepage.

None of this is clever. It is mostly deciding, per piece of content, how stale it is allowed to be, and then being honest that the answer for a front page is not the answer for a three-year-old article. Newsrooms that fall over usually have one number applied to everything, and that number was chosen once, quickly, by somebody who was thinking about a different kind of website.
