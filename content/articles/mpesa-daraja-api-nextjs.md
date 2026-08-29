---
title: "M-Pesa Daraja API Integration with Next.js: A Production Guide"
metaTitle: "M-Pesa Daraja API + Next.js: Production Guide"
slug: mpesa-daraja-api-nextjs
excerpt: "Most Daraja tutorials stop at a successful STK Push in sandbox. This is the rest of it: token caching, callback verification, idempotent writes and the failure modes that only show up with real money."
date: "2026-03-04"
category: "Mobile Money"
targetKeyword: "mpesa daraja api nextjs"
keywords:
  - "M-Pesa Daraja API"
  - "Next.js M-Pesa integration"
  - "STK Push"
  - "Safaricom Daraja"
  - "Kenya payments API"
  - "mobile money integration"
featured: true
---

There are a lot of M-Pesa tutorials. Almost all of them end at the same place: you fire an STK Push in sandbox, a prompt appears on the test number, you get a `ResponseCode: "0"`, and the article says "and that's it!"

That is not it. That is roughly 20% of it.

The other 80% is everything that happens after real money starts moving: tokens that expire mid-request, callbacks that arrive twice, callbacks that never arrive at all, users who cancel at the PIN prompt, and the reconciliation job you will inevitably have to write at 2 AM when finance asks why the ledger is off by KES 4,300.

I have built this integration four times across three companies. This is the version I would write again.

## The shape of the thing

Daraja is Safaricom's public API layer over M-Pesa. For accepting money from a customer, you care about exactly three endpoints:

- `POST /oauth/v1/generate`, exchange your consumer key and secret for a bearer token
- `POST /mpesa/stkpush/v1/processrequest`, push a PIN prompt to a customer's phone
- `POST /mpesa/stkpushquery/v1/query`, ask Safaricom what happened to a push

And one endpoint you have to provide: the **callback URL**, which Safaricom posts the result to. That callback is where every integration lives or dies, and it gets its own article, [why your M-Pesa callback never arrives](/blog/mpesa-callback-not-received) covers the failure modes in detail.

The critical mental model: **STK Push is asynchronous and the HTTP response tells you nothing about payment.** A `ResponseCode` of `"0"` means "Safaricom accepted your request to show a prompt." It does not mean the customer paid. It does not mean the customer even saw the prompt. Treating that 200 as a payment is the single most common bug in production M-Pesa code.

## Environment and configuration

Start by making the environment explicit. Sandbox and production differ in base URL, shortcode, and passkey, and mixing them produces errors that look like auth failures but aren't.

```typescript lib/mpesa/config.ts
const REQUIRED = [
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_SHORTCODE',
  'MPESA_PASSKEY',
  'MPESA_CALLBACK_URL',
] as const

for (const key of REQUIRED) {
  if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`)
}

export const mpesaConfig = {
  baseUrl:
    process.env.MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke',
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode: process.env.MPESA_SHORTCODE!,
  passkey: process.env.MPESA_PASSKEY!,
  callbackUrl: process.env.MPESA_CALLBACK_URL!,
  // CustomerPayBillOnline for a paybill, CustomerBuyGoodsOnline for a till.
  transactionType: process.env.MPESA_TILL
    ? 'CustomerBuyGoodsOnline'
    : 'CustomerPayBillOnline',
} as const
```

Throwing at module load is deliberate. A missing passkey should break your deploy, not your customer's checkout.

## Tokens: cache them, and expire them early

The OAuth endpoint returns a token valid for 3599 seconds. Requesting a fresh one on every payment is slow and, at volume, will get you rate-limited.

The subtlety is the expiry margin. If you cache for the full 3599 seconds, you will eventually send a request with a token that expires in flight. Expire it early. 60 seconds of margin costs you nothing:

```typescript lib/mpesa/token.ts
import { mpesaConfig } from './config'

let cached: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token

  const credentials = Buffer.from(
    `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`
  ).toString('base64')

  const response = await fetch(
    `${mpesaConfig.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Daraja auth failed: ${response.status} ${await response.text()}`)
  }

  const data = (await response.json()) as { access_token: string; expires_in: string }

  cached = {
    token: data.access_token,
    // Expire a minute early so a token can never die mid-flight.
    expiresAt: Date.now() + (Number(data.expires_in) - 60) * 1000,
  }

  return cached.token
}
```

A module-level variable is fine on a long-lived Node process. On serverless it is a per-instance cache that survives warm invocations and rebuilds on cold ones, acceptable, but see [running STK Push on serverless](/blog/mpesa-stk-push-serverless) for where that assumption gets you into trouble.

## Phone numbers: normalise ruthlessly

Kenyan users will type their number six different ways. Daraja accepts exactly one: `2547XXXXXXXX`, twelve digits, no plus.

```typescript lib/mpesa/phone.ts
/**
 * Accepts 0712345678, +254712345678, 254712345678, 712345678 and the 01xx
 * range, and returns the 2547XXXXXXXX / 2541XXXXXXXX form Daraja requires.
 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')

  if (/^254[17]\d{8}$/.test(digits)) return digits
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`

  throw new Error(`Not a valid Kenyan mobile number: ${input}`)
}
```

Do this at the edge of your system, once. Never store the unnormalised form.

## Initiating the push

The password is a base64 of shortcode + passkey + timestamp, and the timestamp must match the one in the payload exactly. Compute them together or they will drift:

```typescript lib/mpesa/stk.ts
import { mpesaConfig } from './config'
import { getAccessToken } from './token'
import { normalizePhone } from './phone'

function stamp() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const timestamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

  const password = Buffer.from(
    `${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`
  ).toString('base64')

  return { timestamp, password }
}

export interface StkPushResult {
  merchantRequestId: string
  checkoutRequestId: string
  customerMessage: string
}

export async function initiateStkPush(params: {
  phone: string
  amount: number
  accountReference: string
  description: string
}): Promise<StkPushResult> {
  const { timestamp, password } = stamp()
  const token = await getAccessToken()
  const phone = normalizePhone(params.phone)

  const response = await fetch(
    `${mpesaConfig.baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: mpesaConfig.transactionType,
        // Daraja rejects decimals. Round up rather than truncating so you
        // never undercharge.
        Amount: Math.ceil(params.amount),
        PartyA: phone,
        PartyB: mpesaConfig.shortcode,
        PhoneNumber: phone,
        CallBackURL: mpesaConfig.callbackUrl,
        AccountReference: params.accountReference.slice(0, 12),
        TransactionDesc: params.description.slice(0, 13),
      }),
    }
  )

  const data = await response.json()

  if (data.ResponseCode !== '0') {
    throw new Error(
      `STK Push rejected: ${data.errorMessage ?? data.ResponseDescription ?? 'unknown'}`
    )
  }

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    customerMessage: data.CustomerMessage,
  }
}
```

Two details that cost me hours the first time:

**`AccountReference` and `TransactionDesc` have length limits**. 12 and 13 characters respectively. Exceed them and you get a generic `400` with no useful message. Truncate defensively.

**`Amount` must be a whole number.** Send `199.50` and the request fails. `Math.ceil` rather than `Math.round`, because rounding a customer's bill down is a bug that only ever costs you money.

## The route handler

Now wire it into an App Router route. The important part is what you write to your database, and when:

```typescript app/api/payments/mpesa/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { initiateStkPush } from '@/lib/mpesa/stk'
import { db } from '@/lib/db'

const schema = z.object({
  phone: z.string().min(9),
  amount: z.number().positive().max(150_000),
  orderId: z.string().uuid(),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { phone, amount, orderId } = parsed.data

  try {
    const result = await initiateStkPush({
      phone,
      amount,
      accountReference: orderId.slice(0, 12),
      description: 'Order payment',
    })

    // Write the pending row BEFORE returning. The callback can arrive before
    // this response reaches the browser, and it needs a row to update.
    await db.payment.create({
      data: {
        orderId,
        amount,
        phone,
        status: 'PENDING',
        checkoutRequestId: result.checkoutRequestId,
        merchantRequestId: result.merchantRequestId,
      },
    })

    return NextResponse.json({
      checkoutRequestId: result.checkoutRequestId,
      message: result.customerMessage,
    })
  } catch (error) {
    console.error('STK Push failed', { orderId, error })
    return NextResponse.json({ error: 'Could not reach M-Pesa' }, { status: 502 })
  }
}
```

That comment about ordering is not theoretical. Safaricom's callback has arrived before my own HTTP response finished serialising, on a fast connection, more than once. If the pending row does not exist yet, the callback handler has nothing to update and silently drops a real payment.

The `max(150_000)` reflects the M-Pesa per-transaction ceiling. Validate it yourself rather than letting Daraja reject it, the error you generate will be far more useful than the one it returns.

## Receiving the result

The callback is a `POST` from Safaricom with a nested payload. It is unauthenticated, so anyone who finds the URL can post to it, which is why the handler below trusts nothing in the body except as a lookup key:

```typescript app/api/payments/mpesa/callback/route.ts
import { NextResponse } from 'next/server'

interface CallbackItem {
  Name: string
  Value?: string | number
}

export async function POST(request: Request) {
  const payload = await request.json()
  const callback = payload?.Body?.stkCallback

  // Always acknowledge. A non-200 makes Safaricom retry, and a retry storm
  // is much worse than a payload you decided to ignore.
  if (!callback) return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

  const { CheckoutRequestID, ResultCode, ResultDesc } = callback

  const items: CallbackItem[] = callback.CallbackMetadata?.Item ?? []
  const field = (name: string) => items.find((item) => item.Name === name)?.Value

  await recordCallback({
    checkoutRequestId: CheckoutRequestID,
    success: ResultCode === 0,
    resultCode: ResultCode,
    resultDesc: ResultDesc,
    receipt: field('MpesaReceiptNumber') as string | undefined,
    amount: field('Amount') as number | undefined,
    phone: field('PhoneNumber') as number | undefined,
  })

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

`CallbackMetadata` is only present on success. On failure the payload has `ResultCode` and `ResultDesc` and nothing else, reading `Item` unguarded is how most integrations throw on the first cancelled payment.

The result codes you will actually see:

- `0`, paid
- `1`, insufficient balance
- `1032`, customer pressed cancel
- `1037`, no response from the phone; often unreachable or the prompt timed out
- `2001`, wrong PIN

`1032` and `1037` are the common ones and they are not errors in your system. Surface them as "payment cancelled" and "we couldn't reach your phone", not as a 500.

The write itself has to be idempotent, because Safaricom will send the same callback more than once. That, plus the ledger work that follows from it, is covered in [M-Pesa reconciliation: idempotency, duplicates and the ledger](/blog/mpesa-idempotency-reconciliation).

## Closing the loop for the customer

The browser initiated a push and got a `checkoutRequestId`. It now needs to know what happened. Polling your own database is correct; polling Daraja's query endpoint is not, because it is aggressively rate-limited and will start returning errors under any real load.

```typescript
'use client'

import { useEffect, useState } from 'react'

type Status = 'pending' | 'paid' | 'failed' | 'timeout'

export function usePaymentStatus(checkoutRequestId: string | null) {
  const [status, setStatus] = useState<Status>('pending')

  useEffect(() => {
    if (!checkoutRequestId) return

    const startedAt = Date.now()
    const interval = setInterval(async () => {
      // M-Pesa prompts expire after about 60 seconds; give it 90 and stop.
      if (Date.now() - startedAt > 90_000) {
        setStatus('timeout')
        clearInterval(interval)
        return
      }

      const response = await fetch(`/api/payments/mpesa/${checkoutRequestId}`)
      const { status: next } = await response.json()

      if (next !== 'pending') {
        setStatus(next)
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [checkoutRequestId])

  return status
}
```

The 90-second stop matters. Without it, a user who ignores the prompt leaves a poller running until they close the tab.

And `timeout` is not `failed`. A timed-out push can still be paid, the customer may have entered their PIN just as you gave up, and the callback will land afterwards. Show "we're still confirming this payment", let the callback settle it, and never mark an order failed on the client's say-so.

## What I would tell my past self

**The HTTP 200 is not the payment.** Everything else follows from this. Your database, your UI, and your fulfilment logic should all treat the callback as the only source of truth.

**Test with real money early.** Sandbox never shows you a `1037`, never sends a duplicate callback, and never has an outage. Push KES 1 through production the week you start, not the week you launch.

**Log the entire callback body, raw, forever.** When finance asks about a specific transaction eight months from now, the raw payload is the only thing that will settle it. Storage is cheaper than the argument.

**Someone will pay twice.** Not often, but at any volume it happens, a double-tap, a retried request, a duplicated callback. Decide now whether your system refunds, credits, or absorbs it, because deciding during the incident goes badly.

If you are starting from zero, the next thing to get right is your callback endpoint, because nothing else works until that does. [Start there](/blog/mpesa-callback-not-received), and if you are on Vercel, Netlify, or anything else without a long-lived server, read [the serverless notes](/blog/mpesa-stk-push-serverless) before you design the flow.

Everything above is collection. The rest of the money's lifecycle has its own articles: [getting the shortcode approved for production](/blog/mpesa-daraja-production-go-live), [paying money back out with B2C](/blog/mpesa-b2c-payouts), and [refunds and reversals](/blog/mpesa-refunds-and-reversals).
