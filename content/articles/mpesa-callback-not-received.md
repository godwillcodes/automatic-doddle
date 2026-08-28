---
title: "Why Your M-Pesa Callback Never Arrives"
metaTitle: "M-Pesa Callback Not Received: Causes and Fixes"
slug: mpesa-callback-not-received
excerpt: "The customer paid, Safaricom took the money, and your app never found out. A ranked list of the reasons Daraja callbacks go missing, and how to tell which one is yours."
date: "2026-03-11"
category: "Mobile Money"
targetKeyword: "mpesa callback not received"
keywords:
  - "M-Pesa callback not received"
  - "Daraja callback URL"
  - "STK Push callback"
  - "M-Pesa webhook debugging"
  - "Safaricom Daraja"
featured: false
---

The support ticket always reads the same way. *"I paid, I got the M-Pesa message, but the order still says pending."*

Safaricom has the money. The customer has an SMS receipt with a transaction code. Your database has a row that says `PENDING` and will say `PENDING` forever, because the callback that was supposed to change it never arrived.

This is the most common failure in M-Pesa integrations, and it is almost never a bug in your handler. It is nearly always something between Safaricom and your handler. Here is how to work out which.

## First: is it actually missing?

Before debugging the network, rule out the boring answer — that the callback arrived and your code threw.

If your handler throws before it writes anything, Safaricom's POST still happened. From the outside that is indistinguishable from a missing callback, and it is a five-minute fix rather than a two-day one.

Log at the very top of the handler, before any parsing:

```typescript app/api/payments/mpesa/callback/route.ts
export async function POST(request: Request) {
  const raw = await request.text()

  // Log before parsing. If the body is malformed, this is the only record
  // you will have that Safaricom called you at all.
  console.log('[mpesa:callback] received', {
    at: new Date().toISOString(),
    bytes: raw.length,
    body: raw,
  })

  try {
    const payload = JSON.parse(raw)
    await handleCallback(payload)
  } catch (error) {
    console.error('[mpesa:callback] handler failed', error)
  }

  // Acknowledge regardless. See "Always return 200" below.
  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

If that line never appears in your logs, the request genuinely is not reaching you. Read on.

## The causes, roughly in order of how often I've hit them

### 1. The URL is not publicly reachable

Safaricom's servers make an ordinary outbound HTTPS request from the public internet. `localhost`, `127.0.0.1`, a private IP, a VPN-only host, or anything behind basic auth will never be reached.

This one is obvious in development and surprisingly common in staging, where teams put the whole environment behind an IP allowlist and forget the callback needs to be exempt.

```bash
# From a machine with no relationship to your infrastructure.
curl -i -X POST https://yourdomain.co.ke/api/payments/mpesa/callback \
  -H 'Content-Type: application/json' \
  -d '{"Body":{"stkCallback":{"CheckoutRequestID":"probe","ResultCode":1032,"ResultDesc":"probe"}}}'
```

If that does not return `200` from outside your network, Safaricom cannot reach it either. For getting a reachable URL during development without a public deploy, see [testing M-Pesa callbacks locally](/blog/test-mpesa-callbacks-locally).

### 2. HTTP instead of HTTPS, or a non-standard port

The callback URL must be `https://` on port 443. Plain HTTP is rejected. So is `https://example.com:8443`. Safaricom does not tell you this — the STK Push succeeds, the customer pays, and the callback is simply never attempted.

### 3. Your endpoint redirects

This one is vicious because it looks fine in a browser.

If your callback URL is `https://example.com/api/callback` and your host redirects to `https://www.example.com/api/callback`, the callback fails. Safaricom does not follow redirects. A `301` is a dead end.

Common sources: apex-to-www redirects, trailing-slash normalisation, and locale prefixes that turn `/api/callback` into `/en/api/callback`.

```bash
# -I shows the status without following. Anything in the 3xx range is a problem.
curl -sI -X POST https://yourdomain.co.ke/api/payments/mpesa/callback | head -1
```

In Next.js, watch for `trailingSlash: true` in `next.config.ts` — it will redirect `/api/callback` to `/api/callback/` and break every callback you receive.

### 4. Something in front of your app is blocking it

A WAF, bot protection, or rate limiter sees an unauthenticated POST with a JSON body from an unfamiliar Kenyan IP range and does exactly what you configured it to do.

Cloudflare's Bot Fight Mode is a repeat offender here. So is Vercel's firewall if you have added a rule that challenges non-browser traffic. The request never reaches your function, so there is nothing in your application logs — you have to look at the edge logs.

Exempt the callback path explicitly:

```typescript vercel.ts
import { routes, type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  headers: [
    // Ensure nothing upstream tries to negotiate or cache this path.
    routes.cacheControl('/api/payments/mpesa/callback', { public: false, maxAge: 0 }),
  ],
}
```

And in your firewall, allowlist the path rather than an IP range — Safaricom's egress addresses are not contractually stable.

### 5. You changed the URL but not in the right place

The callback URL is sent **per request**, in the STK Push payload. It is not a dashboard setting for STK Push.

If you registered a URL in the Daraja portal and assumed that was enough, your pushes are still going wherever `CallBackURL` in your payload points — which, in a lot of codebases, is a value someone hardcoded during a sandbox spike and never removed.

```typescript
// Read it from config. Never inline it, and never let the two diverge.
CallBackURL: mpesaConfig.callbackUrl,
```

Log the URL you send with every push. When a callback goes missing, the first question is "what URL did we actually ask for?" and you want that answered from data, not memory.

> The C2B API's Register URL call *is* a persistent registration, which is why this trips people up. STK Push and C2B behave differently, and half the confusion in Daraja integrations comes from applying one API's rules to the other.

### 6. You returned a non-200 and got dropped

Safaricom retries a failed callback a small number of times and then stops. If your handler was returning `500` during a deploy window, the retries can exhaust while you are still rolling out.

This is why the handler above returns `200` unconditionally. Acknowledge first, process second. A payload you failed to process is recoverable from your logs; a callback Safaricom has given up on is gone.

If your processing is heavy — sending email, generating a PDF, calling a fulfilment API — do not do it inline. Acknowledge, enqueue, and process out of band:

```typescript
export async function POST(request: Request) {
  const raw = await request.text()

  // Persist the raw payload synchronously; it is small and it is the record
  // of truth. Everything expensive happens after the 200.
  await db.mpesaCallback.create({ data: { raw, receivedAt: new Date() } })
  await queue.enqueue('mpesa.callback.process', { raw })

  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

### 7. The customer never completed it

Not every missing callback is missing. `ResultCode: 1037` means the prompt was never answered — phone off, out of coverage, or the user ignored it until it expired. You do get a callback for this, but if your handler only processes `ResultCode === 0` and logs nothing else, it looks identical to silence.

Handle every result code, even if handling means recording it and moving on.

## The safety net you need regardless

Every cause above is fixable. None of them are preventable in perpetuity — Safaricom has outages, your host has outages, and eventually a callback is genuinely lost.

So do not build a system that requires callbacks to be reliable. Build one that is *faster* when they work and still correct when they don't.

The mechanism is Daraja's query endpoint, used as a reconciliation sweep rather than a polling loop:

```typescript lib/mpesa/reconcile.ts
import { mpesaConfig } from './config'
import { getAccessToken } from './token'

/**
 * Asks Safaricom what happened to a push. Rate-limited, so this runs on a
 * schedule against stale pending rows — never in a request path.
 */
export async function queryStkStatus(checkoutRequestId: string) {
  const { timestamp, password } = stamp()
  const token = await getAccessToken()

  const response = await fetch(
    `${mpesaConfig.baseUrl}/mpesa/stkpushquery/v1/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    }
  )

  return response.json()
}

/**
 * Runs every few minutes. Anything pending for more than two minutes gets
 * asked about directly; the callback has clearly not arrived.
 */
export async function sweepStalePayments() {
  const stale = await db.payment.findMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: new Date(Date.now() - 2 * 60 * 1000) },
    },
    take: 50,
  })

  for (const payment of stale) {
    const result = await queryStkStatus(payment.checkoutRequestId)

    // ResultCode 0 means paid, even though no callback ever reached us.
    if (result.ResultCode === '0') {
      await settlePayment(payment.id, { source: 'reconciliation' })
    } else if (result.ResultCode && result.ResultCode !== '1032') {
      await failPayment(payment.id, result.ResultDesc)
    }
  }
}
```

Schedule it with a cron job:

```typescript vercel.ts
export const config: VercelConfig = {
  crons: [{ path: '/api/cron/mpesa-reconcile', schedule: '*/5 * * * *' }],
}
```

Two important constraints. The query endpoint is rate-limited far more aggressively than STK Push, so batch and cap it — `take: 50` above, not the whole backlog. And a push that is still genuinely in flight returns a "processing" state rather than a result, so do not fail a payment just because the query was inconclusive.

## The order to check things

When a callback goes missing, work down this list. It is ordered by how often each one has been the answer, in my experience:

1. Is there a log line at the top of the handler? If yes, it is your code, not the network.
2. Can you `curl` the URL from outside your infrastructure and get a `200`?
3. Does it redirect? Check the raw status code, not a browser.
4. Is it HTTPS on 443?
5. Check the edge or CDN logs for blocked requests.
6. Log the `CallBackURL` you sent with the push and compare it to what you expect.
7. Query the transaction directly and see what Safaricom thinks happened.

Nine times out of ten you stop at step 3.

The tenth time, your reconciliation sweep has already fixed it and nobody filed a ticket at all. That is the point of building it.

---

This is part of a series on production M-Pesa integration. Start with [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), then [make your writes idempotent](/blog/mpesa-idempotency-reconciliation).
