import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * The dataset provisioned by the Vercel integration is private, and an
 * unauthenticated read against a private dataset returns an empty result set
 * rather than an error. Without this token every query silently yields zero
 * rows and the blog builds with no articles in it.
 */
const token = process.env.SANITY_API_READ_TOKEN

if (!token && process.env.NODE_ENV === 'production') {
  throw new Error(
    'SANITY_API_READ_TOKEN is required to read the private dataset. ' +
      'Run `vercel env pull` or check the Sanity integration in the Vercel dashboard.'
  )
}

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  // The CDN cannot serve authenticated reads, and content is cached by tag
  // on our side anyway.
  useCdn: false,
  perspective: 'published',
})
