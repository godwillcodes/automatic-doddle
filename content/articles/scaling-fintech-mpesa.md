---
title: "What M-Pesa Teaches You About Building Fintech in Emerging Markets"
metaTitle: "M-Pesa Lessons for Emerging-Market Fintech"
slug: scaling-fintech-mpesa
excerpt: "M-Pesa moved money on feature phones and SMS while Silicon Valley was perfecting online banking for people who already had bank accounts. What it got right is not what most people think."
date: "2024-12-19"
category: "Fintech"
targetKeyword: "m-pesa lessons fintech emerging markets"
keywords:
  - "M-Pesa"
  - "fintech Africa"
  - "mobile money"
  - "emerging markets"
  - "financial inclusion"
  - "Kenya fintech"
  - "digital payments"
featured: false
---

I have watched a woman in Kibera pay her daughter's school fees from a Nokia with a cracked screen, standing in a queue at a kiosk, in under a minute. No bank account. No card. No app. No internet.

I have also watched a startup with eleven million dollars in funding fail to get a payment through in the same city.

Both of those things are true, and the gap between them is what I keep coming back to in African technology. It is not a story about a clever product. It is a story about what happens when you design for the person who actually exists instead of the person your framework assumes.

## Kenya in 2006 was not a market waiting for an app

Try to hold the actual conditions in your head, because everything else follows from them.

Fewer than one in five adults had a bank account. Bank branches clustered in cities, which meant that for most of the country the nearest one was a bus journey away. Smartphones were not scarce, they were basically absent. Internet penetration was in the single digits.

And people still needed to move money. Constantly. A son working construction in Nairobi supporting parents in Kisumu. A trader in Mombasa paying a supplier upcountry. This was not a niche. It was how the economy ran.

So how did money move? You gave cash to a bus driver and hoped. You sent it with a relative travelling that direction. You carried it yourself, which meant carrying the risk of being robbed on the way.

That is the problem M-Pesa solved. Not "banking is inconvenient". The problem was that moving money between two people in the same country was really dangerous, and everybody had simply accepted that.

When a solution arrives in a market like that, adoption is not a growth-hacking achievement. It is relief.

## The technology was deliberately unimpressive

Here is what still gets me. M-Pesa did not run on anything clever.

It ran on SMS and USSD, on whatever handset a person already owned, requiring no download, no data connection, no operating system version. If your phone could send a text, it could move money.

Every engineering instinct I have wants to improve that. Add an app. Add a rich interface. Add more to it. Every one of those improvements would have excluded the people it was built for.

That inversion is the whole lesson and it took me years to properly absorb it. In a market where the constraint is the device and the network rather than the idea, **the technical ceiling is set by the worst phone you are willing to serve.** Not the best. The worst. Every capability you assume is a person you have decided not to serve, and you usually make that decision without noticing you have made it.

I think about this every time somebody proposes a feature that needs a stable connection. Stable compared to what? Whose connection?

## The agents were the product

Here is the part almost everybody misses, and the part I would put first if I were teaching this.

M-Pesa's breakthrough was not software. It was a network of small shops, tens of thousands of them, where a human being turns cash into digital value and back again.

Think about what that solves. In an economy that runs on cash, digital money is useless unless you can get cash into it and out of it, near where you live, from somebody you can look in the eye. The agent is the on-ramp and the off-ramp. Without them the whole system is a database nobody can reach.

And it was mostly a logistics problem, not a technical one. Agent recruitment. Float management, making sure a shop has both enough cash and enough digital balance to serve whoever walks in. Training. Commissions structured so the work is really worth doing. Fraud controls on the agents themselves.

None of that is code. All of it was harder than the code.

I have seen several fintech products in this region that were technically stronger than M-Pesa and went nowhere, because they solved the ledger and treated cash-in and cash-out as somebody else's problem. There is no such thing as somebody else's problem when it is the only path your users have into your system.

## Trust was engineered, not requested

You are asking somebody to hand actual money to a stranger in a kiosk, in exchange for a number on a screen, in a country where losing that money would be devastating.

That trust did not come from a marketing campaign. It was built out of specific, boring mechanisms.

Every transaction sent an SMS confirmation to both parties, immediately. It arrived on the phone, it stayed there, and it did not depend on the platform being honest later because the person held their own record.

The brand behind it was Safaricom, a telco people already dealt with and already trusted with something they depended on.

The agent was a physical human in a shop with a sign, in a neighbourhood, who could be found again tomorrow. Recourse had a face and an address.

And the pricing was legible. Not hidden in a rate spread, not surfaced at the end. You knew what it cost before you sent.

Compare that to how most fintech products approach trust: a security page, a compliance badge, a paragraph about bank-grade encryption. None of that is a mechanism. A mechanism is something a suspicious person can check for themselves.

This is the thread that runs through everything I have built since. When I designed the verification system for [a property platform where the fraud is real and specific](/blog/building-spaceyako-verification), the question was never how to persuade people we were trustworthy. It was what a stranger could verify without taking our word for anything. That is a different design problem and it produces a different product.

## Regulators were brought in early, not fought

This is the piece founders skip and then get destroyed by.

Safaricom worked with the Central Bank of Kenya from the start. Not permissionless. Not asking forgiveness later. The regulator was in the room while the thing was being designed.

That sounds slow and unglamorous and it was probably the single largest reason M-Pesa still exists. A payments product that scales into millions of users and only then discovers it needed a licence does not get a stern letter. It gets shut down, usually at the exact moment it matters most.

There is a real argument that this cuts the other way, that early regulatory closeness entrenched an incumbent and made life harder for challengers afterwards. I think that argument has force. But it is an argument about competition policy, not about whether you personally should talk to your regulator before you move other people's money. You should.

## What it teaches you about building here now

**Design down to the constraint, not up from the ideal.** Ask what the least capable device and the worst connection in your target market look like, then build for that. Everything above that line is a bonus. Everything below it is a person excluded.

**Find the cash boundary and own it.** Digital money is only as useful as its edges. Whoever controls how value enters and leaves your system controls whether it is usable at all, and it is almost never the interesting engineering.

**Build trust out of things people can check.** A receipt they hold. A person they can find. A price they knew in advance. Assertions on a marketing page are not trust, they are a request for it.

**Talk to the regulator before you need to.** The cost of being early is a slower launch. The cost of being late is not existing.

**Solve a problem people are already working around.** M-Pesa did not create demand for moving money. That demand was being met by bus drivers and relatives and risk. The product replaced a workaround, and replacing a workaround is a fundamentally easier sell than creating a habit.

## Why this matters to me

I build web platforms in Kenya. Payment rails, editorial systems, marketplaces. And the temptation in this work is constant: to build the thing you would build in San Francisco, because that is what the tutorials assume, what the libraries default to, and what looks impressive to other engineers.

I have made that mistake in a way I can point at. I built a notification system with email, SMS and push, three columns inherited from a template, in a country where [almost everyone online is on WhatsApp every day](/blog/whatsapp-notifications-kenya). The code was good. The machine worked perfectly. It was reaching people somewhere they do not live.

M-Pesa is the standing correction to that instinct. The most consequential financial technology this continent has produced ran on text messages and a network of shopkeepers, and it worked because somebody looked hard at the actual conditions instead of importing an answer.

That is the discipline. Not lowering your standards. Pointing them at the right problem.
