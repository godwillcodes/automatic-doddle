---
title: "Testing M-Pesa Callbacks Locally Without ngrok"
metaTitle: "Test M-Pesa Callbacks Locally (No ngrok)"
slug: test-mpesa-callbacks-locally
excerpt: "Safaricom cannot reach localhost, and rotating tunnel URLs make it worse. Four ways to develop against Daraja callbacks properly, including a replay harness that needs no tunnel at all."
date: "2026-03-25"
category: "Mobile Money"
targetKeyword: "test mpesa callback locally"
keywords:
  - "test M-Pesa callback locally"
  - "Daraja sandbox"
  - "ngrok alternative"
  - "M-Pesa development"
  - "webhook testing"
featured: false
---

Daraja's callback is a plain outbound HTTPS POST from Safaricom's infrastructure to yours. Which means the moment you try to develop against it on a laptop, you hit the obvious wall: Safaricom cannot reach `http://localhost:3000`.

The standard answer is ngrok. It works. It is also the slowest possible development loop, because the free tier hands you a new subdomain on every restart, and every new subdomain means editing your `CallBackURL`, restarting the dev server, and pushing another test payment before you can see whether your handler works.

There are better options depending on what you are actually trying to test. Most of the time you are not testing Safaricom — you are testing your own handler — and that needs no tunnel at all.

## Option 1: replay recorded payloads (start here)

Ninety percent of callback development is "given this payload, does my handler do the right thing?" That question does not require the internet.

Capture a few real payloads once, commit them as fixtures, and replay them against your local server on demand.

```json fixtures/mpesa/success.json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 1 },
          { "Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV" },
          { "Name": "TransactionDate", "Value": 20191219102115 },
          { "Name": "PhoneNumber", "Value": 254708374149 }
        ]
      }
    }
  }
}
```

```json fixtures/mpesa/cancelled.json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode": 1032,
      "ResultDesc": "Request cancelled by user."
    }
  }
}
```

Note what is missing from the second one: there is no `CallbackMetadata` at all. That asymmetry is the single most common cause of a callback handler throwing in production, and you will never see it if you only ever test the happy path.

A tiny replay script:

```javascript scripts/replay-callback.mjs
import fs from 'node:fs'

const [, , name = 'success', checkoutRequestId] = process.argv
const url = process.env.CALLBACK_URL ?? 'http://localhost:3000/api/payments/mpesa/callback'

const payload = JSON.parse(fs.readFileSync(`fixtures/mpesa/${name}.json`, 'utf8'))

// Point the fixture at a real pending row so the handler has something to update.
if (checkoutRequestId) {
  payload.Body.stkCallback.CheckoutRequestID = checkoutRequestId
}

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

console.log(response.status, await response.text())
```

```bash
# Replay against a pending payment you just created.
node scripts/replay-callback.mjs success ws_CO_191220191020363925
node scripts/replay-callback.mjs cancelled ws_CO_191220191020363925

# And prove idempotency while you're there.
node scripts/replay-callback.mjs success ws_CO_191220191020363925
```

That third command is the valuable one. Running the same success payload twice should leave your database in exactly the state it was in after the first run. If it doesn't, you have the duplicate-crediting bug described in [M-Pesa reconciliation](/blog/mpesa-idempotency-reconciliation), and you just found it in two seconds without spending a shilling.

Wire the same fixtures into your test suite and the loop disappears entirely:

```typescript app/api/payments/mpesa/callback/route.test.ts
import { POST } from './route'
import success from '@/fixtures/mpesa/success.json'
import cancelled from '@/fixtures/mpesa/cancelled.json'

const post = (body: unknown) =>
  POST(new Request('http://test/api/payments/mpesa/callback', {
    method: 'POST',
    body: JSON.stringify(body),
  }))

it('settles a payment exactly once across duplicate deliveries', async () => {
  await givenPendingPayment('ws_CO_191220191020363925')

  await post(success)
  await post(success)

  const entries = await db.ledgerEntry.findMany({
    where: { reference: 'NLJ7RT61SV' },
  })
  expect(entries).toHaveLength(1)
})

it('does not throw when metadata is absent', async () => {
  await givenPendingPayment('ws_CO_191220191020363925')
  const response = await post(cancelled)
  expect(response.status).toBe(200)
})
```

## Option 2: a stable tunnel

When you do need Safaricom to actually call you — verifying your payload shape against the real thing, or debugging a URL-reachability problem — you want a tunnel with a URL that does not change.

Cloudflare Tunnel gives you a permanent hostname on a domain you already own, for free:

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create mpesa-dev

# Map a stable subdomain to the tunnel, once.
cloudflared tunnel route dns mpesa-dev mpesa-dev.yourdomain.co.ke
```

```yaml ~/.cloudflared/config.yml
tunnel: mpesa-dev
credentials-file: /Users/you/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: mpesa-dev.yourdomain.co.ke
    service: http://localhost:3000
  - service: http_status:404
```

```bash
cloudflared tunnel run mpesa-dev
```

Now `MPESA_CALLBACK_URL=https://mpesa-dev.yourdomain.co.ke/api/payments/mpesa/callback` is a constant. It survives restarts, it goes in `.env.local` once, and your teammates can each have their own subdomain.

If you would rather not install anything, `ngrok` with a reserved domain on the paid tier does the same job, and Tailscale Funnel works if your team is already on Tailscale.

One caveat that costs people an afternoon: whatever tunnel you use, the public URL must not redirect. Cloudflare's "Always Use HTTPS" is fine, but an apex-to-www rule on the same zone will silently break the callback, because Safaricom does not follow redirects.

## Option 3: preview deployments

If you deploy per-branch previews, you already have a public HTTPS URL for every pull request. Point the callback at it and you get real Safaricom traffic against real infrastructure with no local tunnel at all.

The catch is that the URL changes per deployment, so read it from the platform rather than hardcoding it:

```typescript lib/mpesa/config.ts
function resolveCallbackUrl() {
  if (process.env.MPESA_CALLBACK_URL) return process.env.MPESA_CALLBACK_URL

  // Vercel injects this for every deployment, including previews.
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (host) return `https://${host}/api/payments/mpesa/callback`

  throw new Error('No M-Pesa callback URL available in this environment')
}
```

Preview deployments are usually protected by default, which will block Safaricom as effectively as a firewall. You have to exempt the callback path from deployment protection or the request never lands — this is the same class of problem covered in [why your callback never arrives](/blog/mpesa-callback-not-received).

Use a separate sandbox shortcode for previews. Pointing a preview branch at your production shortcode is a mistake you make once.

## Option 4: a local Daraja stub

If you are building something with a lot of payment states — retries, partial refunds, split payments — the sandbox becomes the bottleneck. It is slow, occasionally down, and cannot produce most of the failure modes you need to handle.

At that point, stub it. Run a small server that speaks Daraja's shape and calls your callback on a timer:

```javascript scripts/fake-daraja.mjs
import { createServer } from 'node:http'

const CALLBACK = 'http://localhost:3000/api/payments/mpesa/callback'
const OUTCOMES = {
  // Amount-driven so tests can request a specific outcome deterministically.
  1: { ResultCode: 0, ResultDesc: 'Success' },
  2: { ResultCode: 1032, ResultDesc: 'Request cancelled by user' },
  3: { ResultCode: 1037, ResultDesc: 'DS timeout. Cannot be reached' },
  4: { ResultCode: 1, ResultDesc: 'Insufficient balance' },
}

createServer((req, res) => {
  if (!req.url.includes('/stkpush/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ access_token: 'stub-token', expires_in: '3599' }))
  }

  let body = ''
  req.on('data', (chunk) => (body += chunk))
  req.on('end', async () => {
    const { Amount } = JSON.parse(body)
    const checkoutRequestId = `ws_CO_stub_${Date.now()}`
    const outcome = OUTCOMES[Amount] ?? OUTCOMES[1]

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      MerchantRequestID: 'stub-merchant',
      CheckoutRequestID: checkoutRequestId,
      ResponseCode: '0',
      CustomerMessage: 'Success. Request accepted for processing',
    }))

    // Fire the callback after a delay, the way the real thing does. Twice,
    // so duplicate handling is exercised on every single run.
    const payload = buildCallback(checkoutRequestId, outcome, Amount)
    setTimeout(() => post(payload), 1500)
    setTimeout(() => post(payload), 2500)
  })
}).listen(4000, () => console.log('fake daraja on :4000'))

const post = (payload) =>
  fetch(CALLBACK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch((error) => console.error('callback failed', error))
```

Then `MPESA_ENV=stub` points `baseUrl` at `http://localhost:4000` and your whole payment flow runs offline, in about four seconds, with duplicate callbacks on every run.

Paying KES 2 to test a cancellation is a much better developer experience than remembering to press the right button on a test handset.

## What I actually use

On a normal day: fixtures and the replay script. It covers every handler change and runs in milliseconds.

When adding a new Daraja endpoint: Cloudflare Tunnel against sandbox, once, to confirm the real payload shape matches my fixture. Then I update the fixture and go back to option 1.

Before launch: real money through the production shortcode, KES 1 at a time, including a deliberate cancellation and a deliberate timeout. Sandbox will not show you those, and you want to have seen them before a customer does.

The stub earns its keep on projects with complicated payment state. On a simple checkout it is more machinery than the problem deserves.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [why callbacks go missing](/blog/mpesa-callback-not-received), and [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation).
