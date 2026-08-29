---
title: "Building PixelPress: Client-Side Image Compression with Next.js and Sharp"
metaTitle: "Building PixelPress: Image Compression in Next.js"
slug: building-pixelpress
excerpt: "A 12MB hero image on a client's homepage sent me down a two-week hole. The result treats smallest acceptable file as a search problem instead of a quality slider you guess at."
date: "2024-12-21"
category: "Engineering"
targetKeyword: "nextjs image compression sharp"
keywords:
  - "Next.js"
  - "Sharp"
  - "image compression"
  - "WebP"
  - "AVIF"
  - "web performance"
  - "image optimization"
featured: false
---

Somebody uploaded a 12MB photograph to a homepage because it looked good on their monitor. The site went from usable to unusable, and I spent an evening explaining to a client why their brand-new website was slower than the one it replaced.

What bothered me afterwards was not the image. It was that the tools I reached for to fix it all asked me the same useless question: what quality setting do you want?

I do not want a quality setting. Nobody has ever wanted a quality setting. What I want is the smallest file this picture can survive being. The quality number is a knob I have to guess at repeatedly until I stop being able to see the damage, which is a search I was performing by hand, badly, several times a week.

So I built the thing that does the search.

## The actual problem with a quality slider

Sharp exposes quality as a number from 1 to 100. It is not a percentage of anything meaningful. The relationship between that number and the resulting file size depends entirely on the image.

A photograph of a busy street has detail everywhere and compresses reluctantly. A product shot on a white background is mostly flat and collapses to almost nothing. Quality 70 on one might be 400KB and on the other 40KB. There is no setting you can pick in advance that is right for both.

So what actually happens in practice is a manual loop. Export at 80. Look at it. Too big. Export at 60. Look at it. Now the sky has banding. Export at 70. Repeat.

That is a search algorithm being executed by a human with their eyes, and humans are slow at it and inconsistent between sessions. The insight, such as it is: if you can state the target as a size rather than a quality, the machine can do the search properly.

## Binary search over quality

Given a target size, the search is straightforward. Encode at the midpoint, check the result, and halve the interval in whichever direction the answer was wrong.

```typescript
/**
 * Search the quality range for the smallest encode that still lands within
 * tolerance of the target. Bounded iterations because encoding is the
 * expensive part and the last few bytes are never worth another pass.
 */
async function findQuality(
  input: Buffer,
  targetBytes: number,
  { tolerance = 0.05, maxIterations = 8 } = {}
) {
  let low = 1
  let high = 100
  let best: { quality: number; output: Buffer } | null = null

  for (let i = 0; i < maxIterations; i += 1) {
    const quality = Math.round((low + high) / 2)
    const output = await sharp(input).webp({ quality }).toBuffer()

    // Track the largest encode that still fits, since bigger is better
    // quality among the candidates that satisfy the constraint.
    if (output.length <= targetBytes) {
      if (!best || quality > best.quality) best = { quality, output }
      // Close enough that another iteration cannot meaningfully help.
      if (output.length >= targetBytes * (1 - tolerance)) break
      low = quality + 1
    } else {
      high = quality - 1
    }

    if (low > high) break
  }

  return best
}
```

Two details in there that took me longer than they should have.

The tolerance exists because without it the search runs its full iteration budget grinding after a few hundred bytes that nobody will ever perceive. Encoding is not free, and eight passes over a large photograph is real time.

Tracking the *largest* passing quality rather than the last one matters because binary search does not visit candidates in order. Without keeping the best-so-far you can finish holding a worse encode than one you already found and discarded.

## When quality alone cannot get there

Sometimes the target is simply unreachable. A 4000 pixel wide photograph cannot become 50KB at any quality that leaves it looking like a photograph. It becomes a smear.

The honest answer is that the image is too big in dimensions, not too rich in detail. So when the search bottoms out and still overshoots, the fallback is to scale down and search again.

This is the part where I had to decide what the tool is allowed to do without asking. Silently resizing somebody's image is a real liberty. What I settled on is that it will scale progressively, it reports exactly what it did, and there is a ceiling below which it refuses and tells you the target is not achievable rather than handing back something unusable.

A tool that quietly destroys your image to satisfy a number you typed is worse than a tool that says no.

## Running in the browser was the point

The decision I am most sure about is that compression happens client-side, in the browser, and the image never leaves the machine.

Partly that is privacy. Plenty of what people compress is not public: screenshots with customer data, photographs of documents, product shots under embargo. Every online compressor asks you to upload those to somebody else's server, and most people click through that without thinking about it. I did not want to be another one of those.

Partly it is cost. Server-side compression means paying for compute proportional to usage, which means either a bill that grows with success or a rate limit that makes the tool annoying. Browser compression scales with the number of users' own machines, which is free and, as it turns out, fast, because a modern laptop encodes an image quickly.

The trade is that you are constrained to what the browser can do, and that you have to be careful about blocking the main thread. Compression runs off the main thread, so the interface stays responsive while it works, which matters more than it sounds when a search runs eight encodes over a large file.

## Format choice matters more than the setting

Before tuning anything, the biggest single win is usually just picking a better format.

WebP is supported essentially everywhere now and typically saves a quarter to a third against a comparable JPEG at visually equivalent quality. AVIF saves more again, at meaningfully higher encode cost.

The rule I ended up with: default to WebP because the compatibility question is settled and the encode is quick, offer AVIF where the file is large enough that the extra encode time buys something real, and keep the original when the output would be larger, which happens more often than you would think with small or already-optimised images.

Producing a bigger file than you were given is the one outcome a compression tool must never do quietly.

## What I would tell somebody building a similar tool

**Let people state the outcome, not the knob.** Target size is a thing a person actually wants. Quality 73 is not.

**Make the search cheap enough to be worth running.** Tolerance and a bounded iteration count are the difference between a tool that feels instant and one people stop using.

**Never silently do something destructive.** Resize if you must, then say so, and refuse when the request cannot be met honestly.

**Never hand back something worse than you were given.** Check the output against the input and keep the original if you lost.

The thing has been quietly useful to me since, mostly in exactly the situation that caused it. Somebody sends me a folder of photographs for a site, every one straight off a camera, and instead of an evening of manual export loops it is a drag and a wait.

That is a small win. It is also two weeks of my life, prompted by one 12MB hero image and a client asking a reasonable question about why their site was slow. Most of the tools I have built started that way: not from an idea, from being annoyed at the same thing for the third time.
