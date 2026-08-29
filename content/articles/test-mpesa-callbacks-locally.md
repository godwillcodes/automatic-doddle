---
title: "Testing M-Pesa Callbacks Locally Without ngrok"
metaTitle: "Test M-Pesa Callbacks Locally (No ngrok)"
slug: test-mpesa-callbacks-locally
excerpt: "I spent an afternoon restarting a tunnel, editing a URL, sending a shilling, and waiting. Twelve times. Then I worked out that most callback development needs no tunnel at all."
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

Restart ngrok. Copy the new subdomain. Paste it into the environment file. Restart the dev server. Trigger a push. Pick up the test phone. Enter the PIN. Wait. Watch the handler throw on line 40. Fix line 40.

Then do all of it again, because ngrok has handed you a different subdomain.

I did that twelve times in one afternoon. Somewhere around the ninth I stopped and asked what I was actually testing, and the answer was embarrassing: I was testing my own JSON parsing, over the public internet, through a tunnel, using a real phone and real money, at roughly two minutes per attempt.

Safaricom was not the thing under test. My handler was. And my handler does not need the internet.

## Start here: replay recorded payloads

Most callback development is one question. Given this payload, does my handler do the right thing? That question does not require a network at all.

Capture a few real payloads once, commit them as fixtures, and replay them whenever you like.

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

Look hard at the second one. There is no `CallbackMetadata` at all.

That asymmetry has broken more production integrations than anything else in the Daraja surface, and it is invisible if you only ever test the happy path. Your handler reaches for `CallbackMetadata.Item`, gets `undefined`, and throws. Not on the first payment. On the first payment somebody cancels, which is usually a real customer, usually on a Saturday.

A tiny replay script closes that loop in milliseconds:

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
node scripts/replay-callback.mjs success ws_CO_191220191020363925
node scripts/replay-callback.mjs cancelled ws_CO_191220191020363925

# The valuable one: send the same success twice.
node scripts/replay-callback.mjs success ws_CO_191220191020363925
```

That third command is worth more than the other two combined. Running the same success payload twice should leave your database exactly as it was after the first run. If a balance moves, you have the duplicate-crediting bug from [reconciliation and idempotency](/blog/mpesa-idempotency-reconciliation), and you just found it in two seconds without spending a shilling or touching the internet.

I found mine that way, months after shipping it, on a Tuesday morning with a coffee. The alternative was finding it the way I actually did the first time, which was a spreadsheet, two days, and forty customers with the wrong balance.

Wire the fixtures into the test suite and the loop disappears permanently:

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

Two tests. They run in under a second, and between them they cover the two failures that account for most production callback incidents.

## Capturing the fixtures honestly

The fixtures are only worth as much as their accuracy. A payload you typed from the documentation will drift from what Safaricom actually sends, and then your tests pass against a shape that does not exist.

So capture them from real traffic, once, and never hand-edit them afterwards.

```typescript app/api/payments/mpesa/callback/route.ts
export async function POST(request: Request) {
  const raw = await request.text()

  // In sandbox and preview only. Writes the exact bytes Safaricom sent to a
  // file you can commit as a fixture. Never in production: these payloads
  // contain a real customer's phone number.
  if (process.env.MPESA_CAPTURE_FIXTURES === 'true') {
    const code = JSON.parse(raw)?.Body?.stkCallback?.ResultCode ?? 'unknown'
    await fs.writeFile(`fixtures/mpesa/captured-${code}-${Date.now()}.json`, raw)
  }

  // ...
}
```

Then push one shilling through for each outcome you want to record, and you have a fixture set that is true by construction. Redact the phone number before committing, and only the phone number, because changing anything structural defeats the point.

The outcomes worth capturing are the ones sandbox cannot generate reliably: a successful payment, a cancellation at the PIN prompt, and a timeout where the customer never answers. Three files. They cover most of what will ever reach your handler.

## The timeout case is the one people miss

Everyone tests success. Most people eventually test cancellation. Almost nobody tests `1037`, which is what you get when the prompt was never answered because the phone was off or out of coverage.

It matters because a timed-out push is not a failed payment. The customer can still enter their PIN as your timeout fires, and the callback arrives afterwards saying it succeeded. If your handler has already marked the order failed and released the stock, you now have a paid order you cannot fulfil.

```typescript
it('does not close out an order on timeout', async () => {
  await givenPendingPayment('ws_CO_191220191020363925')

  await post(timeoutCallback)   // ResultCode 1037

  const payment = await db.payment.findUnique({
    where: { checkoutRequestId: 'ws_CO_191220191020363925' },
  })
  // Unresolved, not failed. The reconciliation sweep decides later.
  expect(payment?.status).toBe('PENDING')
})
```

That test encodes a business rule that is easy to get wrong under pressure and impossible to notice from the happy path.

## Catching contract drift

Fixtures have one weakness: they freeze a shape that a third party controls. If Safaricom renames a field, your tests keep passing against last year's payload while production breaks.

The cheap defence is a single scheduled test that runs against sandbox and asserts only the shape, not the values.

```typescript
it('sandbox still returns the callback shape we parse', async () => {
  const result = await initiateStkPush(sandboxPush())
  const callback = await waitForCallback(result.checkoutRequestId)

  const items = callback.Body.stkCallback.CallbackMetadata?.Item ?? []
  const names = items.map((i) => i.Name)

  expect(names).toEqual(
    expect.arrayContaining([
      'Amount',
      'MpesaReceiptNumber',
      'TransactionDate',
      'PhoneNumber',
    ])
  )
})
```

Run it nightly rather than on every commit. It is slow, it depends on a service you do not control, and a failure is information rather than a broken build. Failing it in CI on a Tuesday afternoon because sandbox was down is how a useful check gets deleted.

## Where this fits in CI

The tiers matter, because mixing them makes the fast tests slow and the slow tests unreliable.

Fixture replay is a unit test. No network, no database if you mock the settlement layer, runs in milliseconds, and belongs on every commit.

Idempotency and settlement are integration tests. They need a real Postgres because the guarantee they verify is a database constraint. A disposable container that comes up before the suite and goes away afterwards keeps them honest without keeping a database around.

The contract check is neither. It is a scheduled probe against somebody else's system, and it should page you rather than fail a build.

The thing that makes all of this worth setting up: I can now change the callback handler and know within two seconds whether I have broken duplicate handling. Before, that answer cost a tunnel restart, a real payment, and about two minutes of waiting with a test phone in my hand.

## When you do need a tunnel, make the URL permanent

Sometimes Safaricom really does need to reach you: verifying a payload shape against the real thing, or debugging why a callback is not arriving. For that you want a tunnel whose URL does not change, because the changing URL is the entire source of the pain.

Cloudflare Tunnel gives you a permanent hostname on a domain you already own, free:

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create mpesa-dev

# Map a stable subdomain to the tunnel, once and never again.
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

Now `MPESA_CALLBACK_URL` is a constant. It survives restarts, it goes into your environment file once, and every teammate can have their own subdomain instead of fighting over one tunnel.

One trap that costs an afternoon: whatever tunnel you use, the public URL must not redirect. Cloudflare's "Always Use HTTPS" is fine. An apex-to-www rule on the same zone will silently break every callback, because Safaricom does not follow redirects. That failure and its siblings are catalogued in [why your callback never arrives](/blog/mpesa-callback-not-received).

## Preview deployments, if you already have them

Per-branch previews give you a public HTTPS URL for every pull request, which means real Safaricom traffic against real infrastructure with no local tunnel.

The URL changes per deployment, so read it from the platform instead of hardcoding it:

```typescript lib/mpesa/config.ts
function resolveCallbackUrl() {
  if (process.env.MPESA_CALLBACK_URL) return process.env.MPESA_CALLBACK_URL

  // Vercel injects this for every deployment, including previews.
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (host) return `https://${host}/api/payments/mpesa/callback`

  throw new Error('No M-Pesa callback URL available in this environment')
}
```

Two warnings. Preview deployments are usually protected by default, and that protection blocks Safaricom exactly as effectively as a firewall, so the callback path has to be exempt. And use a sandbox shortcode for previews. Pointing a branch at your production shortcode is a mistake you make once, and it is a memorable one.

## A local stub, when the sandbox becomes the bottleneck

If you are building something with a lot of payment states, the sandbox starts to hurt. It is slow, occasionally down, and cannot produce most of the failures you need to handle.

At that point, stub it. A small server that speaks Daraja's shape and calls your callback on a timer:

```javascript scripts/fake-daraja.mjs
import { createServer } from 'node:http'

const CALLBACK = 'http://localhost:3000/api/payments/mpesa/callback'
const OUTCOMES = {
  // Amount-driven so a test can request a specific outcome deterministically.
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
```

Paying two shillings to test a cancellation beats remembering to press the right button on a handset. And sending the callback twice on every run means duplicate handling is not a test you might write one day, it is a property of your development environment.

## What I actually do now

On a normal day, fixtures and the replay script. Milliseconds, no internet, covers every handler change.

When adding a new Daraja endpoint, Cloudflare Tunnel against sandbox exactly once, to confirm the real payload matches my fixture. Then I update the fixture and go back to replaying.

Before launch, real money through the production shortcode, one shilling at a time, including a deliberate cancellation and a deliberate timeout. Sandbox will never show you either, and you want to have seen both before a customer does.

The stub earns its keep on projects with complicated payment state. On a simple checkout it is more machinery than the problem deserves.

The whole point is that the slow, expensive, real-money loop should be the last thing you do, not the loop you develop in. I spent an afternoon learning that. It should have taken twenty minutes of thinking.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [why callbacks go missing](/blog/mpesa-callback-not-received), [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation), and [getting approved for production](/blog/mpesa-daraja-production-go-live).
