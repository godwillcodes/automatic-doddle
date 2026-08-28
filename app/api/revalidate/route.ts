import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Sanity webhook target. Publishing in Studio busts the `post` tag so the
 * statically generated blog picks up the change without a redeploy.
 *
 * Configure at sanity.io/manage with the same secret as SANITY_REVALIDATE_SECRET.
 */
export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      request,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    if (!body?._type) {
      return NextResponse.json({ error: 'Missing _type' }, { status: 400 })
    }

    revalidateTag('post', 'max')

    return NextResponse.json({ revalidated: true, type: body._type })
  } catch (error) {
    console.error('[revalidate] failed', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
