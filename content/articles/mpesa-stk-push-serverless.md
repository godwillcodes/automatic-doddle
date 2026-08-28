---
title: "Running M-Pesa STK Push on Serverless Without Losing Payments"
metaTitle: "M-Pesa STK Push on Serverless: What Breaks"
slug: mpesa-stk-push-serverless
excerpt: "Serverless removes the long-lived process that most M-Pesa integrations quietly assume. Here is what breaks — token caches, in-memory state, background work after the response — and what to do instead."
date: "2026-04-01"
category: "Mobile Money"
targetKeyword: "mpesa stk push serverless"
keywords:
  - "M-Pesa serverless"
  - "STK Push Vercel"
  - "Daraja API serverless"
  - "Next.js payments"
  - "webhook serverless"
featured: false
---

Every M-Pesa tutorial I have read assumes a server. Not explicitly — it just quietly relies on things a long-running Node process gives you for free: a module-level variable that persists, a `setTimeout` that survives the response, an in-memory map of pending transactions.

Deploy that same code to Vercel, Netlify, or Lambda and most of it still appears to work. That is the dangerous part. The failures are intermittent, load-dependent, and show up as payments that mysteriously didn't get credited.

I have moved two M-Pesa integrations onto serverless. These are the four things that actually broke.

## 1. The token cache is per-instance, not global

The standard token cache is a module-level variable:

```typescript
let cached: { token: string; expiresAt: number } | null = null
```

On a single Node process this is exactly right — one token, reused for an hour.

On serverless, each concurrent instance gets its own module scope. Ten instances means ten independent caches and ten calls to Daraja's OAuth endpoint. Under a traffic spike — which for a Kenyan e-commerce site means the hour after a payday SMS blast — you can get hundreds.

Daraja's auth endpoint is rate-limited. When you cross it, `getAccessToken()` starts throwing, and every STK Push fails at exactly the moment you have the most customers trying to pay.

The per-instance cache is still worth keeping, because it eliminates most of the calls. But it needs a shared layer behind it:

```typescript lib/mpesa/token.ts
import { getCache } from '@vercel/functions'

const KEY = 'mpesa:access-token'
let local: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
  // Cheapest path: this instance already has a live token.
  if (local && Date.now() < local.expiresAt) return local.token

  const cache = getCache()
  const shared = await cache.get<{ token: string; expiresAt: number }>(KEY)

  if (shared && Date.now() < shared.expiresAt) {
    local = shared
    return shared.token
  }

  const fresh = await requestNewToken()
  local = fresh
  // TTL slightly shorter than the token's own life so the entry can never
  // outlive what it caches.
  await cache.set(KEY, fresh, { ttl: 3300, tags: ['mpesa'] })

  return fresh.token
}
```

Redis works equally well if you already have one. The important property is that the cache outlives any single invocation.

There is a mild thundering-herd risk on expiry — several instances miss at once and all fetch. In practice this is a handful of extra requests once an hour, which is well inside the limit. If it bothers you, jitter the expiry per instance by a few seconds.

## 2. Work after the response does not happen

This pattern is everywhere:

```typescript
// This drops work on serverless.
export async function POST(request: Request) {
  const payload = await request.json()

  // Fire and forget.
  sendReceiptEmail(payload)
  updateAnalytics(payload)

  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

On a server, those promises resolve after the response is flushed. On serverless, the runtime may freeze or terminate the instance the moment you return. Sometimes the email sends. Sometimes it doesn't. It depends on whether another request kept the instance warm long enough — which is why this bug reproduces on staging almost never and on production constantly.

Two correct approaches. If the work is short, use `waitUntil` to tell the platform to keep the instance alive:

```typescript
import { waitUntil } from '@vercel/functions'

export async function POST(request: Request) {
  const raw = await request.text()

  // The part that must not be lost happens before the response.
  await db.mpesaCallback.create({ data: { raw, receivedAt: new Date() } })

  // The part that can be retried happens after it, explicitly tracked.
  waitUntil(processCallback(raw))

  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

If the work is long or must be durable across failures, enqueue it and let a separate function do it. `waitUntil` keeps the instance alive; it does not give you retries, and it is still bounded by the function's maximum duration.

The rule I use: **anything whose loss would cost money goes in the database before the response. Everything else can go in `waitUntil`.**

## 3. Nothing can hold the customer's transaction in memory

A common design keeps pending pushes in a `Map`, so the polling endpoint can answer without a database round trip.

On serverless, the instance that handled the STK Push is almost never the instance that receives the callback, and neither is likely to be the one that answers the poll. Three requests, three instances, three empty maps.

Everything must go through shared storage. Write the pending row before returning from the initiate endpoint — and note that on serverless the callback can genuinely beat your own response, because they are running on different machines:

```typescript app/api/payments/mpesa/route.ts
export async function POST(request: Request) {
  const { phone, amount, orderId } = await parse(request)

  const result = await initiateStkPush({ phone, amount, orderId })

  // Must be awaited, and must happen before the response. A different
  // instance may already be handling the callback for this push.
  await db.payment.create({
    data: {
      orderId,
      amount,
      status: 'PENDING',
      checkoutRequestId: result.checkoutRequestId,
    },
  })

  return Response.json({ checkoutRequestId: result.checkoutRequestId })
}
```

If the callback really does arrive first, the update finds no row. Handle it by upserting on `checkoutRequestId` rather than updating, so whichever write lands second fills in what the first one didn't:

```typescript
await db.payment.upsert({
  where: { checkoutRequestId },
  create: { checkoutRequestId, status: 'PAID', receipt, amount, orderId: null },
  update: { status: 'PAID', receipt },
})
```

An orphaned `PAID` row with a null `orderId` is recoverable — the reconciliation sweep will match it up. A dropped callback is not.

## 4. Cold starts eat your callback window

Safaricom does not wait long for your callback endpoint to respond, and it retries a limited number of times before giving up.

A cold start on a function with a heavy dependency tree — an ORM, a validation library, a mailer, an analytics SDK — can take a meaningful fraction of that window before your code runs at all. Add a cold database connection and you can exceed it.

Keep the callback route as thin as you can make it:

```typescript app/api/payments/mpesa/callback/route.ts
// No ORM, no mailer, no analytics SDK. Raw insert, then enqueue.
import { waitUntil } from '@vercel/functions'
import { sql } from '@/lib/db/raw'

export async function POST(request: Request) {
  const raw = await request.text()

  await sql`INSERT INTO mpesa_callback_raw (payload) VALUES (${raw})`
  waitUntil(enqueue('mpesa.callback', raw))

  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

Everything expensive — parsing, validating, settling, emailing — moves to the consumer, which has no deadline. The callback route does one insert and returns.

Fluid Compute helps here, because instances are reused across concurrent requests rather than one-per-request, so warm invocations are the common case. It does not eliminate cold starts, so the thin handler is still worth having.

Also make sure your database connections are pooled somewhere outside the function. Serverless plus a connection-per-instance Postgres client exhausts `max_connections` quickly, and the symptom looks exactly like a cold start.

## What actually stays the same

It is worth saying what serverless does *not* change, because it is easy to over-engineer in response to the above.

The Daraja protocol is identical. Token, push, callback, query — same endpoints, same payloads, same result codes. The [integration guide](/blog/mpesa-daraja-api-nextjs) applies unchanged.

Idempotency was already mandatory. Duplicate callbacks are Safaricom's behaviour, not the platform's, and a `UNIQUE` constraint on the receipt number works the same everywhere. If you followed [the reconciliation design](/blog/mpesa-idempotency-reconciliation), you are already correct under concurrency, which is most of what serverless demands.

Reconciliation was already mandatory too, and serverless makes it cheaper: a cron-triggered function costs nothing when idle, so the sweep that catches lost callbacks is easier to justify than it was on a box you were paying for by the hour.

## The checklist

Before you put a serverless M-Pesa integration in front of real customers:

- Token cache backed by shared storage, not just module scope
- Nothing important running after the response without `waitUntil`
- No in-memory transaction state; every read goes to the database
- Callback route upserts rather than updates
- Callback route kept thin, with heavy work enqueued
- Pooled database connections
- Reconciliation cron running and alerting on its counts
- Load-tested at your actual payday peak, not at one request per second

The last one is the one people skip. Every failure above is concurrency-shaped, and none of them reproduce at one request per second. Fire two hundred concurrent pushes at sandbox and watch what your token cache does.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [why callbacks go missing](/blog/mpesa-callback-not-received), [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation), and [testing callbacks locally](/blog/test-mpesa-callbacks-locally).
