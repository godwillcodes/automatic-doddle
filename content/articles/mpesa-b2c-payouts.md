---
title: "M-Pesa B2C: Paying People Out Without Losing Track of the Money"
metaTitle: "M-Pesa B2C Payouts: A Production Guide"
slug: mpesa-b2c-payouts
excerpt: "Collecting money with STK Push is the easy half. Sending it back out has stricter credentials, a different failure surface, and no user watching the screen to tell you it went wrong."
date: "2026-05-06"
category: "Mobile Money"
targetKeyword: "mpesa b2c api"
keywords:
  - "M-Pesa B2C"
  - "Daraja B2C API"
  - "SecurityCredential"
  - "M-Pesa payouts"
  - "disbursement Kenya"
  - "InitiatorName"
featured: false
---

Most M-Pesa writing stops at collection. STK Push, callbacks, reconciliation: money coming in. That is the half with a customer watching a screen, and the half every tutorial covers.

Paying money out is a different problem. B2C has stricter credentials, an entirely separate approval on your shortcode, and no user on the other end to notice that nothing arrived. When a payout silently fails, the first person to find out is usually the recipient, and they find out by not being paid.

I have shipped this for refunds and for agent payouts. Here is what the collection guides do not tell you.

## B2C is not enabled just because you went live

The first thing that surprises people: passing Daraja's go-live review does not give you B2C.

Approval is per API. An application approved for STK Push gets STK Push. B2C and B2B are whitelisted separately against your shortcode, and that is a support request rather than a portal toggle. Budget days, not minutes.

Until that whitelisting lands you will get authentication-shaped errors from a correctly written integration, and you will spend a day debugging code that was never the problem. Confirm the API is enabled on the shortcode before you write anything.

## The SecurityCredential is where everyone gets stuck

STK Push authenticates with a password: base64 of shortcode plus passkey plus timestamp. B2C does not work that way.

B2C requires a `SecurityCredential`, which is your **initiator password**, RSA-encrypted with Safaricom's public certificate, then base64 encoded. Three things go wrong here, in roughly this order.

**Using the sandbox certificate in production.** They are different files. The sandbox one will encrypt happily and produce a credential production rejects with a message about invalid initiator information, which reads like a username problem and is not.

**Re-encrypting on every request.** The output is not deterministic across runs, but it does not need to be regenerated. Encrypt once, store the result, use it. Doing it per request is wasted CPU and one more thing to get wrong under load.

**Confusing the initiator with the API user.** The initiator is a separate credential created against the shortcode, with its own username and password. Your consumer key and secret get you a bearer token. The initiator gets you permission to move money. They are not the same account and they are not interchangeable.

```bash
# Generate the credential once, from the production certificate.
# Keep the .cer file out of the repository.
printf '%s' "$INITIATOR_PASSWORD" \
  | openssl rsautl -encrypt -certin -inkey ProductionCertificate.cer \
  | base64 -w0 > security-credential.txt
```

```typescript lib/mpesa/b2c.ts
import { mpesaConfig } from './config'
import { getAccessToken } from './token'
import { normalizePhone } from './phone'

/**
 * Encrypted once and read from the environment. The value is a credential in
 * its own right: anyone holding it can initiate payouts, so it belongs
 * wherever the rest of your secrets live and nowhere else.
 */
const SECURITY_CREDENTIAL = process.env.MPESA_SECURITY_CREDENTIAL!

type Command = 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment'

export async function sendB2C(params: {
  phone: string
  amount: number
  command: Command
  remarks: string
  /** Your own idempotency key. See below: this is load bearing. */
  originatorConversationId: string
}) {
  const token = await getAccessToken()

  const response = await fetch(
    `${mpesaConfig.baseUrl}/mpesa/b2c/v3/paymentrequest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        OriginatorConversationID: params.originatorConversationId,
        InitiatorName: mpesaConfig.initiatorName,
        SecurityCredential: SECURITY_CREDENTIAL,
        CommandID: params.command,
        Amount: Math.floor(params.amount),
        PartyA: mpesaConfig.shortcode,
        PartyB: normalizePhone(params.phone),
        Remarks: params.remarks.slice(0, 100),
        QueueTimeOutURL: mpesaConfig.b2cTimeoutUrl,
        ResultURL: mpesaConfig.b2cResultUrl,
        Occasion: '',
      }),
    }
  )

  const data = await response.json()

  if (data.ResponseCode !== '0') {
    throw new Error(
      `B2C rejected: ${data.errorMessage ?? data.ResponseDescription ?? 'unknown'}`
    )
  }

  return {
    conversationId: data.ConversationID as string,
    originatorConversationId: data.OriginatorConversationID as string,
  }
}
```

Note `Math.floor` rather than the `Math.ceil` you want on collection. Rounding a payout up pays out money you did not intend to. The asymmetry is deliberate: round in the direction that costs you least when you are wrong.

`CommandID` matters for what the recipient sees and for how the transaction is classified. `BusinessPayment` is the general case. `SalaryPayment` behaves differently for accounts registered for it. `PromotionPayment` is for winnings. Pick the one that describes the money; do not default to `SalaryPayment` because a tutorial used it.

## Two callback URLs, and they are not interchangeable

Collection gives you one callback. B2C gives you two, and conflating them is a common bug.

`ResultURL` receives the outcome: paid, failed, rejected. This is the one that matters.

`QueueTimeOutURL` fires when the request sat in Safaricom's queue too long and was never processed. It is **not** a failure of the payment; it is a failure to attempt the payment. The money did not move, but it also was not declined, and the correct response is usually to retry rather than to mark the payout failed and move on.

Point them at different handlers. If both go to one endpoint that treats every payload as a result, a timeout gets recorded as a decline and a recipient who should have been retried never gets paid.

```typescript app/api/payouts/mpesa/result/route.ts
export async function POST(request: Request) {
  const raw = await request.text()
  await db.b2cCallback.create({ data: { kind: 'result', raw } })

  const result = JSON.parse(raw)?.Result
  if (!result) return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })

  // ResultParameters is a name/value bag, and it is absent on failure.
  const items: { Key: string; Value?: string | number }[] =
    result.ResultParameters?.ResultParameter ?? []
  const field = (key: string) => items.find((i) => i.Key === key)?.Value

  await settlePayout({
    originatorConversationId: result.OriginatorConversationID,
    conversationId: result.ConversationID,
    success: result.ResultCode === 0,
    resultDesc: result.ResultDesc,
    receipt: field('TransactionReceipt') as string | undefined,
    // The recipient's registered name, which is worth storing: it is the
    // only confirmation you get that you paid who you meant to pay.
    recipient: field('ReceiverPartyPublicName') as string | undefined,
    completedAt: field('TransactionCompletedDateTime') as string | undefined,
  })

  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
```

`ReceiverPartyPublicName` comes back as something like `254712345678 - JOHN DOE`. Store it. When somebody disputes a payout six months later, the registered name at the moment of payment is the only evidence you will have that the right person received it.

## Idempotency has to be yours, not Safaricom's

On collection, `MpesaReceiptNumber` gives you a natural idempotency key: it exists only when money actually moved. Payouts have no equivalent before the fact. You send a request, and if the connection drops you do not know whether it was received.

Retrying blindly pays somebody twice.

`OriginatorConversationID` is the answer. You generate it, it goes out with the request, and it comes back on the result. Make it a deterministic function of the thing you are paying for, store it under a unique constraint before you call Daraja, and a duplicate attempt collides with your own database rather than reaching Safaricom.

```sql
CREATE TABLE payout (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Deterministic per payable thing: one refund, one payout, one row.
  originator_conversation_id  text        NOT NULL,
  refund_for                  uuid        NOT NULL,
  amount_cents                bigint      NOT NULL,
  phone                       text        NOT NULL,
  status                      text        NOT NULL DEFAULT 'PENDING',
  receipt                     text,
  recipient_name              text,
  created_at                  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT payout_originator_unique UNIQUE (originator_conversation_id),
  -- Belt and braces: one payout per thing being paid for.
  CONSTRAINT payout_subject_unique    UNIQUE (refund_for)
);
```

Write the row first, in the same transaction that decides a payout is owed. Then call Daraja. If the call throws, the row stays `PENDING` and a sweep picks it up. If the process dies mid-flight, the row is still there. The one thing that must never happen is calling Daraja without a durable record that you did.

## Timeouts are not failures

A `PENDING` payout with no result after a few minutes is ambiguous. It may have been paid. It may never have been attempted.

Do not resolve that ambiguity by guessing, and do not resolve it by resending. Query it:

```typescript
/**
 * Transaction Status against the OriginatorConversationID. Rate limited, so
 * this runs on a schedule against stale rows, never in a request path.
 */
export async function sweepStalePayouts() {
  const stale = await db.payout.findMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: new Date(Date.now() - 5 * 60 * 1000) },
    },
    take: 25,
  })

  for (const payout of stale) {
    const status = await queryTransactionStatus(payout.originatorConversationId)
    // Anything inconclusive stays PENDING and gets asked again next run.
    // A payout is only ever failed on an explicit failure.
    if (status.ResultCode === '0') await settleFromStatus(payout, status)
    else if (isDefiniteFailure(status)) await failPayout(payout, status.ResultDesc)
  }
}
```

The rule that keeps you out of trouble: **only an explicit failure marks a payout failed.** Silence, timeouts and inconclusive queries all mean "ask again later". Marking a payout failed and re-sending it is how one refund becomes two.

## Float is a runtime dependency

The one that catches teams out in their first week: B2C pays from your working account, and if the balance is short, payouts fail. Not queued. Failed.

Your code can be perfect and your payouts still stop because finance did not top up. That makes float an operational dependency of your application, exactly like a database being reachable, and it deserves the same treatment: check it on a schedule, alert before it bites.

```typescript
// Account Balance is also rate limited and also asynchronous: the figure
// arrives on a callback, not in the response.
export async function checkFloat() {
  await requestAccountBalance()
}

// In the balance result handler, alert on the threshold rather than logging it.
export async function onBalanceResult(availableCents: bigint) {
  if (availableCents < FLOAT_FLOOR_CENTS) {
    await alert('mpesa-float-low', { availableCents: String(availableCents) })
  }
}
```

Set the floor at something meaningful, like a few days of typical payout volume, rather than at zero. An alert that fires when you are already out of money is a postmortem, not a warning.

## What I would tell somebody starting

**Confirm B2C is whitelisted on the shortcode before writing code.** It is the single most common cause of a day lost to debugging something that was never broken.

**Generate the SecurityCredential once, from the production certificate, and treat it as a secret.** Anyone with it can move your money.

**Own your idempotency key.** Collection hands you one; payouts do not.

**Never fail a payout on silence.** Explicit failures only.

**Alert on float.** It is a dependency, not an accounting detail.

The collection side of this is covered in [the Daraja integration guide](/blog/mpesa-daraja-api-nextjs), and the ledger discipline that makes payouts auditable is in [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation). When a payout needs to be undone rather than retried, that is [reversals](/blog/mpesa-refunds-and-reversals), which is its own problem.
