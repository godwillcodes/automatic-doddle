---
title: "Reading Now-Playing Off the Stream Instead of Typing It Into a CMS"
metaTitle: "Radio Station Site: Now-Playing From the Stream"
slug: radio-station-now-playing-web
excerpt: "A station site that says what is on air because a person updated it is wrong within the hour. One that reads the broadcast is right by construction. The work is in the metadata, the polling, and what to show when the stream is unreachable."
date: "2026-06-03"
category: "Broadcast Systems"
targetKeyword: "radio station website now playing"
keywords:
  - "radio station website"
  - "now playing metadata"
  - "Icecast metadata"
  - "SHOUTcast"
  - "on air status"
  - "broadcast web"
featured: false
---

A listener emailed the station to say the website had been announcing the wrong presenter for three weeks. She knew, because she had been listening the whole time.

Most radio station websites lie about what is on air. Not deliberately. The schedule was typed into a CMS months ago, the presenter swapped a slot in April, and nobody updated the page. The site says one thing and the speaker says another.

That is a small credibility problem with a simple cause: the website and the broadcast are two separate systems that happen to describe the same thing, and one of them is maintained by hand.

I migrated [Khendo FM](https://www.khendofm.co.ke), a station covering Western Kenya and the North Rift, off WordPress, and the decision that mattered was making the site read the broadcast rather than describe it.

## Two different questions

"What is playing" and "are we on air" feel like one problem and are not.

**Now-playing** is track-level metadata that changes every few minutes. It comes from the streaming server, which gets it from the playout software.

**On-air state** is whether the station is broadcasting at all, and which show is running. It changes a handful of times a day and it is what somebody actually wants to know when they load the page during a power cut.

They come from different places and they fail differently. A stream can be up with no metadata, and metadata can be stale while the stream is fine. Treating them as one value produces a site that confidently displays a track that finished an hour ago.

## Where the metadata comes from

Most small stations run Icecast or SHOUTcast, or something built on them. Both expose a status endpoint, which is the honest source of truth for what the encoder is sending.

```typescript lib/broadcast/now-playing.ts
import 'server-only'

interface Source {
  server_name?: string
  title?: string
  listeners?: number
  stream_start_iso8601?: string
}

export interface NowPlaying {
  onAir: boolean
  title: string | null
  listeners: number | null
  /** When we read it, not when the track started. See below. */
  readAt: string
}

/**
 * Icecast exposes /status-json.xsl. The shape is inconsistent between
 * versions: `source` is an object with one mount and an array with several,
 * which is the single most common cause of this breaking after an upgrade.
 */
export async function readNowPlaying(): Promise<NowPlaying> {
  const readAt = new Date().toISOString()

  try {
    const response = await fetch(process.env.ICECAST_STATUS_URL!, {
      // Short. A station site must not hang because the encoder is slow.
      signal: AbortSignal.timeout(2500),
      cache: 'no-store',
    })

    if (!response.ok) return { onAir: false, title: null, listeners: null, readAt }

    const data = await response.json()
    const raw = data?.icestats?.source
    const source: Source | undefined = Array.isArray(raw) ? raw[0] : raw

    if (!source) return { onAir: false, title: null, listeners: null, readAt }

    const title = typeof source.title === 'string' ? source.title.trim() : ''

    return {
      // A mount that exists is a stream that is live. Metadata may still be
      // absent, which is a different thing from being off air.
      onAir: true,
      title: title.length > 0 ? title : null,
      listeners: typeof source.listeners === 'number' ? source.listeners : null,
      readAt,
    }
  } catch {
    // Unreachable encoder. Not an error worth surfacing to a listener, but
    // definitely not a claim that the station is on air.
    return { onAir: false, title: null, listeners: null, readAt }
  }
}
```

Two details that matter more than they look.

**The `source` shape changes.** One mount point and Icecast gives you an object; two and it gives you an array. A station that adds a low-bitrate mount breaks a site that assumed an object, months after anyone touched the code.

**`onAir` is true even with no title.** A live show with no track metadata is still a live show. Conflating "no metadata" with "off air" tells listeners the station is down while they are listening to it.

## The timestamp is when you read it

`readAt` is deliberately the read time, not a track start time.

Metadata does not tell you reliably when a track began. What you can honestly state is when you last successfully asked. That distinction is what lets the interface be truthful when things go wrong: "as of two minutes ago" is a real statement, and it degrades gracefully into "we cannot reach the stream right now" without ever asserting something you do not know.

Anything derived from a guessed start time will eventually display a track as playing for six hours.

## Do not poll from every browser

The obvious implementation has each visitor poll the status endpoint every fifteen seconds. With a hundred listeners that is four hundred requests a minute to an encoder that is also serving audio.

Poll once on the server, cache briefly, and let every visitor read the cache:

```typescript app/api/now-playing/route.ts
import { readNowPlaying } from '@/lib/broadcast/now-playing'

export const dynamic = 'force-dynamic'

export async function GET() {
  const state = await readNowPlaying()

  return Response.json(state, {
    headers: {
      // One upstream read per ten seconds regardless of audience size, and
      // stale served instantly if the encoder is briefly unreachable.
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
    },
  })
}
```

Ten seconds is a judgement call. Track changes are minutes apart, so ten seconds is already far finer than the underlying event, and it keeps load on the encoder flat as the audience grows. The encoder's job is broadcasting; it should not fall over because a story sent traffic to the website.

On the client, poll that route rather than the encoder, and back off when the tab is hidden:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function useNowPlaying(initial: NowPlaying) {
  const [state, setState] = useState(initial)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      // Nobody is looking. Do not spend their battery or your bandwidth.
      if (document.hidden) return
      try {
        const response = await fetch('/api/now-playing')
        if (!response.ok) return
        const next = await response.json()
        if (!cancelled) setState(next)
      } catch {
        // Keep showing the last known state rather than blanking the UI.
      }
    }

    const id = setInterval(tick, 15000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  return state
}
```

The `catch` that does nothing is intentional. A failed poll should leave the previous state on screen. Blanking the display because one request failed makes a working station look broken.

Note the initial state comes from the server, so the first paint already has real content. A now-playing widget that renders empty and fills in after hydration is a layout shift on the most prominent element on the page.

## Schedule as the fallback, not the source

Stations still want a schedule page, and it is useful: it is the only thing that can tell you what is on at eight tonight.

But the schedule should never be what the site consults to say what is on *now*. Live state wins; schedule fills the gap:

```typescript
/**
 * Live state is authoritative. The schedule is a fallback for when the
 * encoder is unreachable, and it is labelled as such rather than presented
 * as fact.
 */
export function currentShow(live: NowPlaying, schedule: Slot[]) {
  if (live.onAir) {
    const slot = slotAt(schedule, new Date())
    return { onAir: true, show: slot?.name ?? null, track: live.title, source: 'live' as const }
  }

  const slot = slotAt(schedule, new Date())
  return { onAir: false, show: slot?.name ?? null, track: null, source: 'schedule' as const }
}
```

Carrying `source` through to the interface is the honest move. "On air now" and "scheduled: Morning Drive" are different claims, and a listener can tell the difference. Presenting a schedule entry as live state is how a site ends up insisting a show is running during an outage.

## Connectivity shapes all of this

The audience is on the connection they actually have, which in much of Western Kenya means an entry-level Android phone on intermittent mobile data.

That changes several decisions. The polling interval is not free when data is metered, which is why the hidden-tab check earns its place. The initial state has to be server-rendered, because a widget that needs JavaScript before it says anything is blank for several seconds on a slow connection. And the failure state has to be designed rather than defaulted, because on a flaky network it is not an edge case, it is a regular Tuesday.

The general version of that constraint is worth reading in full: [building for the connection people actually have](https://www.lockandmercer.com/notes/building-for-the-connection-people-actually-have).

## The short version

- On-air state and now-playing are separate questions with separate failure modes. Do not merge them.
- A live mount with no metadata is still live. Say so.
- Timestamp what you read, not what you inferred.
- Poll once on the server, not once per browser.
- A failed poll keeps the last known state on screen.
- The schedule is a labelled fallback, never the source of truth for *now*.

The principle underneath all of it: a station site should derive its claims from the broadcast, so that being wrong requires the broadcast to be wrong too. Anything a human has to remember to update is something that will eventually be out of date, and on a station site the listener can hear that you are wrong.
