---
title: "M-Pesa Refunds and Reversals: Undoing a Payment You Already Took"
metaTitle: "M-Pesa Refunds and Reversals in Production"
slug: mpesa-refunds-and-reversals
excerpt: "Somebody paid for a listing we had to take down. Giving the money back turned out to be a harder decision than taking it, because M-Pesa offers two ways to do it and they leave completely different records."
date: "2026-05-20"
category: "Mobile Money"
targetKeyword: "mpesa reversal api"
keywords:
  - "M-Pesa reversal"
  - "M-Pesa refund"
  - "Daraja Reversal API"
  - "TransactionReversal"
  - "payment refund Kenya"
featured: false
---

An agent paid to list a property. The listing turned out to be one we had to take down. So we owed him his money back, which felt like the simplest thing in the world until I opened the Daraja docs and found two different ways to do it.

I picked one, more or less at random, because they looked equivalent. They are not equivalent. Three months later, reconciling the books, I was looking at a ledger that described a transaction that had never happened.

## Two mechanisms that are not the same thing

**Reversal** rewinds a specific transaction. You hand Daraja the original receipt number and it puts that payment back. The customer sees a reversal against what they paid. Your books show the original payment undone.

**B2C payout** sends new money to a phone number. As far as M-Pesa is concerned it has no relationship to the original payment at all. The customer sees money arriving from you. Your books show a payment in, and a separate payment out.

Same amount, same person, same intent. Completely different records.

Three things force the choice, and it is worth knowing them before you are in the situation rather than during it.

Reversal only works on a transaction you actually received, inside whatever window Safaricom applies, and it returns the exact amount. You cannot part-reverse. Any partial refund is a payout, always, no exceptions.

Reversal returns the money down the rail it arrived on, so it does not touch your B2C float. A payout does. That means a busy refund day plus a low float leaves you unable to refund anybody, which is a very uncomfortable thing to discover on the day it happens.

And reversal needs the original `TransactionID`, which is the `MpesaReceiptNumber` from the callback. No receipt, no reversal. That single fact is the strongest argument I know for [storing the entire callback payload](/blog/mpesa-idempotency-reconciliation) rather than the four fields you thought you needed at the time.

The rule I settled on: a full refund of a payment we received, promptly, is a reversal. Everything else is a payout. Partial amounts, goodwill credit, anything outside the window, anything where the receipt is missing.

## Reversal in practice

Reversal uses the same initiator credentials as B2C, so all the `SecurityCredential` work from [the payouts guide](/blog/mpesa-b2c-payouts) applies unchanged. And like B2C, Reversal needs its own whitelisting on the shortcode. Going live for STK Push does not give it to you.

```typescript lib/mpesa/reversal.ts
import { mpesaConfig } from './config'
import { getAccessToken } from './token'

const SECURITY_CREDENTIAL = process.env.MPESA_SECURITY_CREDENTIAL!

export async function reverseTransaction(params: {
  /** The MpesaReceiptNumber from the original payment callback. */
  transactionId: string
  amount: number
  remarks: string
}) {
  const token = await getAccessToken()

  const response = await fetch(
    `${mpesaConfig.baseUrl}/mpesa/reversal/v1/request`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        Initiator: mpesaConfig.initiatorName,
        SecurityCredential: SECURITY_CREDENTIAL,
        CommandID: 'TransactionReversal',
        TransactionID: params.transactionId,
        Amount: params.amount,
        ReceiverParty: mpesaConfig.shortcode,
        // 11 is the organisation identifier type. Safaricom's own spelling
        // of this field is "Reciever"; it is not a typo on your side.
        RecieverIdentifierType: '11',
        Remarks: params.remarks.slice(0, 100),
        QueueTimeOutURL: mpesaConfig.reversalTimeoutUrl,
        ResultURL: mpesaConfig.reversalResultUrl,
        Occasion: '',
      }),
    }
  )

  const data = await response.json()

  if (data.ResponseCode !== '0') {
    throw new Error(
      `Reversal rejected: ${data.errorMessage ?? data.ResponseDescription ?? 'unknown'}`
    )
  }

  return { conversationId: data.ConversationID as string }
}
```

That misspelling is real and it is not yours. `RecieverIdentifierType` is what the API expects. Spell it correctly and your request is rejected. Leave the comment in, because the next person to read that line will assume it is a typo and helpfully fix it, and then spend an hour wondering why reversals stopped working.

As with B2C, the response only tells you the request was accepted. The outcome lands on `ResultURL`, asynchronously, and the same rule holds: only an explicit failure means failed. A timeout means ask again later.

## The ledger is where refunds actually go wrong

The code above is the easy part. The bookkeeping is what produces the argument three months later, and mine did.

The instinct is to treat a refund as an edit. Find the original entry, negate it, or set a flag and move on. That erases the fact that a payment ever happened, which is exactly the record you need when somebody disputes the refund itself.

A refund is a new event. It gets its own entry:

```typescript
await db.$transaction(async (tx) => {
  // The reversal or payout receipt is the idempotency key, exactly as the
  // original payment receipt was. Same constraint, same protection.
  await tx.ledgerEntry.create({
    data: {
      accountId,
      kind: reversed ? 'MPESA_REVERSAL' : 'MPESA_REFUND_PAYOUT',
      amountCents: -amountCents,
      reference: refundReceipt,
      // Point at what is being undone without editing it.
      reverses: originalReceipt,
    },
  })

  await tx.payment.update({
    where: { receipt: originalReceipt },
    data: { refundedAt: new Date() },
  })
})
```

Now the ledger reads as history rather than state. Money came in on one receipt, went out on another, and the balance is the sum of both. Both events are true and both are still there. The `reverses` column carries the relationship without destroying either side of it.

`refundedAt` on the payment is a convenience for querying. The ledger is the source of truth, and if the two ever disagree, the ledger is right and the flag is a bug.

I learned this the expensive way. My first version marked the payment refunded and adjusted a balance. When the agent came back weeks later asking why he had been charged at all, I could show him a payment marked refunded and nothing else. No record of what we sent back, when, or on what receipt. I believed him, refunded again, and paid twice for one mistake.

## Reversing what you never should have received

This one will happen to you. Somebody pays the right shortcode with the wrong account reference. Somebody pays twice. Somebody pays for a listing that was cancelled an hour earlier. You are holding money that corresponds to nothing.

The instinct is to reverse it straight away, and that is usually right, but only once you are sure it is really unmatched rather than not matched yet.

```typescript
/**
 * Payments with no order attached. Deliberately excludes anything recent:
 * a payment can legitimately arrive before the order row commits, and
 * reversing that is worse than waiting.
 */
export async function findOrphanedPayments() {
  return db.payment.findMany({
    where: {
      orderId: null,
      refundedAt: null,
      createdAt: { lt: new Date(Date.now() - 60 * 60 * 1000) },
    },
  })
}
```

An hour is generous and generous is correct. Automatically reversing a payment that was about to be matched turns a harmless race condition into a customer who paid, got their money thrown back at them, and now believes your platform is broken. That is a much worse outcome than a payment sitting unmatched for sixty minutes.

I do not auto-reverse orphans. The sweep flags them, a person looks, and the reversal is a decision somebody makes. The volume is low enough that this costs almost nothing, and the cost of doing it wrong automatically is somebody's trust.

## Build this before you need it

Refunds are always urgent when they arrive, and nobody designs them calmly under pressure. A few things are far cheaper to have in place beforehand.

Store the receipt number on every single payment, because without it reversal is impossible and you are forced into a payout that costs float.

Store the raw callback, because the full payload settles disputes that a tidy normalised row cannot.

Decide your reversal window before you are inside one. Whatever Safaricom's limit is, pick your own policy inside it and write it down, so the answer is a rule rather than an argument between two people under pressure.

Make refunds idempotent on the same receipt-number constraint as payments. Refunding twice is exactly the same class of bug as crediting twice, and the same `UNIQUE` constraint prevents both.

And log who authorised it. Not for the code. For the conversation six months later about why this particular refund was issued, which will happen, and which you will not remember.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation), [B2C payouts](/blog/mpesa-b2c-payouts), and [getting approved for production](/blog/mpesa-daraja-production-go-live).
