---
title: "Getting Daraja Approved for Production, and What Breaks on the Way"
metaTitle: "Daraja Go-Live: Production Approval Checklist"
slug: mpesa-daraja-production-go-live
excerpt: "Sandbox to production is not a config change. Different credentials, a separate approval per API, a timezone nobody documents, and a review that rejects on paperwork before it ever looks at your code."
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

Your sandbox integration works. Every result code handled, callbacks idempotent, tests green. Now you need production, and you discover that sandbox and production are not the same system with different keys. They are two systems that happen to share an API shape.

This is the gap the tutorials skip, because it is mostly paperwork and platform behaviour rather than code. It is also where a launch date slips by a fortnight.

## You cannot do this as an individual

Production Daraja credentials are issued to a registered business, not a person. If you are building for a client, the shortcode and the credentials belong to the client's entity, and somebody at that entity has to be the authorised signatory.

That has a scheduling consequence worth surfacing early: **you cannot unblock this yourself.** I have watched a launch sit still for a week because the one director who could sign was travelling. Ask for the paperwork at the start of the project, not the week you want to ship.

What is typically required:

- Certificate of registration for the business
- The business KRA PIN certificate
- National ID or passport for the authorised signatory
- A shortcode: either a paybill or a till, already provisioned

A paybill and a till are not interchangeable. Paybill takes an account reference, which is how you attribute a payment to an order or an invoice. Till does not. If your reconciliation depends on knowing what a payment was *for*, you want a paybill, and finding that out after the shortcode is issued is an expensive discovery.

## Approval is per API, not per app

This is the one that surprises people who have already been through it once.

Going live approves the APIs you asked for. STK Push approved means STK Push works. It does not mean B2C works, or B2B, or Reversal. Those are whitelisted separately against the shortcode, usually through support rather than through the portal.

The failure mode is nasty because it does not look like a permissions problem. You get authentication-shaped errors from correct code, and you go looking through your credentials for a bug that is not there. Before writing an integration against any Daraja API, confirm that API is enabled on that shortcode.

## The review rejects on the callback URL

Most rejections are not about your code. They are about the URL you submitted.

The reviewer's check is simple: can Safaricom reach it. So it must be a live HTTPS endpoint on port 443, publicly reachable with no authentication, that does not redirect and returns a 200 to a POST.

Every one of those is a real rejection cause:

- **A staging URL behind an IP allowlist.** Reachable from your office, not from Safaricom.
- **Apex to www redirects.** A `301` is a dead end; the callback is never followed.
- **`trailingSlash` normalisation.** Next.js will happily redirect `/api/callback` to `/api/callback/` and break every callback you receive.
- **Bot protection.** A WAF that challenges unauthenticated POSTs from unfamiliar addresses does exactly what you configured it to do.

Test it the way the reviewer will, from outside everything you control:

```bash
# Status only. Anything in the 3xx range is a rejection waiting to happen.
curl -sI -X POST https://yourdomain.co.ke/api/payments/mpesa/callback | head -1
```

The failure modes here have their own article: [why your M-Pesa callback never arrives](/blog/mpesa-callback-not-received) goes through them in the order they are usually the answer.

Submit a URL that is already live and already handling sandbox traffic. A URL that will exist by launch is a URL that fails review today.

## Nothing carries over from sandbox

Assume every value changes, because most of them do.

```typescript lib/mpesa/config.ts
/**
 * Sandbox and production share no credentials. The shortcode, passkey,
 * consumer key and secret are all different, and the initiator is production
 * only. Mixing one sandbox value into an otherwise production config produces
 * errors that read like authentication bugs.
 */
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

export const mpesaConfig = {
  baseUrl: isProduction
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke',
  // ...
} as const
```

That last guard has paid for itself. The sandbox shortcode is memorable, it is in every tutorial, and it ends up pasted into a production environment file more often than anyone admits.

One credential subtlety: the consumer key, secret, shortcode and passkey must all come from the **same Daraja app**. Mixing a passkey from one app with a consumer key from another produces an invalid-password error that sends you hunting for a timestamp bug.

## The timezone nobody documents

The `Timestamp` in an STK Push payload is `yyyyMMddHHmmss` with no offset, and Safaricom reads it as **East Africa Time**, not UTC.

If your server runs in UTC, which almost every container does, `new Date()` gives you a time three hours behind what Daraja expects. The password is derived from that same timestamp, so a mismatch shows up as an authentication failure rather than a clock problem, which is why it costs people an afternoon.

Build the timestamp in the timezone Daraja expects, explicitly, rather than relying on where the process happens to be running:

```typescript
/**
 * Daraja reads this as EAT. Deriving it from the host's local time works on a
 * laptop in Nairobi and fails on a UTC container, which is a difference that
 * only shows up in deployment.
 */
function darajaTimestamp(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value
      return acc
    }, {})

  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`
}
```

Kenya does not observe daylight saving, so EAT is a fixed offset. Using the IANA zone rather than hardcoding `+03:00` still costs nothing and documents the intent.

## The first hour in production

Sandbox will never show you a real decline, a real duplicate callback, or a customer who ignores the prompt. Production will show you all three, usually on day one.

So do not treat go-live as a switch. Treat it as a small, deliberate test:

1. Push **one shilling** to your own number. Complete it. Confirm the callback arrives and the ledger row is correct.
2. Push another and **cancel at the PIN prompt**. You should get `1032`, and your UI should say cancelled rather than failed.
3. Push another and **ignore it entirely**. After about a minute you should get `1037`. Confirm you do not mark the order failed, because a timed-out push can still be paid.
4. **Replay the success callback** by hand. Nothing should change. If a balance moves twice, stop and fix it before taking real money.
5. Watch the reconciliation sweep run once and report zero discrepancies.

That is half an hour and about five shillings, and it catches the entire class of bug that otherwise gets discovered by a customer.

## Timing

Plan for the approval itself to take a few business days once the paperwork is complete and correct, and longer if anything gets kicked back. Separate whitelisting for B2C or B2B adds to that, and it is a separate request.

None of that is under your control, which is the argument for starting it early. The code is the part you can finish on a deadline. The paperwork is not.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [why callbacks go missing](/blog/mpesa-callback-not-received), [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation), [testing callbacks locally](/blog/test-mpesa-callbacks-locally), [running on serverless](/blog/mpesa-stk-push-serverless), and [paying money back out](/blog/mpesa-b2c-payouts).
