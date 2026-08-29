---
title: "Our Trust Signal Could Be Earned by Clicking a Button"
metaTitle: "Designing a Response-Time Metric That Cannot Be Gamed"
slug: trust-metric-you-could-click
excerpt: "Usually replies in about two hours. A real number, computed from real data, and an agent could produce it without ever answering anybody. The problem was what we let count as a reply."
date: "2026-08-06"
category: "Trust Systems"
targetKeyword: "response time metric gaming"
keywords:
  - "trust signals"
  - "marketplace metrics"
  - "gameable metrics"
  - "agent response time"
  - "product integrity"
featured: false
---

On every agent profile on [SpaceYako](https://www.spaceyako.com) there is a line that says something like *usually replies in about two hours*.

It is one of the most load-carrying sentences on the platform. Somebody deciding whether to send an enquiry about a flat is deciding whether this stranger will respond, and that number is most of the answer.

It was computed from real data. It was accurate in the sense that the arithmetic was correct.

And an agent could produce a good one without ever replying to anybody.

## The button that counted as a reply

The CRM had a **Mark responded** button. Reasonable feature. An agent picks up the phone, deals with the enquiry, and ticks it off so it leaves their queue.

That click stamped `response_time`.

So the pipeline was: enquiry arrives, agent clicks a button, we measure the gap between those two events, and we publish it as a trust signal to strangers deciding whether to trust this person with a viewing fee.

Nothing in that chain required a human being to receive a reply.

I do not think anybody set out to game it. That is what makes it worse. The path of least resistance for a busy agent is to clear the queue, and clearing the queue looked identical, to our metric, to being responsive. We had built a system that rewarded tidying up over answering, and then printed the result on their profile as a promise to the public.

## Measure the thing, not the paperwork about the thing

The fix was to be strict about what counts, and the principle underneath it is one I now apply everywhere: **a metric may only be stamped by an action that is the thing itself, never by an action that reports the thing.**

A CRM click reports that a response happened. It is not a response. It cannot be, because nothing left the building.

```typescript src/lib/inquiries/response-time.ts
/**
 * What may stamp `inquiries.response_time`, which is the input to the public
 * "Usually replies in ~2h" figure.
 *
 * A CRM click ("Mark responded") is not a reply. Kenyan agents mostly answer
 * on WhatsApp; scheduling a viewing is the other in-product action that is
 * actually a response. Counting the button made the trust signal gameable.
 */
```

So two things stamp it now. A message actually sent to the enquirer, and a viewing actually scheduled with them. Both of those put something in front of the person who asked. The button stamps nothing.

## The hard part was WhatsApp

Being strict created an immediate problem, and it is the interesting one.

Most agents here reply on WhatsApp. That is simply how business is done, and it is not something to fight. So if only in-product messages count, the metric now systematically understates every agent who does the normal thing, and rewards the ones who happen to use our inbox.

That is not a smaller injustice than the original bug. It is a different one. The first version measured the wrong thing. A naive strict version would measure the right thing and only for a minority.

Which is why WhatsApp had to become a first-class channel rather than a thing happening outside the product. Once a reply sent through our WhatsApp integration is a real, observable event, it can stamp the metric honestly. The trust signal and the channel work are the same project, which I did not understand when I started either of them.

Where a conversation really leaves the platform, the honest response is not to guess. It is to have no number. Which brings up the other half.

## Absent beats invented

The old code had a job that swept through and synchronised an average response time onto every agent record. I removed it, and I would remove it again.

A stored average has to be maintained, which means at any moment it is stale by some unknown amount. Worse, it existed for every agent, including the ones with two enquiries ever. An average of two is not a pattern, but rendered as *usually replies in about two hours* it reads exactly like one.

The rule now is that the number is derived on read from qualifying events, and if there are not enough of them, the profile says nothing.

Nothing is a good answer. A visitor who sees no response-time line makes their own judgement. A visitor who sees a confident figure built on two data points has been actively misled, by us, in the exact place we were asking to be trusted.

That is the part I would push hardest on with anyone building marketplace trust has. The instinct is to fill every field, because a sparse profile looks unfinished. But a trust signal you cannot stand behind is worse than a blank space, because the blank space is honest about your uncertainty and the number is not.

## Three questions I now ask of any public metric

I got to these the slow way, by shipping one that failed all three.

**What is the cheapest way to produce a good score without doing the good thing?** If the answer is a click, or a status change, or anything that does not reach a real person, the metric measures paperwork. This is not about assuming bad faith. It is about knowing which behaviour you are subsidising, because people follow the path of least resistance and you built the path.

**Does it degrade to nothing, or to a lie?** Too little data has to produce silence. If a metric produces a confident-looking number from thin evidence, the failure mode is misleading a stranger.

**Does it decay?** Somebody responsive last year and absent since should not still be showing last year's figure. This is the same property that makes [an expiring verification badge](/blog/building-spaceyako-verification) worth having: a signal that cannot get worse on its own is not a signal, it is a trophy.

The response-time line, and the badges beside it, are live on agent profiles at [spaceyako.com](https://www.spaceyako.com).

The general version of that principle is written up on the studio site as [a badge is only worth what removes it](https://www.lockandmercer.com/notes/a-badge-is-worth-what-removes-it), and I keep arriving back at it from different directions. Verification, response times, ratings. Every trust signal is a claim you are making to somebody who cannot check it themselves, and the only thing that makes such a claim worth anything is that it can be taken away.
