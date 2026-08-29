---
title: "Building SpaceYako: Verification That Takes Itself Away"
metaTitle: "Building SpaceYako: Listing Fraud and Verification"
slug: building-spaceyako-verification
excerpt: "A property platform for Kenya, where the fraud is specific: stolen photographs and lapsed licences. Three mechanisms, one structural decision, and why the badge has to expire without anyone remembering to remove it."
date: "2026-08-29"
category: "Trust Systems"
targetKeyword: "property listing fraud detection"
keywords:
  - "property marketplace verification"
  - "listing fraud detection"
  - "perceptual hash duplicate images"
  - "dHash"
  - "trust and safety"
  - "Kenya property platform"
featured: true
---

House hunting in Nairobi runs on a specific dread. You send a viewing fee to somebody who sounds legitimate, and either the flat exists or it does not. Enough people have lost money that way that every new platform starts under suspicion, and no amount of reassuring copy fixes that, because the platform that took the last deposit had reassuring copy too.

[SpaceYako](https://www.spaceyako.com) is the property platform I built and run. Three months of it have gone almost entirely into one question, and it is not search or maps: can a stranger check that a listing is telling the truth?

## The structural decision comes first

Before any verification mechanism, one choice does more work than all of them: **agents pay to list, seekers never pay, and no money moves between users.**

That is not a pricing decision dressed up as ethics. It removes the mechanism the scams depend on. There is no deposit for the platform to hold, no escrow claim to make, and nothing for a fraudulent agent to route through us. The money a seeker loses in the classic scam is money we never touch, which means we never have to be believed about holding it.

It also has a consequence I did not fully appreciate at the start: it makes the agent the customer. The person paying is the person whose behaviour we most need to constrain. Every verification decision below is therefore a decision to make a paying customer's life harder, which is exactly the tension that makes trust systems fail at other companies.

## The fraud is not fake writing. It is stolen photographs.

The naive model of a fake listing is invented copy. That is not the playbook here.

The playbook is taking somebody else's photographs and re-posting them as your own. The description is freshly written, the price is plausible, the location is real. Only the pictures are stolen. Text screening cannot see that at all.

So the system checks pixels, not just prose. But a cryptographic hash is useless for this: re-saving a JPEG at different quality, cropping two pixels, or simply running the file through our own image pipeline changes every bit of a `sha256`. What survives that is a **perceptual** hash.

```typescript src/lib/images/phash.ts
/** Width is 9 so that 8 horizontal comparisons per row yield 64 bits. */
const HASH_W = 9
const HASH_H = 8

/**
 * Hamming distance at or below this counts as "the same photograph".
 *
 * Tuned conservatively. dHash on unrelated photos clusters around 30+ bits of
 * difference; the same image re-encoded typically lands under 6. Ten leaves
 * room for a crop or a watermark without pulling in merely similar rooms.
 */
export const DUPLICATE_DISTANCE = 10
```

dHash encodes the *gradient* between adjacent pixels of a tiny greyscale thumbnail. Two photographs of different rooms produce very different gradients. The same photograph re-compressed produces almost identical ones. That is precisely the property needed here.

The threshold is the interesting part. Ten is deliberately conservative, and the reason is asymmetric cost: **a false positive accuses a real agent of stealing a photograph.** That is a worse outcome than missing one duplicate, because one is a wrong accusation against a paying customer and the other is a listing a moderator will probably catch anyway. When a system's two failure modes are not equally bad, the threshold should not sit in the middle.

Storing it as a signed 64-bit integer means Postgres can do the comparison natively rather than dragging every hash into Node:

```sql
-- bit_count over XOR is the Hamming distance. Doing this in the database
-- keeps the comparison next to the data instead of streaming every hash
-- into the application to loop over.
SELECT id, bit_count(phash # $1) AS distance
FROM property_images
WHERE phash IS NOT NULL
  AND bit_count(phash # $1) <= 10
ORDER BY distance;
```

## The badge has to expire on its own

The verification most people build is a boolean. An admin looks at something, sets `is_verified = true`, and it stays true forever. That is not a verification. It is a record that somebody once looked.

In Kenya, anyone who sells, lets, leases or manages property must be registered with the **Estate Agents Registration Board** and hold a current annual practising certificate. An agent whose certificate has lapsed is legally barred from practising. That makes EARB standing the only signal on the platform with legal force behind it, and the only one a buyer who has just been shown a fake listing would actually find reassuring.

Crucially, it is a signal that **decays**:

```typescript src/lib/agents/earb.ts
/**
 * Current standing. `lapsed` is a first-class state, not a synonym for
 * unverified: the agent *was* checked, and their certificate has since
 * expired. It must decay on its own, without an admin doing anything — that
 * is the whole point of tracking the expiry date.
 */
export function earbStanding(agent: EarbInput, now: Date = new Date()): EarbStanding {
  const verifiedAt = toDate(agent.earbVerifiedAt)
  if (!agent.earbNumber || !verifiedAt) return 'unverified'

  const expiry = toDate(agent.practisingCertificateExpiresAt)
  // No recorded expiry on an otherwise-verified agent is treated as lapsed,
  // not verified: an annual certificate with no renewal date on file is
  // precisely the case we cannot vouch for.
  if (!expiry) return 'lapsed'

  return expiry.getTime() > now.getTime() ? 'verified' : 'lapsed'
}
```

Two things in there are doing real work.

**`lapsed` is a state, not an absence.** Collapsing it into `unverified` throws away the fact that this agent was checked and has since fallen out of standing, which is a different thing to tell a buyer and a different thing to chase the agent about.

**Missing expiry means lapsed, not verified.** This is the branch that decides whether the system is honest. An annual certificate with no renewal date on file is exactly the case we cannot vouch for, and the tempting default, treat it as fine, we did check them once, is how boolean verification systems quietly become decorative. Unknown resolves against the badge.

Because standing is computed from the expiry date rather than stored as a flag, nobody has to remember to remove anything. The badge disappears when the certificate does. That is the only version of verification I now consider worth building.

## Two badges that must never merge

There is a second, weaker signal: `agents.isVerified`, which means an admin looked at this person's identification. It is useful. It is not a licence.

The codebase is explicit that these must stay separate in the interface, and the reason is that merging them launders the weak signal into the strong one. A buyer reading a single "Verified" badge cannot tell whether it means *we saw their ID* or *the national regulator says they may legally practise*. Those support completely different decisions about whether to hand somebody a deposit.

There is also a legacy `licenseNumber` column: free text, validated by nothing, entered by the agent. It is display-only, and treating it as proof would be worse than not showing it at all, a number that looks official and means nothing is an invitation to trust the wrong thing.

## Screening advises, it does not decide

Every submitted listing is scored for fraud risk by a model, grounded in the patterns documented in this market rather than generic spam heuristics: rental-deposit scams, phantom developments, one property sold to several buyers, unregistered "agents" who move you to WhatsApp immediately. The screening code cites the EACC's figure putting land fraud above 40% of Kenyan corruption cases as the reason those specific signals were chosen.

Three constraints on it, all of which I would keep:

**Advisory only. Nothing auto-rejects.** A false positive that silently blocks a legitimate agent's listing costs more than a false negative a moderator catches. The output is reasoning written into a moderation queue, so a human arrives at each listing with the suspicious parts already circled.

**Never blocks submission.** It runs after the response is returned. An agent posting a listing should never wait on a model, and a model outage should never stop the platform accepting work.

**Cheap enough to run on everything.** Roughly a hundredth of a cent per listing. That number is what makes screening *every* submission viable rather than sampling, and sampling is how the one you did not check turns out to be the one that mattered.

Text duplicate detection stays in SQL, as trigram similarity against existing descriptions, rather than going to the model. It is exact, free, and a model cannot do it better.

## What I got wrong first

I under-specified `lapsed`. The first version had verified and unverified, and the expiry date existed only to send renewal reminders. It took someone asking "what does the badge say the day after a certificate expires" to notice the answer was "it still says verified". The fix was small. Noticing was the work.

I put authorization where I could not enforce it. There is a migration in the repository that enables row-level security with *zero policies*, purely to close Supabase's anonymous PostgREST surface. The application connects as the table owner and bypasses RLS entirely. It is deliberate and it is documented, but it means the database will not catch an authorization mistake for you, every check has to be in application code, and a code review is the only thing standing behind it. I would rather that were belt and braces.

Migrations nearly took down a deploy. They run inside every build. Through Supabase's session pooler, which caps at fifteen connections, a migration races live traffic and can take the whole deploy with it. It now uses a direct, non-pooled connection and retries only on transient pool contention, failing fast on anything real. That distinction, retry the transient, never retry the real error, is the whole of the fix.

## What I would tell someone building the same thing

Decide what money you refuse to touch, first. It constrains every trust decision after it, and it is much harder to retrofit than to start with.

Model the fraud that actually happens in your market. Stolen photographs and lapsed licences are specific to this one. Generic trust-and-safety advice would have had me building a review system.

Make every badge decay. If a verification cannot expire without human action, it will eventually be wrong and nobody will notice. The withdrawal path is the product; the badge is just what it looks like when it has not fired.

Set thresholds by the cost of being wrong, not by accuracy. Ten bits of Hamming distance is not the most accurate cut. It is the one where the expensive mistake is rare.

Keep the model advisory. Anything that can silently block a paying customer will eventually do it to the wrong one.

---

The studio's account of the venture, including the parts that are not engineering, is at [Lock & Mercer](https://www.lockandmercer.com/ventures/spaceyako). The principle underneath the expiring badge is written up separately as [a badge is only worth what removes it](https://www.lockandmercer.com/notes/a-badge-is-worth-what-removes-it).
