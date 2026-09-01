---
title: "Getting Daraja Approved for Production, and What Breaks on the Way"
metaTitle: "Daraja Go-Live: Approval Checklist"
slug: mpesa-daraja-production-go-live
excerpt: "The code was finished on a Tuesday. We went live nineteen days later. Not one of those days was spent on engineering, and none of it was under my control."
date: "2026-05-13"
category: "Mobile Money"
targetKeyword: "daraja api go live production"
keywords:
  - "Daraja go live"
  - "M-Pesa production credentials"
  - "Daraja app review"
  - "M-Pesa shortcode"
  - "Safaricom developer portal"
featured: false
---

The integration was finished on a Tuesday. Every result code handled, callbacks idempotent, tests green, sandbox behaving perfectly. I told the client we could go live that week.

We went live nineteen days later.

Not one of those nineteen days was engineering. It was paperwork, a director who was travelling, an approval that covered one API and not the one we needed, and a callback URL that failed review for a reason nobody had mentioned anywhere. Every day of it was outside my control, and every day of it was predictable if I had known what to ask.

This is the article I wanted that Tuesday.

## You cannot do this as an individual

Production Daraja credentials go to a registered business, not a person. If you are building for a client, the shortcode and the credentials belong to the client's entity, and somebody at that entity has to sign as the authorised signatory.

Read that again, because it has a scheduling consequence that ruined my estimate: **you cannot unblock this yourself.**

Our director was travelling. Not unreachable, just travelling, in a way that turned a signature into a five-day round trip. I had budgeted zero days for it, because in my head it was administrative, and administrative things happen in parallel with real work. They do not. They happen when a specific human sits down.

Ask for the paperwork in week one of the project, not the week you want to ship. It costs nothing to ask early and it is the single largest source of slippage.

What you will need, roughly:

The business registration certificate. The business KRA PIN certificate. National ID or passport for the authorised signatory. And a shortcode, either a paybill or a till, already provisioned.

That last one deserves a decision rather than a default. Paybill takes an account reference, which is how a payment gets attributed to an order or an invoice. Till does not. If your reconciliation depends on knowing what a payment was *for*, you want a paybill, and finding that out after the shortcode is issued is an expensive discovery.

## Approval is per API, not per app

This is the one that cost us four days and made me feel genuinely stupid.

Going live approves the APIs you asked for. Approved for STK Push means STK Push works. It does not mean B2C works. It does not mean Reversal works. Those get whitelisted separately against the shortcode, usually through support rather than any button in the portal.

The failure mode is cruel, because it does not look like a permissions problem. You get authentication-shaped errors from code you know is correct. So you check your consumer key. You regenerate your secret. You re-encrypt your security credential. You read your own code four times looking for a bug that was never there.

Before writing a single line against any Daraja API, confirm that specific API is enabled on that specific shortcode. It is a two-minute question and it will save you a day.

## The review rejects on your callback URL

Most rejections have nothing to do with your code. They are about the URL you submitted, and the reviewer's test is simple: can Safaricom reach it.

So it must be a live HTTPS endpoint on port 443, publicly reachable, unauthenticated, that does not redirect and returns a 200 to a POST.

Every one of those is a real rejection I have seen or caused.

A staging URL behind an IP allowlist, reachable from the office and nowhere else. Apex-to-www redirects, where a `301` is a dead end because Safaricom does not follow them. Trailing-slash normalisation, where Next.js helpfully redirects `/api/callback` to `/api/callback/` and breaks every callback you will ever receive. And bot protection, doing exactly what you configured it to do to an unauthenticated POST from an unfamiliar address range.

Test it the way the reviewer will, from outside everything you control:

```bash
# Status only. Anything in the 3xx range is a rejection waiting to happen.
curl -sI -X POST https://yourdomain.co.ke/api/payments/mpesa/callback | head -1
```

Submit a URL that is already live and already handling sandbox traffic. A URL that will exist by launch is a URL that fails review today, and a failed review costs you a full cycle.

The full catalogue of ways this goes wrong is in [why your M-Pesa callback never arrives](/blog/mpesa-callback-not-received), ordered by how often each one turns out to be the answer.

## Nothing carries over from sandbox

Assume every value changes, because nearly all of them do. Different shortcode, different passkey, different consumer key and secret, and an initiator that only exists in production.

```typescript lib/mpesa/config.ts
const REQUIRED = [
  'MPESA_ENV',
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_SHORTCODE',
  'MPESA_PASSKEY',
  'MPESA_CALLBACK_URL',
] as const

for (const key of REQUIRED) {
  if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`)
}

const isProduction = process.env.MPESA_ENV === 'production'

// Fail loudly rather than quietly taking real money with test settings.
if (isProduction && process.env.MPESA_SHORTCODE === '174379') {
  throw new Error('Sandbox shortcode 174379 configured in production')
}
```

That last guard exists because I have watched it happen. The sandbox shortcode is memorable, it appears in every tutorial on the internet, and it ends up pasted into a production environment file more often than anybody admits. Making it a boot failure costs three lines.

One credential subtlety worth internalising: the consumer key, secret, shortcode and passkey must all come from the **same Daraja app**. Mix a passkey from one app with a key from another and you get an invalid-password error, which sends you hunting for a timestamp bug that does not exist.

## The timezone that costs everybody an afternoon

The `Timestamp` in an STK Push payload is `yyyyMMddHHmmss` with no offset, and Safaricom reads it as **East Africa Time**. Not UTC.

Your server runs in UTC, because almost every container does. So `new Date()` gives you a time three hours behind what Daraja expects. And because the password is derived from that same timestamp, the mismatch surfaces as an authentication failure rather than a clock problem, which is why it eats an afternoon rather than a minute.

```typescript
/**
 * Daraja reads this as EAT. Deriving it from the host's local time works on a
 * laptop in Nairobi and fails on a UTC container, which is a difference that
 * only shows up in deployment.
 */
function darajaTimestamp(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => { acc[p.type] = p.value; return acc }, {})

  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`
}
```

Kenya does not observe daylight saving, so EAT is a fixed offset and you could hardcode it. Using the IANA zone costs nothing and documents why the code exists, which matters when somebody refactors it in a year.

## The first hour in production

Sandbox will never show you a real decline, a real duplicate callback, or a customer who ignores the prompt. Production shows you all three, usually on day one.

So do not treat go-live as flipping a switch. Treat it as a small deliberate test, about half an hour and five shillings.

Push one shilling to your own number and complete it. Confirm the callback lands and the ledger row is right.

Push another and cancel at the PIN prompt. You should see `1032`, and your interface should say cancelled rather than failed, because those are different things to a customer.

Push another and ignore it completely. After about a minute you should get `1037`. Confirm you do not mark the order failed, because a timed-out push can still be paid afterwards.

Replay the success callback by hand. Nothing should change. If a balance moves twice, stop everything and fix it before you take real money.

Then watch the reconciliation sweep run once and report zero discrepancies.

Half an hour. It catches the entire class of bug that otherwise gets discovered by a customer, in public, on a Saturday.

## Plan for it

The approval takes a few business days once the paperwork is complete and correct, longer if anything gets kicked back, and separate whitelisting for B2C or B2B adds to that as its own request.

None of which is under your control, and that is the whole argument for starting it in week one. The code is the part you can finish on a deadline. The paperwork is not, and nineteen days is a long time to explain.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [why callbacks go missing](/blog/mpesa-callback-not-received), [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation), [testing callbacks locally](/blog/test-mpesa-callbacks-locally), [running on serverless](/blog/mpesa-stk-push-serverless), and [paying money back out](/blog/mpesa-b2c-payouts).
