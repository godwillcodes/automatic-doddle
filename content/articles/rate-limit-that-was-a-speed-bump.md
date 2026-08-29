---
title: "My Rate Limit Was a Speed Bump Wearing a Ceiling's Clothes"
metaTitle: "Serverless Rate Limiting: The In-Memory Trap"
slug: rate-limit-that-was-a-speed-bump
excerpt: "An in-memory limiter on serverless does not limit to your number. It limits to your number times however many instances happen to be warm, and it forgets everything when one recycles."
date: "2026-07-23"
category: "Engineering"
targetKeyword: "serverless rate limiting in memory"
keywords:
  - "rate limiting serverless"
  - "Upstash Redis"
  - "distributed rate limit"
  - "OTP abuse"
  - "Fluid Compute"
featured: false
---

The code said five requests per minute. I believed it, because I had written it, and because the tests passed.

The tests passed because tests run in one process. Production does not.

## What "per minute" quietly meant

The limiter kept its counters in a module-level `Map`. Clean, fast, no external dependency, no network hop on a hot path. On a single long-lived Node process it is exactly right.

On serverless it is a different function entirely, and the difference is not subtle.

Each instance has its own module scope, so each has its own `Map` and its own counters. Under Fluid Compute a route is served by however many instances the platform has warm. Five requests per minute per instance, times eight warm instances, is forty requests a minute. Times whatever the platform scales to under load, which is precisely when somebody is attacking you.

The limit was not five. The limit was five times a number I did not control and could not see.

Worse, the counters die with the instance. An attacker who hits the ceiling on one instance waits for a recycle and gets a fresh allowance, and does not even need to know that is what is happening. Retrying is enough.

So the limiter was not a ceiling. It was a mild inconvenience with a ceiling's API.

## The two things it was protecting

I might have shrugged at this on a search endpoint. It was not on a search endpoint.

The limiter guarded OTP sends and dispute reports.

OTP is the obvious one. Every send costs money, and an unbounded send endpoint is somebody else's phone ringing at three in the morning, over and over, on my budget. The person being harassed did not sign up for that and cannot make it stop.

Dispute reports are the one I care about more. Anyone can report a listing. That is deliberate, and it has to stay open, because requiring an account to report a scam means the people most likely to be scammed report the fewest scams. But an open reporting endpoint with no real ceiling is a tool for burying a competitor's listings in noise until a moderator stops trusting the queue.

For both of those, the difference between a real limit and a speed bump is the difference between the feature working and the feature being a liability.

## The failure was silent, which is the actual bug

Here is the part I find hardest to forgive in my own code.

The distributed limiter was already written. It sat behind Upstash, it was edge-safe, and when the environment variables were missing it returned `null` and callers fell back to the in-memory version.

That fallback is good design. A missing optional dependency should not take the site down.

But `UPSTASH_REDIS_REST_URL` and its token were **unset in production**, and nothing anywhere said so. No warning at boot. No line in a log. No banner in an admin panel. The application came up perfectly healthy, served traffic, passed every check, and enforced a limit roughly eight times looser than the one written in the code, and the only way to discover that was to read the source and then go and check the environment.

The bug was not the fallback. The bug was that the degradation was invisible. A system that quietly does something weaker than it claims is worse than one that fails loudly, because you keep making decisions on the assumption that it works.

```typescript
/**
 * Fall back, but never silently. The in-memory limiter is per instance, so
 * on serverless the effective ceiling is `max x warm instances` and it resets
 * on recycle. That is fine for smoothing bursts and useless against somebody
 * who is deliberately trying.
 */
export function getRateLimiter() {
  const distributed = createUpstashLimiter()
  if (distributed) return distributed

  if (process.env.NODE_ENV === 'production') {
    // Loud on purpose. Anything that changes the security posture of the
    // app has to be visible without reading the source.
    console.error(
      '[rate-limit] UPSTASH_REDIS_REST_* unset: falling back to per-instance ' +
        'limiting. OTP and dispute endpoints are effectively unbounded.'
    )
    alertAdmins({
      kind: 'degraded_rate_limit',
      subject: 'Rate limiting degraded to per-instance',
    })
  }

  return createMemoryLimiter()
}
```

I went back and forth on whether to make this fatal in production, refusing to boot without Redis. I decided against it. Taking the whole site down because a rate limiter lost its backing store trades a security degradation for an outage, and that is not obviously the better trade.

But it has to be noisy. The rule I settled on: **anything that silently changes the security posture of the application gets an alert, not a log line.** If the app is now weaker than its own code claims, somebody needs to be told without going to look.

## The general shape

This is the same failure I keep finding in my own work, wearing a different costume each time.

The map that returned 200 with a watermark painted on it. The cron jobs that failed into a log nobody reads. And now a limiter that enforced a number nobody had chosen. In all three the system reported health while doing the wrong thing, and in all three the instrumentation was answering *is it running* when the question that mattered was *is it doing what I think*.

For rate limiting specifically, the checks worth having are unglamorous. Assert at startup that the backing store is actually reachable, rather than that the config exists. Fire more requests than the limit at a deployed environment and confirm you get a 429, because that is the only test that exercises the real topology. And if you take one thing: an in-memory counter on serverless is a per-instance counter, and per-instance is not a limit, it is an average.

The code that says five is not the limit. The topology is the limit.
