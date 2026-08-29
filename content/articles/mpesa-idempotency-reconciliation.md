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

Forty customers got their loyalty points twice, and it took me two days to work out which forty.

Here is the bug I shipped.

An e-commerce client took M-Pesa payments. The callback handler found the order, marked it paid, and incremented the customer's loyalty balance. Straightforward, worked fine, ran for months.

Then Safaricom had a slow afternoon, retried a batch of callbacks, and about forty customers got their loyalty points twice. The orders were fine, marking an already-paid order paid is harmless. The `balance += points` was not.

The fix took ten minutes. Working out which forty customers, and by how much, took two days, because I had no record of *which* callback had caused which balance change.

That is what this article is about: not the ten-minute fix, but the design that makes the two-day part unnecessary.

## Assume every callback arrives more than once

Safaricom retries when it doesn't get a clean `200`. Your load balancer retries. A deploy mid-request retries. At any volume, duplicate delivery is not an edge case, it is a Tuesday.

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

M-Pesa gives you two natural keys. `CheckoutRequestID` identifies the push you initiated. `MpesaReceiptNumber` identifies the money that actually moved. Use the receipt as your idempotency key, it is the one that exists only when a real transaction happened.

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

Note `amount_cents` as a `bigint`. M-Pesa amounts are whole shillings, so you may not think you need minor units, but the moment you apply a percentage fee or split a payment, floats will cost you cents that finance will find. Store integers.

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

This costs you a `SUM` on read, which you can cache or roll up into monthly snapshots when it becomes a real cost. What you get is the ability to answer "why is this number what it is" with a query instead of an archaeology project, and to reverse exactly one bad entry without recomputing anything.

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

**Missing**. Safaricom has it, you don't. A lost callback. This is money you were paid and did not credit, and it is the bucket that generates support tickets. It should be auto-recoverable: you have the receipt, so settle it through the same idempotent path a callback would have taken.

**Phantom**, you have it, Safaricom doesn't. This should be empty. If it isn't, either you are reading the wrong shortcode or something is writing transactions that never happened. Alert loudly; do not auto-resolve.

**Mismatched**, the amounts disagree. Almost always a rounding or currency-unit bug on your side. Also alert; never auto-correct, because the correction is a judgement call.

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

## Proving it under concurrency, not hoping

A unique constraint is only as good as your belief that it is being hit. I wanted to see the race fail, so I wrote the test that fires the same callback at the handler from several directions at once.

```typescript
it('settles once when duplicate callbacks arrive concurrently', async () => {
  await givenPendingPayment('ws_CO_191220191020363925')

  // The naive read-then-write version passes this at concurrency 1 and
  // fails here, which is exactly the shape of the production bug.
  await Promise.all(
    Array.from({ length: 8 }, () => post(successCallback))
  )

  const entries = await db.ledgerEntry.findMany({
    where: { reference: 'NLJ7RT61SV' },
  })
  expect(entries).toHaveLength(1)
})
```

Eight is arbitrary. What matters is that it is more than one and that they are genuinely in flight together. This test failed on my original implementation and passes on the constraint-based one, which is the only evidence worth having that the fix is real.

Run it against a real Postgres rather than a mock. The whole mechanism is a database guarantee, and a mocked database will happily tell you the guarantee holds when it does not. Integration tests against a disposable container are worth the extra seconds here more than almost anywhere else.

## Partial failure inside the transaction

There is a case the happy path hides. The unique insert succeeds, the payment update succeeds, and then the ledger write throws because of some unrelated constraint.

Because all three are inside one transaction, everything rolls back, including the row whose existence was supposed to record that you had processed this callback. Safaricom retries, and you process it again, correctly, from scratch. That is the behaviour you want and it is worth understanding why: the idempotency marker and the work it protects have to commit together or not at all. Split them across two transactions and you invent a state where the marker says done and the work never happened.

Which is also the argument against a tempting optimisation. Writing the marker first, in its own quick transaction, and doing the settlement afterwards feels tidier and is wrong. The gap between the two is a window where a crash leaves you permanently unable to process a real payment, because your own marker is now lying to you.

## When the SUM gets expensive

Deriving a balance from a ledger is correct and it does not stay cheap forever. A busy account after a year is a lot of rows to add up on every read.

The fix is a rollup, and the important property is that it must never become a second source of truth.

```sql
-- Closing balance per account per month. Derived, disposable, and
-- rebuildable from the ledger at any time.
CREATE TABLE ledger_month (
  account_id    uuid        NOT NULL,
  month         date        NOT NULL,
  closing_cents bigint      NOT NULL,
  computed_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (account_id, month)
);
```

Balance becomes the most recent closed month plus the entries since. If the rollup is ever wrong, you delete it and recompute, because every input still exists. That is the whole reason to keep the ledger append-only: the summary is allowed to be wrong, temporarily, because it is never the thing you trust.

I would not build this on day one. I would build it the first time a balance query shows up in a slow-query log, and not before.

## What to alert on, and what to swallow

The reconciliation job produces three buckets and they deserve three different responses.

Missing transactions, where Safaricom has a payment you do not, should be recovered automatically. You have the receipt, so push it through the same idempotent settlement path a callback would have used. Log the count. Do not page anybody at three in the morning for a lost callback the system just healed on its own.

Phantom transactions, where you have a payment Safaricom does not, should page somebody. This bucket should be empty. If it is not, either you are reconciling against the wrong shortcode or something in your system is inventing transactions, and both of those are worth waking up for.

Mismatched amounts should alert but never auto-correct. It is almost always a rounding or minor-unit bug on your side, and the correction is a judgement about which number is right. A machine guessing at that is how a small discrepancy becomes a large one.

The thing I would add to any reconciliation job: emit the counts every single day, including the zeroes. A job that only speaks when something is wrong is indistinguishable from a job that has stopped running, and I have written about [what that silence costs](/blog/cron-jobs-failing-in-silence) elsewhere. A daily line saying nought, nought, nought is how you know the check is alive.

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
