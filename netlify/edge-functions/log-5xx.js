export default async (request, context) => {
  const start = Date.now()
  let response
  try {
    response = await context.next()
  } catch (err) {
    // If upstream threw before producing a response, log and rethrow
    console.error('[EDGE][5xx] Upstream threw', {
      url: request.url,
      method: request.method,
      error: String(err?.message || err),
    })
    throw err
  }

  const durationMs = Date.now() - start
  if (response && response.status >= 500) {
    console.error('[EDGE][5xx] Response error', {
      url: request.url,
      method: request.method,
      status: response.status,
      durationMs,
    })
  }

  return response
}


