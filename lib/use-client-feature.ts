'use client'

import { useSyncExternalStore } from 'react'

/** Capabilities never change during a session, so nothing needs to subscribe. */
const noopSubscribe = () => () => {}

/**
 * Returns `false` during server render and the first client render, then the
 * real value. Using useSyncExternalStore rather than useState + useEffect keeps
 * hydration consistent without triggering a cascading render.
 */
export function useClientFeature(check: () => boolean): boolean {
  return useSyncExternalStore(noopSubscribe, check, () => false)
}
