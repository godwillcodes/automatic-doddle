---
title: "M-Pesa Refunds and Reversals: Undoing a Payment You Already Took"
metaTitle: "M-Pesa Refunds and Reversals in Production"
slug: mpesa-refunds-and-reversals
excerpt: "There are two ways to give money back and they are not interchangeable. One rewinds the original transaction, one sends a new payment. Picking the wrong one leaves your ledger describing something that did not happen."
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

Every platform that takes money eventually has to give some back. A duplicate charge. An order that cannot be fulfilled. A listing taken down after the agent paid for it.

M-Pesa gives you two mechanisms for that, and most teams reach for whichever they find first. They are not equivalent, they leave different records, and the wrong choice produces a ledger that describes something which did not happen.

## Reversal and payout are different operations

**Reversal** rewinds a specific transaction. You give Daraja the original receipt number and it puts that transaction back. The customer sees a reversal against the original payment. Your books show the original payment undone.

**B2C payout** sends fresh money to a phone number. It has no relationship to the original payment as far as M-Pesa is concerned. The customer sees a payment arriving from you. Your books show a payment in and a separate payment out.

The distinction matters for three practical reasons.

Reversal only works on a transaction you actually received, within whatever window Safaricom applies, and it returns the exact amount. You cannot part-reverse. A partial refund is a payout, always.

Reversal moves the money back through the same rail it came in on, so it does not consume your B2C float. A payout does, which means a busy refund day and a low float can leave you unable to refund.

And reversal requires the original `TransactionID`, which is the `MpesaReceiptNumber` from the callback. If you did not store it, you cannot reverse. That is the strongest practical argument for [logging the entire callback payload](/blog/mpesa-idempotency-reconciliation) rather than the fields you thought you needed.

The rule I use: **full refund of a payment we received, promptly, is a reversal. Everything else is a payout.** Partial amounts, goodwill credit, anything outside the window, anything where the original receipt is missing.

## Reversal, in practice

Reversal uses the same initiator credentials as B2C, so the `SecurityCredential` work in [the payouts guide](/blog/mpesa-b2c-payouts) applies unchanged, and Reversal needs its own whitelisting on the shortcode.

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

That misspelled field name is real. `RecieverIdentifierType` is what the API expects, and spelling it correctly gets your request rejected. It is worth a comment in the code, because the next person to read it will assume it is a mistake and fix it.

Like B2C, the response only confirms the request was accepted. The outcome arrives on `ResultURL`, asynchronously, and the same rule applies: **only an explicit failure means failed.** A timeout means ask again.

## The ledger is where refunds actually go wrong

The code is the easy part. The bookkeeping is what causes the argument three months later.

The temptation is to treat a refund as an edit: find the original entry, negate it, or mark it refunded and move on. That erases the fact that a payment ever happened, which is precisely the record you need when someone disputes the refund itself.

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

Now the ledger reads as a history rather than a state: money came in on one receipt, went out on another, and the balance is the sum. Both events are true, and both are still there. The `reverses` column carries the relationship without destroying either side of it.

`refundedAt` on the payment is a derived convenience for querying. The ledger remains the source of truth. If they ever disagree, the ledger is right.

## Reversing what you never received

The one that will bite you eventually: somebody pays the right shortcode with the wrong account reference, or pays twice, or pays for something already cancelled. You have money that does not correspond to an order.

The instinct is to reverse it immediately, which is usually right, but only after you are sure it is genuinely unmatched. The reconciliation sweep is what tells you that, and it is worth being conservative about the difference between "unmatched" and "not matched yet":

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

An hour is generous, and generous is correct here. Automatically reversing a payment that was about to be matched turns a race condition into a customer who paid, got reversed, and no longer trusts you.

I do not auto-reverse orphans. The sweep flags them, a person looks, and the reversal is a decision. The volume is low enough that this is cheap, and the cost of getting it wrong automatically is high enough that it is worth a human.

## What to build before you need it

Refunds are always urgent when they happen, and nobody builds them calmly. A few things are much cheaper to have in advance:

**Store the receipt number on every payment.** Without it there is no reversal, only a payout, and payouts cost float.

**Store the raw callback.** The full payload settles disputes that a normalised row cannot.

**Decide the reversal window before you are in one.** Whatever Safaricom's limit is, pick your own policy inside it and encode it, so the answer is a rule rather than an argument.

**Make refunds idempotent on the same receipt-number constraint as payments.** Refunding twice is the same class of bug as crediting twice, and the same `UNIQUE` constraint prevents it.

**Log who authorised it.** Not for the code. For the conversation six months later about why this particular refund was issued.

---

Part of a series on production M-Pesa integration: [the Next.js integration guide](/blog/mpesa-daraja-api-nextjs), [idempotency and reconciliation](/blog/mpesa-idempotency-reconciliation), [B2C payouts](/blog/mpesa-b2c-payouts), and [getting approved for production](/blog/mpesa-daraja-production-go-live).
