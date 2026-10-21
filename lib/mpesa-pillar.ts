/**
 * The /mpesa pillar's structure.
 *
 * Nine posts existed with no hub, so they competed with each other and
 * accumulated no topical weight. The grouping below is the integration
 * lifecycle rather than a date order, because that is the order the problems
 * actually arrive in — and it is what lets a reader locate themselves on the
 * page instead of scanning nine headlines.
 *
 * Slugs are declared here rather than inferred from a category field so that a
 * post appears on this hub only when it has been deliberately placed in a
 * stage. A post that cannot be placed does not belong on the pillar.
 */

export type Stage = {
  id: string
  title: string
  /** What a reader is trying to do at this point, in their words. */
  standfirst: string
  slugs: string[]
}

export const PILLAR_STAGES: Stage[] = [
  {
    id: 'integrate',
    title: 'Integrate',
    standfirst: 'Getting the first payment to work at all.',
    slugs: ['mpesa-daraja-api-nextjs', 'mpesa-stk-push-serverless'],
  },
  {
    id: 'test',
    title: 'Test',
    standfirst:
      'Proving it works before a real customer finds out it does not. Callbacks are the hard part: they arrive from Safaricom, so nothing on your laptop can receive one by default.',
    slugs: ['test-mpesa-callbacks-locally', 'mpesa-callback-not-received'],
  },
  {
    id: 'go-live',
    title: 'Go live',
    standfirst:
      'The part that is not engineering. Budget for it separately, because none of it is under your control.',
    slugs: ['mpesa-daraja-production-go-live'],
  },
  {
    id: 'operate',
    title: 'Operate',
    standfirst:
      'What breaks once real money is moving and nobody is watching the terminal.',
    slugs: ['mpesa-b2c-payouts', 'mpesa-refunds-and-reversals', 'scaling-fintech-mpesa'],
  },
  {
    id: 'reconcile',
    title: 'Reconcile',
    standfirst:
      'Making your ledger and Safaricom’s agree, including on the days they do not.',
    slugs: ['mpesa-idempotency-reconciliation'],
  },
]

/** Every slug the pillar claims, for cross-linking and for the audit. */
export const PILLAR_SLUGS = PILLAR_STAGES.flatMap((s) => s.slugs)

/**
 * What this pillar deliberately does not cover.
 *
 * Linking out to the beginner material is a trust signal and costs nothing:
 * the people it sends away were never going to convert here, and saying so
 * plainly is the clearest way to state what this collection is for.
 */
export const OUT_OF_SCOPE = {
  text: 'Your first STK Push, step by step',
  note: 'This pillar starts after that. For a beginner walkthrough, the dedicated tutorial series elsewhere is a better use of your time.',
}
