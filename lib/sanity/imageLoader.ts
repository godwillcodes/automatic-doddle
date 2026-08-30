/**
 * Global next/image loader (wired via images.loaderFile in next.config.ts).
 *
 * WHY THIS EXISTS: without it, an article figure pays for optimization twice.
 * urlForImage asks Sanity's CDN to resize and format-negotiate (auto=format),
 * and next/image then runs that finished image through Vercel's optimizer
 * again — one billable transformation per responsive width, per figure,
 * against the team's shared 5K/month allowance. That exact pattern burned 75%
 * of the allowance on Business Report before its loader landed; this is the
 * same fix, ported before the first figure ships rather than after the bill.
 *
 * Sanity images resolve DIRECTLY to cdn.sanity.io, sized per srcset entry by
 * rescaling the URL's own w/h pair so any crop an editor set keeps its frame.
 * Sanity does not meter transformations; its CDN caches each variant.
 *
 * Everything else — the /photographs strip, any static file — keeps Vercel's
 * optimizer by reproducing the default loader's URL shape. A loaderFile
 * replaces the default for ALL images, so the fallback has to be explicit.
 */

const SANITY_HOST = 'cdn.sanity.io'

/**
 * The config declares no images.qualities, so the optimizer accepts only
 * Next's default of 75 and answers anything else with a 400. Pinning the
 * fallback to 75 keeps a future quality={90} prop from blanking an image the
 * way the Business Report masthead once blanked.
 */
const VERCEL_QUALITY = 75

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  let url: URL | null = null
  try {
    url = new URL(src)
  } catch {
    url = null // relative src — a file in /public
  }

  if (url && url.hostname === SANITY_HOST) {
    const w0 = Number(url.searchParams.get('w'))
    const h0 = Number(url.searchParams.get('h'))
    url.searchParams.set('w', String(width))
    // Rescale the height with the width so fit=crop keeps the same frame.
    if (w0 > 0 && h0 > 0) url.searchParams.set('h', String(Math.round((h0 * width) / w0)))
    url.searchParams.set('q', String(quality ?? 75))
    url.searchParams.set('auto', 'format')
    return url.toString()
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${VERCEL_QUALITY}`
}
