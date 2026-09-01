---
title: "WordPress Core Web Vitals: Fixing LCP, INP and CLS at the Source"
metaTitle: "WordPress Core Web Vitals: Fix Guide"
slug: wordpress-performance-optimization
excerpt: "A site that took 43 seconds to load taught me that almost everything written about WordPress performance is a list of plugins. The actual work is finding which layer is lying to you."
date: "2024-12-20"
category: "Performance"
targetKeyword: "wordpress core web vitals optimization"
keywords:
  - "WordPress performance"
  - "Core Web Vitals"
  - "INP"
  - "LCP"
  - "caching"
  - "database optimization"
  - "page speed"
featured: false
---

The phone rang at 2am. The client was not calm.

I expected a 500, or a database that had fallen over. Instead the site was up. It was just taking 43 seconds to render the homepage. Forty-three seconds. Long enough to make coffee and come back and still be waiting.

Forty-seven plugins. No caching of any kind. Images straight off a phone camera at full resolution. A database that had never been cleaned in four years of daily publishing.

That night taught me more about performance than any article I had read, mostly because it taught me that almost everything written about WordPress performance is wrong in the same way. It hands you a list of plugins to install. The real work is figuring out which layer is lying to you, and no plugin can do that.

## Measure before you touch anything

I know. Nobody wants to hear this at 2am with a client on the phone. Do it anyway, because the alternative is spending a night optimising something that was never the problem.

The number you get from a synthetic test is not the number your users get. A test run from a fast connection in Virginia against a site whose audience is on 3G in Eldoret is measuring a different website. You need both, and they answer different questions.

Lab data, from Lighthouse or PageSpeed Insights, tells you what a page *can* do under controlled conditions. It is reproducible, which makes it useful for comparing before and after.

Field data, from the Chrome UX Report or your own real-user monitoring, tells you what a page *did* for actual visitors on actual devices. It is noisy and it is the truth.

When those two disagree, believe the field data and go find out why the lab is flattering you. Usually it is because the lab throttles a fast connection while your audience has an unreliable one, and unreliable is a different problem to slow.

That distinction is why I ended up building [a plugin](https://github.com/godwillcodes/WPSitePerformanceTracker) that collects both and stores them in the same place, rather than picking one. A synthetic audit and a real-user reporter answer questions you cannot answer from either alone.

## The three metrics, and what actually moves them

Core Web Vitals get treated as a single score to chase. They are three separate problems with almost nothing in common, and lumping them together is how people spend a week on the wrong one.

**LCP** asks when the biggest visible thing finished rendering. On a WordPress site it is almost always the hero image or the headline, and it is almost always slow for one of three reasons: the server took too long to send the HTML, the image is enormous, or a render-blocking stylesheet sat in front of it.

**INP** asks how long the page takes to respond when somebody interacts with it. This is the one that punishes plugin sprawl, because every plugin that binds a listener or runs on every page load is competing for the same main thread. A page can score beautifully on LCP and still feel broken to touch.

**CLS** asks how much the layout jumped around while loading. Images without dimensions, ads and embeds injected after paint, and fonts that swap and reflow the text.

The reason this matters practically: the fix for one is frequently irrelevant to the others. Adding a CDN helps LCP and does nothing for INP. Deferring JavaScript helps INP and can hurt CLS if it delays something that reserves space. Chasing "performance" as one number leads you to make changes that trade one metric for another and feel like progress.

## Caching is layered, and most sites cache one layer

When people say they added caching, they usually mean they installed one plugin. There are at least four distinct layers, and they fail independently.

Page caching stores the finished HTML so PHP never runs for most visitors. This is the single biggest win on a content site and the one most likely to be missing.

Object caching keeps the results of database queries in memory, via Redis or Memcached. This is what saves you when a page really has to be dynamic.

Opcode caching keeps compiled PHP in memory. Usually on by default now, worth checking, invisible when it is missing.

Browser caching tells the visitor's browser to keep static assets so a second visit does not refetch everything.

The failure I see most often is a site with page caching that is quietly not caching anything, because a plugin is setting a session cookie on every request and the cache is correctly refusing to serve a shared copy to what looks like a logged-in user. The plugin is installed. The dashboard says active. The cache hit rate is near zero and nobody is looking at the hit rate.

Check the hit rate. An installed cache and a working cache are different things, and only one of them shows up in a dashboard.

## The database gets fat quietly

WordPress keeps every revision of every post, forever, by default. A page edited two hundred times is two hundred rows. Multiply that across four years of publishing and the posts table stops fitting comfortably in memory.

Add expired transients that nothing cleans up, orphaned metadata from plugins that were deleted without removing their rows, and spam comments in the tens of thousands.

```php
// In wp-config.php. Caps revisions rather than disabling them, because
// somebody will eventually need to undo an edit and losing that is worse
// than the rows cost.
define('WP_POST_REVISIONS', 5);

// Empty the trash weekly instead of the default thirty days.
define('EMPTY_TRASH_DAYS', 7);
```

Cap it going forward first, then clean up what exists, and take a backup before the cleanup. This is destructive work and it is done on production, usually at speed, usually while someone is anxious. Deleting the wrong rows at 3am is a worse night than the one you are already having.

## Images are almost always the biggest single win

On most WordPress sites I have looked at, images are more than half the page weight, and on the worst ones they are almost all of it.

Serve modern formats. WebP is broadly supported now and typically saves a quarter to a third against a comparable JPEG. AVIF saves more where you can use it.

Serve the right size. WordPress generates multiple sizes and then themes routinely ignore them and load the full-resolution original into a 400 pixel container. The visitor downloads four megabytes to display something the size of a postcard.

Lazy load below the fold, and be careful not to lazy load the hero, because lazy loading your LCP element makes LCP worse, which is a really counterintuitive way to make a page slower with an optimisation.

Always set dimensions. An image without width and height is a layout shift waiting for the network.

The client from the 2am call had a 12MB hero image. One image. Fixing that alone took the load time from 43 seconds to about 12, before anything else was touched. It is not the interesting work but it is frequently the biggest number.

That problem annoyed me enough that I eventually built [a compressor that treats "smallest acceptable file" as a search problem](/blog/building-pixelpress) rather than a quality slider you guess at.

## Plugins are a performance budget you spend without noticing

Forty-seven plugins is not automatically bad. Forty-seven plugins that each add a stylesheet, a script and a database query to every page load is a site that cannot be fast no matter what you cache.

The honest audit is uncomfortable and worth doing. Deactivate everything, measure, then reactivate one at a time and measure again. Tedious, and it is the only way to find the one plugin costing you two seconds. Most teams skip it and install a caching plugin to paper over the plugin they should have removed.

Ask of each one whether it earns its cost, whether it loads on pages that do not use it, and whether the same job could be a few lines in the theme.

## What I would do first, in order

Cap revisions and empty the trash, because it takes two minutes and it stops the bleeding.

Fix the largest image on the most visited page, because it is usually the single biggest number.

Turn on page caching and then verify the hit rate rather than trusting the dashboard.

Audit plugins properly, one at a time, with measurements.

Then measure again in the field, not the lab, and see whether real people got a faster site.

The order matters because the first three are cheap and large, and the fourth is expensive and precise. Doing the expensive precise work first is how a performance project consumes a week and produces a graph nobody can feel.

And the thing I would tell the version of myself answering that phone at 2am: the site was not broken. It was neglected, in five separate places, each of which was somebody's reasonable decision at the time. Performance work is rarely one heroic fix. It is finding five ordinary compromises and undoing them in the right order.
