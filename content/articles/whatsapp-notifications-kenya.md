---
title: "We Were Emailing a Country That Lives on WhatsApp"
metaTitle: "WhatsApp Notifications for Kenyan Products"
slug: whatsapp-notifications-kenya
excerpt: "Saved-search alerts, price drops, viewing reminders: every notification the product was proudest of went out by email, in a market where almost everyone online is on WhatsApp every single day."
date: "2026-06-25"
category: "Product Engineering"
targetKeyword: "whatsapp notifications kenya"
keywords:
  - "WhatsApp Business API"
  - "notification channels Kenya"
  - "product localisation"
  - "message templates"
  - "emerging market product"
featured: false
---

The notification preferences table on [SpaceYako](https://www.spaceyako.com) had three columns: email, SMS, push.

I did not choose those three. Nobody sat down and asked which channels Kenyans actually use. They arrived the way most defaults arrive, inherited from a template, from every SaaS codebase any of us had worked in before, from an unexamined assumption about how people receive things.

And they were wrong in a way that took me embarrassingly long to see.

## The number that reframed it

Something like 96% of Kenyan internet users are on WhatsApp daily. The highest penetration on the continent.

Not "have installed". Daily.

Now look at what the product was sending. A saved search matches a new listing, which is the single most valuable moment in the entire product, the thing a person signed up for. We sent an email. A landlord drops the price on a flat somebody is watching. Email. A viewing is tomorrow morning and the agent needs them to show up. Email.

Every alert the product was proudest of went into an inbox, in a market where the inbox is not where people live.

I want to be precise about why this stung. It was not a performance problem. Delivery was fine, the emails rendered, the outbox retried properly, the whole pipeline worked exactly as designed. It was a correctness problem at a level above the code. We had built a good machine for reaching people somewhere they were not.

## The transport already existed

Here is the part that made it worse. WhatsApp was already in the codebase. The transport was written. The inbound webhook was handling replies.

Only the routing was missing. The notification system knew how to pick between email, SMS and push, and WhatsApp was simply not one of the options it could pick, because the preferences table had been shaped before anyone asked the question.

That is a familiar shape of mistake and I think it is worth naming. The hard technical work was done. The gap was in a data model written early, casually, by someone copying a pattern, and then never revisited, because it did not look like a decision. It looked like plumbing.

Data models encode assumptions about the world. This one encoded an assumption about which continent the users were on.

## Templates change how you write

Adding WhatsApp is not adding another `sendEmail`. Business messaging outside a live conversation window has to go out as a pre-approved template, submitted in advance and reviewed before you may send it.

That constraint frustrated me for about a day, and then I decided it had improved the product.

An email template is infinitely editable. You can pad it, add a header image, put three calls to action in it, and nobody stops you. Nobody ever reviews the fourteenth marketing email you added to the lifecycle. Templates make you commit up front to what a message is for, and something a reviewer will read makes you write the shortest honest version.

It also forced a distinction I should have drawn anyway. Some of what the product sent was information a person asked for, and some of it was us wanting attention. Only the first kind survives the question *would I be happy for a stranger to review this before I may send it*. The second kind mostly died, and the product is better for it.

## Preference has to mean per channel

The mistake I nearly made next was treating WhatsApp as an upgrade, silently routing everything there because it gets read.

Reach is not consent. Somebody who is happy to get a viewing reminder on WhatsApp may not want a weekly digest there, and the channel that gets opened fastest is the one where unwanted messages feel most invasive. An unwanted email is ignorable. An unwanted WhatsApp is somebody in your pocket.

So preference is stored per notification type per channel, not as one switch. It is more rows and more UI, and it is the only version that respects what a person actually agreed to.

The default matters as much as the model. Time-sensitive and requested things default to WhatsApp, because that is where they will be seen and the person asked for them. Everything else defaults off there, and has to be opted into.

## What I actually learned

The technical lesson is small. Add a channel, add an enum value, respect preferences per channel.

The real lesson is about where this bug lived. It was not in a function. It was in three column names in a schema, written months earlier by someone who was not thinking about Kenya, and inherited without question by me.

I now assume that any product I did not start from the market up carries defaults from somewhere else. Not just channels. Address formats that require a postcode. Names that assume a first and a last. Phone inputs that reject the local format. Payment flows that assume a card. Date pickers that start the week on Sunday. Each one is trivially fixable and each one quietly says *this was not built for you*, and users hear that even when they could not name it.

The audit worth running is not a code review. It is opening your own product on the device and the connection your users actually have, and asking, honestly, which parts of it were designed for somebody else.

Half the defaults in a web application are guesses about a person who does not exist in your market. Every one you fix is not localisation. It is the product finally being about the people using it.

For the general version of that constraint, applied to the network rather than the notification channel, there is [building for the connection people actually have](https://www.lockandmercer.com/notes/building-for-the-connection-people-actually-have).
