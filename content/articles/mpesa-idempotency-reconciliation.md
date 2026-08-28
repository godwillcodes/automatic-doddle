---
title: "M-Pesa Reconciliation: Idempotency, Duplicates and the Ledger"
metaTitle: "M-Pesa Reconciliation and Idempotent Callbacks"
slug: mpesa-idempotency-reconciliation
excerpt: "Safaricom will send the same callback twice. Your job is to make that boring. A practical design for idempotent payment writes, an append-only ledger, and the daily job that catches what both miss."
date: "2026-03-18"
category: "Mobile Money"
targetKeyword: "mpesa transaction reconciliation"
keywords:
  - "M-Pesa reconciliation"
  - "idempotency"
  - "duplicate callback"
  - "payment ledger"
  - "Daraja API"
  - "double crediting"
featured: false
---

Here is a bug I shipped.

An e-commerce client took M-Pesa payments. The callback handler found the order, marked it paid, and incremented the customer's loyalty balance. Straightforward, worked fine, ran for months.

Then Safaricom had a slow afternoon, retried a batch of callbacks, and about forty customers got their loyalty points twice. The orders were fine — marking an already-paid order paid is harmless. The `balance += points` was not.

The fix took ten minutes. Working out which forty customers, and by how much, took two days, because I had no record of *which* callback had caused which balance change.

That is what this article is about: not the ten-minute fix, but the design that makes the two-day part unnecessary.

## Assume every callback arrives more than once

Safaricom retries when it doesn't get a clean `200`. Your load balancer retries. A deploy mid-request retries. At any volume, duplicate delivery is not an edge case — it is a Tuesday.

The guarantee you get is *at least once*, never *exactly once*. So the handler has to be idempotent: processing the same callback five times must leave the system in the same state as processing it once.

The naive version is a read-then-write check:

```typescript
// Don't do this.
const existing = await db.payment.findUnique({ where: { checkoutRequestId } })
if (existing?.status === 'PAID') return

await db.payment.update({
  where: { checkoutRequestId },
  data: { status: 'PAID' },
})
await db.customer.update({
  where: { id: customerId },
  data: { loyaltyPoints: { increment: points } },
})
```

This is the bug I shipped. Two duplicate callbacks arriving concurrently both read `PENDING`, both pass the check, and both increment. The window is milliseconds wide, and Safaricom's retries land right in it.

## Let the database enforce it

The reliable version pushes uniqueness into a constraint, where concurrency cannot argue with it.

M-Pesa gives you two natural keys. `CheckoutRequestID` identifies the push you initiated. `MpesaReceiptNumber` identifies the money that actually moved. Use the receipt as your idempotency key — it is the one that exists only when a real transaction happened.

```sql
CREATE TABLE mpesa_transaction (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_request_id text        NOT NULL,
  receipt_number      text        NOT NULL,
  payment_id          uuid        NOT NULL REFERENCES payment(id),
  amount_cents        bigint      NOT NULL,
  phone               text        NOT NULL,
  transacted_at       timestamptz NOT NULL,
  raw_payload         jsonb       NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),

  -- The whole design rests on this line.
  CONSTRAINT mpesa_transaction_receipt_unique UNIQUE (receipt_number)
);
```

Now the handler stops asking permission and starts asking forgiveness:

```typescript lib/mpesa/settle.ts
import { Prisma } from '@prisma/client'

export async function settleFromCallback(callback: ParsedCallback) {
  try {
    await db.$transaction(async (tx) => {
      // Throws P2002 on the second delivery. That is the point.
      await tx.mpesaTransaction.create({
        data: {
          checkoutRequestId: callback.checkoutRequestId,
          receiptNumber: callback.receipt,
          paymentId: callback.paymentId,
          amountCents: callback.amount * 100,
          phone: callback.phone,
          transactedAt: callback.transactedAt,
          rawPayload: callback.raw,
        },
      })

      await tx.payment.update({
        where: { id: callback.paymentId },
        data: { status: 'PAID', settledAt: new Date() },
      })

      await tx.ledgerEntry.create({
        data: {
          accountId: callback.customerId,
          kind: 'MPESA_PAYMENT',
          amountCents: callback.amount * 100,
          reference: callback.receipt,
        },
      })
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      // Already settled by an earlier delivery of this same callback.
      console.info('[mpesa] duplicate callback ignored', {
        receipt: callback.receipt,
      })
      return
    }
    throw error
  }
}
```

Everything that must happen exactly once lives inside the same transaction as the unique insert. If the insert fails, nothing else commits. There is no window.

Note `amount_cents` as a `bigint`. M-Pesa amounts are whole shillings, so you may not think you need minor units — but the moment you apply a percentage fee or split a payment, floats will cost you cents that finance will find. Store integers.

## Keep a ledger, not just a balance

The second half of my bug was that `loyaltyPoints` was a single mutable number. When it was wrong, there was no way to reconstruct how it got that way.

An append-only ledger fixes this. Balances become a derived value:

```sql
CREATE TABLE ledger_entry (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   uuid        NOT NULL,
  kind         text        NOT NULL,
  amount_cents bigint      NOT NULL,     -- signed; credits positive
  reference    text        NOT NULL,     -- the M-Pesa receipt, usually
  created_at   timestamptz NOT NULL DEFAULT now(),

  -- One entry per source event per account, enforced.
  CONSTRAINT ledger_entry_unique UNIQUE (account_id, kind, reference)
);

CREATE INDEX ledger_entry_account_idx ON ledger_entry (account_id, created_at DESC);
```

```sql
-- The balance is a question you ask, not a value you maintain.
SELECT COALESCE(SUM(amount_cents), 0) AS balance_cents
FROM ledger_entry
WHERE account_id = $1;
```

This costs you a `SUM` on read, which you can cache or roll up into monthly snapshots when it becomes a real cost. What you get is the ability to answer "why is this number what it is" with a query instead of an archaeology project — and to reverse exactly one bad entry without recomputing anything.

The second unique constraint means the same receipt can never produce two credits for the same account, even if the code that writes it is wrong.

## The daily reconciliation job

Idempotency stops you double-counting what you received. It does nothing about what you never received.

So once a day, compare your view of the world against Safaricom's. The comparison has three interesting buckets:

```typescript lib/mpesa/daily-reconciliation.ts
export async function reconcileDay(date: Date) {
  const [ours, theirs] = await Promise.all([
    db.mpesaTransaction.findMany({
      where: { transactedAt: withinDay(date) },
      select: { receiptNumber: true, amountCents: true },
    }),
    // From the Transaction Status API, or the statement your finance team
    // downloads from the M-Pesa portal.
    fetchSafaricomStatement(date),
  ])

  const ourReceipts = new Map(ours.map((t) => [t.receiptNumber, t.amountCents]))
  const theirReceipts = new Map(theirs.map((t) => [t.receiptNumber, t.amountCents]))

  const missing = theirs.filter((t) => !ourReceipts.has(t.receiptNumber))
  const phantom = ours.filter((t) => !theirReceipts.has(t.receiptNumber))
  const mismatched = ours.filter((t) => {
    const amount = theirReceipts.get(t.receiptNumber)
    return amount !== undefined && amount !== t.amountCents
  })

  return { missing, phantom, mismatched }
}
```

**Missing** — Safaricom has it, you don't. A lost callback. This is money you were paid and did not credit, and it is the bucket that generates support tickets. It should be auto-recoverable: you have the receipt, so settle it through the same idempotent path a callback would have taken.

**Phantom** — you have it, Safaricom doesn't. This should be empty. If it isn't, either you are reading the wrong shortcode or something is writing transactions that never happened. Alert loudly; do not auto-resolve.

**Mismatched** — the amounts disagree. Almost always a rounding or currency-unit bug on your side. Also alert; never auto-correct, because the correction is a judgement call.

Alert on the counts, not just on failures:

```typescript app/api/cron/reconcile/route.ts
export async function GET() {
  const result = await reconcileDay(yesterday())

  for (const transaction of result.missing) {
    await settleFromReceipt(transaction) // idempotent, same path as callbacks
  }

  if (result.phantom.length > 0 || result.mismatched.length > 0) {
    await alert('mpesa-reconciliation', {
      phantom: result.phantom.length,
      mismatched: result.mismatched.length,
    })
  }

  return Response.json({
    recovered: result.missing.length,
    phantom: result.phantom.length,
    mismatched: result.mismatched.length,
  })
}
```

A quiet reconciliation job that has never alerted is indistinguishable from one that is not running. Emit the counts every day, including zeroes, and put them on a dashboard.

## Refunds are not negative payments

One last trap. When you refund via B2C, the temptation is to write a negative amount against the original receipt.

Don't. The refund is its own event with its own M-Pesa receipt, and it needs its own ledger entry:

```typescript
await db.ledgerEntry.create({
  data: {
    accountId,
    kind: 'MPESA_REFUND',
    amountCents: -amountCents,
    reference: refundReceipt,   // the B2C receipt, not the original
  },
})
```

Now the ledger tells the true story: money came in on receipt `SHF7A2K9QP`, money went out on receipt `SHF8B3L0RQ`, and the balance is the sum. Mutating the original entry would have erased the fact that a payment ever happened, which is precisely the record you need when someone disputes the refund.

## The short version

- Use `MpesaReceiptNumber` as the idempotency key and enforce it with a `UNIQUE` constraint, not an `if` statement.
- Put the unique insert and every once-only side effect in one transaction.
- Catch the duplicate-key error and treat it as success, because it is.
- Store money as integer minor units.
- Append to a ledger; derive balances.
- Reconcile daily against Safaricom, auto-recover the missing, alert on the rest.
- Refunds are new events, never edits to old ones.

None of this is exotic. It is the same double-entry discipline accountants worked out several centuries ago, expressed as database constraints. The reason it keeps getting rediscovered is that the naive version works perfectly right up until the day it doesn't, and by then you are reconstructing forty customers' balances from log files.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [why callbacks go missing](/blog/mpesa-callback-not-received), [running STK Push on serverless](/blog/mpesa-stk-push-serverless), [B2C payouts](/blog/mpesa-b2c-payouts), and [refunds and reversals](/blog/mpesa-refunds-and-reversals).
