---
title: "Fourteen Jobs Ran at 2am and Nobody Would Have Known"
metaTitle: "Cron Failure Alerting: console.error Is Not an Alert"
slug: cron-jobs-failing-in-silence
excerpt: "The nightly batch caught every error properly, logged it properly, and recorded it in the response. What it never did was tell a human. One of those jobs carries a statutory deadline."
date: "2026-07-09"
category: "Engineering"
targetKeyword: "cron job failure alerting"
keywords:
  - "cron alerting"
  - "background job monitoring"
  - "silent failure"
  - "scheduled jobs"
  - "observability"
featured: false
---

The nightly cron did everything right except the last thing.

Fourteen jobs. Each one wrapped so a failure could not take down its neighbours. Every error caught into a structured outcome. A line written to the log. The whole result recorded in the response body, neatly, with which jobs passed and which did not.

Read that code and it looks careful. It looks like somebody who had thought about failure.

Then ask the only question that matters: when a job fails at two in the morning, who finds out?

Nobody. Not one path in that entire flow reaches a person.

## A log line is not an alert

I want to be blunt about this because I got it wrong for months, and I have seen the same shape in other people's codebases since.

`console.error` in a serverless function log is not alerting. It is a note left in a room nobody enters.

The reasoning that gets you there is seductive. The error is caught, so nothing crashes. It is logged, so the information exists. The logs are searchable, so you could find it. The response body records it, so it is in the audit trail.

Every one of those statements is true. And together they add up to nothing, because they all describe information at rest. Alerting is information that comes and finds you. The difference is not technical sophistication. It is direction. Everything I had built was pull. Not one piece of it was push.

Nobody opens Vercel function logs at 02:00 to check whether last night's batch went fine. Nobody opens them at 09:00 either, not unless something else already told them to look. Logs are where you go once you already suspect a problem. They are terrible at telling you a problem exists.

## What was actually running unwatched

The reason this stopped being an abstract concern is what those fourteen jobs do.

Plan expiry. If it fails, agents who have stopped paying keep their listings live, and agents who renewed might not get what they paid for. Listing expiry, same shape in reverse: stale properties stay up, and on a platform whose entire proposition is that listings can be believed, a flat that was let three weeks ago is exactly the thing that destroys the proposition.

Viewing reminders. If those do not fire, somebody does not turn up to a viewing, an agent wastes an afternoon, and the person who missed it blames us.

And then the one that changes the risk category entirely: the data-subject access request export. That has a statutory deadline attached to it. A job silently failing for a fortnight there is not a bug with a support ticket at the end of it. It is a compliance failure, and the fact that it failed quietly is not a defence.

That is what turned this from a tidy-up into something I fixed the same day. Not that jobs could fail. Jobs will always fail. That a job carrying a legal obligation could fail every night for two weeks and produce precisely the same amount of noise as a job that succeeded.

## The fix is smaller than the problem

The pattern already existed in the codebase. Two other places, the Paystack webhook owner-mismatch case and the data-request notifier, already pushed a `system_alert` out to every admin when something needed a human.

So the fix was not new machinery. It was noticing that the cron dispatcher was the third place that needed the pattern and had never been given it:

```typescript
/**
 * A failed job has to reach a person. Everything else in this path records
 * the failure somewhere it will only be read by someone who already knows
 * to look, which is exactly the case that never happens at 02:00.
 */
async function reportOutcomes(outcomes: JobOutcome[]) {
  const failed = outcomes.filter((outcome) => !outcome.ok)
  if (failed.length === 0) return

  await alertAdmins({
    kind: 'cron_failure',
    subject: `${failed.length} of ${outcomes.length} nightly jobs failed`,
    // Name every job. "Some jobs failed" sends someone to the logs, which
    // is the step this alert exists to remove.
    body: failed
      .map((outcome) => `${outcome.job}: ${outcome.error}`)
      .join('\n'),
  })
}
```

Naming the jobs in the alert is not cosmetic. An alert that says something went wrong has only moved the problem: now a person has to go and find out what, in the logs, at whatever hour. An alert that says which job and why is one somebody can act on from their phone.

## The absence you cannot detect

There is a failure mode that this fix still does not cover, and it is the more frightening one.

If the whole cron stops firing, no job fails. There are no outcomes, so there is nothing to alert about. Silence is what success sounds like and it is also what total absence sounds like, and my alerting could not distinguish them.

The answer is to invert it. Instead of only alerting when something fails, record when the batch last completed, and alert when that timestamp gets too old. A heartbeat.

```sql
-- Alert when the nightly batch has not completed in over 26 hours. Silence
-- from a job that should be noisy every 24 hours is itself the signal.
SELECT 'nightly batch has not completed' AS alert
WHERE (
  SELECT max(completed_at) FROM cron_run WHERE name = 'nightly'
) < now() - interval '26 hours';
```

Twenty-six rather than twenty-four, because a job that drifts by an hour should not page anybody. Wide enough that normal variance is quiet, tight enough that a real stop gets caught the same day.

## The question I ask now

Every time I write something that runs without a person watching, I ask one thing: **if this fails tonight, what wakes somebody up?**

If the honest answer is a log line, it is not handled. If the answer is that the failure is recorded somewhere searchable, it is not handled. If the answer is that a user will eventually complain, it is definitely not handled, because that means the detection mechanism is a person losing trust in the product.

The uncomfortable version of this question is the one about absence. Not *what happens if this fails*, but *what happens if this simply never runs again*. A surprising amount of infrastructure has no answer to that at all, and it is the failure that lasts longest, because nothing anywhere is shaped like a complaint.

Mine went unnoticed because a batch that never runs looks exactly like a batch with nothing to report. That is a really hard thing to see, and the only reason I saw it at all was sitting down and asking, job by job, who finds out.
