---
title: "Every Check Was Green and the Map Was Broken for Everybody"
metaTitle: "When Monitoring Returns 200 and Users See Broken"
slug: monitoring-said-200-users-saw-broken
excerpt: "The tile server answered 200. The PNG was the right size. No console error, no failed request, nothing in Sentry. And every visitor was looking at a map with API KEY REQUIRED painted diagonally across it."
date: "2026-06-11"
category: "Engineering"
targetKeyword: "monitoring returns 200 but broken"
keywords:
  - "silent failure"
  - "map tiles API key"
  - "monitoring false negative"
  - "CARTO basemap"
  - "uptime checks"
featured: false
---

I found it by accident. I was on a call, sharing my screen, showing someone the [SpaceYako](https://www.spaceyako.com) property map. And there it was, running diagonally across every tile in pale grey letters: **API KEY REQUIRED**.

I had looked at that map a hundred times. So had the monitoring. Everything was green.

That is the part I still find hard to sit with. Not the bug. The bug was twenty minutes of work. What bothers me is that a system I had built specifically to tell me when things break had watched this happen and reported success, cheerfully, for however long it had been going on.

## What the checks actually verified

The dark basemap came from CARTO. At some point CARTO started requiring an API key for it.

Here is what a sane person would expect to happen: requests without a key get a 401, the tiles fail to load, the map goes blank, monitoring screams, I fix it before lunch.

Here is what happened instead. The tile server kept answering **200 OK**. It kept returning a valid PNG, of the expected dimensions, with the expected content type. The image just had a watermark stamped across it.

Walk through every check I had, and ask what each one saw:

The uptime check requested a tile and got a 200. Pass. The browser made the request and the request succeeded, so there was no console error and no failed network entry. Pass. Sentry captures exceptions, and nothing threw, because nothing was wrong from the code's point of view. Silence. A Playwright run asserted the map container rendered and the tiles were present, and they were present. Pass.

Every layer of the stack agreed. The map was fine.

The map was not fine. The map was ruined.

## The gap between "responded" and "correct"

I had built monitoring that answered the question *did the request succeed*. Nobody was asking *is the response the thing we wanted*.

For most failures those two questions have the same answer, which is why the gap goes unnoticed for years. A database that is down refuses connections. An API that breaks returns a 500. A deploy that fails does not deploy. The happy path and the healthy path are the same path, until one day a vendor decides that the polite way to enforce a new pricing tier is to keep serving you content with a notice printed on it.

That is not an unreasonable thing for a vendor to do. From CARTO's side it is friendlier than a hard 401, because your map keeps working. It just quietly stops being yours.

So the failure was not really CARTO's. The failure was that I had assumed a category of problem could not exist, and then built all my instrumentation on that assumption.

## Verifying it required looking at pixels

The only way I found the truth was to fetch a tile and actually look at the image. Not the status. Not the headers. The pixels.

```typescript
/**
 * The only check that would have caught this: pull a tile and compare it
 * against a known-good reference. Status codes cannot see a watermark.
 */
async function tileLooksRight(url: string, referenceHash: bigint) {
  const response = await fetch(url)
  if (!response.ok) return { ok: false, reason: 'status' }

  const buffer = Buffer.from(await response.arrayBuffer())
  const hash = await dHash(buffer)
  if (hash === null) return { ok: false, reason: 'undecodable' }

  // A watermark changes the gradient structure across the whole tile, so a
  // perceptual hash separates it from the same tile rendered cleanly.
  const distance = hammingDistance(hash, referenceHash)
  return { ok: distance <= 10, reason: distance > 10 ? 'content-drift' : null }
}
```

There is a small irony in this. I already had perceptual hashing in the codebase, written to catch property listings built from stolen photographs. The same technique that spots a reposted photo of a flat will spot a watermark stamped over a map tile, because both are asking whether two images are meaningfully the same. I had the tool. I had not thought to point it at my own infrastructure.

## The fix, and the better fix

The immediate fix was to move to Esri's dark canvas, which needs no key and comes from the same provider already serving the satellite layer in this app. One dependency instead of two, and one fewer vendor who can change their pricing model into my product.

The better fix was admitting what my monitoring was for. It watched availability. It did not watch correctness, and I had been reading availability as though it meant both.

So now, for anything a visitor actually looks at, I ask a harder question than *did it respond*. For third-party media, is the content still what it was. For a rendered page, does the text that should be there exist in the response body, not merely a 200 with an empty shell. For an API you did not write, does the shape of the payload still match, because a field being renamed does not throw until something downstream reads it.

None of that is exotic. It is mostly the difference between checking that the pipe is connected and checking what is coming out of it.

## A taxonomy of the failures that pass their own checks

After this I started collecting them, because once you know the shape you see it everywhere.

**Right status, wrong body.** The watermarked tile. Also: an API that starts returning an empty array instead of results, a CDN serving a stale error page with a 200, a search endpoint that quietly matches nothing after an index rebuild.

**Right body, wrong audience.** Content that renders correctly for you and not for a logged-out visitor, or on a device you do not own. Anything gated by a cookie you happen to have.

**Right everything, wrong time.** A cache serving something that was correct yesterday. Nothing about the response is malformed; it is simply describing a world that has moved on.

**Right output, no input.** A job that processes zero rows because its query stopped matching. Success and doing nothing look identical from the outside, which is the same failure as [a cron batch that never runs](/blog/cron-jobs-failing-in-silence).

**Degraded but functional.** A rate limiter that fell back to a weaker implementation and kept serving. The system works. It is just not doing what it claims, which I wrote about after finding [a limit that was a speed bump](/blog/rate-limit-that-was-a-speed-bump).

Every one of those returns a 200 to something. None of them is visible to a check that asks whether the request succeeded.

## Checking content, cheaply

You cannot perceptually hash everything and you do not need to. Three cheap assertions cover most of it.

Assert on text that must be present. Not that the page returned 200, but that it contains the headline, or a price, or the word your product cannot function without. A shell that renders with an empty state passes a status check and fails this one.

Assert on size bounds. A response that is suddenly a tenth of its usual length is almost always an error page or an empty result set wearing a success code.

Assert on freshness where the content has a timestamp. If the newest item on a feed is four days old and the feed publishes daily, something upstream stopped, regardless of how healthy the endpoint looks.

```typescript
// A content check, not an uptime check. Slower, noisier, and it catches the
// class of failure an uptime check is structurally blind to.
async function checkFront() {
  const response = await fetch(SITE)
  if (!response.ok) return fail('status', response.status)

  const html = await response.text()
  if (html.length < 20_000) return fail('suspiciously-small', html.length)
  if (!html.includes('data-latest-story')) return fail('no-content-marker')

  return ok()
}
```

These will produce false positives. A marketing change that renames a marker will page somebody. That is a cost worth paying, because the alternative is the failure mode I started with: weeks of confident green while every visitor saw something broken.

## The Friday thing

The ritual I mentioned is more specific than it sounds, because "look at the site" degrades into "glance at the homepage" within a fortnight.

I open the real production URL, in a private window so no session or cookie is helping me, on a phone rather than the machine I built it on. Then I do the thing a visitor does. Search for something. Open a listing. Look at the map. Start the flow that makes money.

It takes about four minutes. It has caught a broken map, a filter that silently returned nothing after an index change, and an image pipeline serving originals to mobile.

None of those would have paged. All of them were embarrassing.

## Why this one stayed with me

The uncomfortable arithmetic is that I do not know how long it ran. Days at least. Possibly weeks.

For that entire period, anybody who came to look at a property in Nairobi saw a map with somebody else's advertisement written across it. On a platform whose whole proposition is that you can believe what you are looking at, that is not a cosmetic bug. It is the product quietly saying, to every visitor, *nobody is minding this.*

And I would not have found it from a dashboard. I found it because I happened to have the screen shared and a second pair of eyes on the call.

That is the thing I actually took from it. Instrumentation tells you about the failures you already imagined. It cannot tell you about the ones you did not, and the ones you did not imagine are the ones that run for weeks. The only defence I have found is boringly manual: look at the real product, on a real connection, with your own eyes, on a schedule. Not the staging build. Not the component in isolation. The thing a stranger sees.

I do it every Friday now. It has caught two other things.

The map in question, with a basemap that belongs to nobody but us, is on [spaceyako.com](https://www.spaceyako.com).
