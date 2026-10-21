/**
 * The Daraja code reference.
 *
 * WHY THIS EXISTS
 *
 * Safaricom's developer portal does not publish a consolidated list of result
 * codes or API error codes. I checked it on 21 October 2026: the landing page
 * describes Daraja 3.0 and the onboarding flow, names no API products, and
 * documents no error reference. So every developer integrating M-Pesa
 * reconstructs this table from forum threads, Stack Overflow answers and
 * whatever they have hit themselves.
 *
 * TWO FAMILIES, ROUTINELY CONFUSED
 *
 * They arrive at different moments and mean different things, and conflating
 * them is the single most common reason an integration handles the wrong case:
 *
 *   errorCode  — dotted strings like 400.002.02, returned SYNCHRONOUSLY in the
 *                HTTP response when a request is rejected before it reaches
 *                the customer. Your request was wrong.
 *   ResultCode — integers like 1032, delivered ASYNCHRONOUSLY to your callback
 *                after the customer's handset has been involved. Your request
 *                was fine; something happened at the other end.
 *
 * A 200 OK on the push request means Safaricom accepted it, NOT that the
 * customer paid. Treating acceptance as payment is the defect behind most
 * double-charges and most "it works in sandbox" reports.
 *
 * ATTESTATION
 *
 * `attested` records where each meaning comes from. Nothing here is invented.
 * Where community sources disagree, the row says so rather than picking a
 * winner — a reference that quietly guesses is worse than no reference.
 */

export type CodeFamily = 'result' | 'error'

export type DarajaCode = {
  code: string
  family: CodeFamily
  /** Safaricom's own wording where it is known, otherwise the settled community wording. */
  meaning: string
  /** What actually produces it, in production rather than in a tutorial. */
  cause: string
  /** What to do about it, including what to show the customer. */
  action: string
  /** Whether the customer can simply try again. Drives retry logic. */
  retryable: boolean
  attested: string
}

export const RESULT_CODES: DarajaCode[] = [
  {
    code: '0',
    family: 'result',
    meaning: 'Success',
    cause: 'The customer entered their PIN and the debit went through.',
    action:
      'The only code that means money moved. Reconcile against the MpesaReceiptNumber in the callback, not against your own request id — and make the handler idempotent, because this callback can arrive more than once.',
    retryable: false,
    attested: 'Universal across Safaricom documentation and every community source.',
  },
  {
    code: '1',
    family: 'result',
    meaning: 'Insufficient balance',
    cause: 'The customer has less in their M-Pesa account than the amount requested.',
    action:
      'Not a failure of your integration. Tell the customer the balance was short and offer to retry at a lower amount if your product allows part payment.',
    retryable: true,
    attested: 'Settled across community sources.',
  },
  {
    code: '17',
    family: 'result',
    meaning: 'Internal failure',
    cause: 'A fault inside M-Pesa, not in your request.',
    action:
      'Retry once after a short delay. If it repeats across different customers in a short window, it is an M-Pesa incident and no amount of retrying will fix it — fail gracefully and queue.',
    retryable: true,
    attested: 'Community sources; not individually documented by Safaricom.',
  },
  {
    code: '26',
    family: 'result',
    meaning: 'System busy',
    cause: 'M-Pesa is under load and shed your request.',
    action:
      'Back off and retry. This one clusters: if you see it at all, you will see a lot of it at once. Exponential backoff with jitter, not a fixed retry.',
    retryable: true,
    attested: 'Community sources.',
  },
  {
    code: '1001',
    family: 'result',
    meaning: 'Unable to lock subscriber, transaction in progress',
    cause:
      'The customer already has an STK prompt open — often one YOU sent seconds earlier because they double-clicked your pay button.',
    action:
      'Do not retry immediately; you will get the same code. Wait roughly 30 seconds for the existing prompt to expire. Better: stop the second request leaving your server at all by locking on the customer phone number for the lifetime of a prompt.',
    retryable: true,
    attested: 'Settled; also surfaces as errorCode 500.001.1001 on the synchronous path.',
  },
  {
    code: '1019',
    family: 'result',
    meaning: 'Transaction expired',
    cause: 'The prompt reached the handset and the customer left it until it timed out.',
    action:
      'Distinct from 1037: the prompt ARRIVED here. Safe to offer an immediate retry, because the customer is likely still at their phone.',
    retryable: true,
    attested: 'Community sources.',
  },
  {
    code: '1025',
    family: 'result',
    meaning: 'An error occurred while sending a push request',
    cause: 'The push failed on its way out, frequently alongside a malformed field.',
    action:
      'Check the amount and the account reference before retrying. An amount with decimals is a common trigger — M-Pesa works in whole shillings.',
    retryable: true,
    attested: 'Community sources.',
  },
  {
    code: '1032',
    family: 'result',
    meaning: 'Request cancelled by user',
    cause: 'The customer saw the prompt and pressed cancel.',
    action:
      'The most common non-success code in production, and it is not an error. Never show it as a failure — show a retry. Treating 1032 as an error is why so many Kenyan checkouts read as broken when the customer simply changed their mind.',
    retryable: true,
    attested: 'Universal across community sources.',
  },
  {
    code: '1037',
    family: 'result',
    meaning: 'DS timeout, user cannot be reached',
    cause:
      'The prompt never got to the handset: phone off, out of coverage, or on a call long enough to miss it.',
    action:
      'Distinct from 1019: nothing reached the customer. Retrying straight away usually fails the same way. Ask them to confirm the line is on before you try again.',
    retryable: true,
    attested: 'Settled across community sources.',
  },
  {
    code: '2001',
    family: 'result',
    meaning: 'Wrong PIN',
    cause: 'The customer entered an incorrect M-Pesa PIN.',
    action:
      'Offer a retry. Note the ambiguity below before you write a message around this code.',
    retryable: true,
    attested:
      'DISPUTED. Attested as "wrong PIN" in the STK Push callback context, but some sources list 2001 as "invalid initiator information". The initiator case belongs to the B2C and reversal APIs, which authenticate differently. Log the full callback rather than branching on this code alone.',
  },
]

export const ERROR_CODES: DarajaCode[] = [
  {
    code: '400.002.02',
    family: 'error',
    meaning: 'Bad request — invalid phone number',
    cause:
      'The MSISDN is not in the format Daraja accepts. It wants 2547XXXXXXXX or 2541XXXXXXXX: no plus, no leading zero, no spaces.',
    action:
      'Normalise on the way in, not at the call site. Kenyan users type 07…, +2547…, and 7… interchangeably, and all three have to become the same string before they reach Daraja.',
    retryable: false,
    attested: 'Community sources; consistent wording across them.',
  },
  {
    code: '404.001.03',
    family: 'error',
    meaning: 'Invalid access token, or URL not found',
    cause:
      'Almost always an environment mismatch: sandbox credentials against the production host, or the reverse.',
    action:
      'Check which base URL the token was minted against. The message says "not found", which sends people hunting for a typo in the path when the credentials are the actual problem.',
    retryable: false,
    attested: 'Community sources.',
  },
  {
    code: '500.001.1001',
    family: 'error',
    meaning: 'Unable to lock subscriber, a transaction is already in process',
    cause:
      'The synchronous twin of ResultCode 1001. The customer has an open prompt already.',
    action:
      'Wait about 30 seconds. Handling this on the synchronous path and 1001 on the callback path separately is a common source of duplicated retry logic — treat them as one condition.',
    retryable: true,
    attested: 'Community sources; pairs with ResultCode 1001.',
  },
]

export const ALL_CODES: DarajaCode[] = [...RESULT_CODES, ...ERROR_CODES]

/** Anchor id for deep links: /mpesa/result-codes#code-1032 */
export const anchorFor = (code: string) => `code-${code.replace(/\./g, '-')}`
