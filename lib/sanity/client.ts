import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'

import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * Token-free client. Safe to import from anywhere, including code that ends up
 * in the browser bundle — it is only used to build image URLs, which are
 * public on the Sanity CDN regardless of dataset visibility.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

const builder = createImageUrlBuilder(client)

export function urlForImage(source: Image) {
  return builder.image(source).auto('format').fit('max')
}

/** 1200x630 social card derived from the cover image's hotspot. */
export function urlForOpenGraph(source: Image) {
  return builder.image(source).width(1200).height(630).fit('crop').auto('format').url()
}
