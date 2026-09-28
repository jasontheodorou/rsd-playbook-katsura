'use client'

import { useSyncExternalStore } from 'react'

/**
 * A prompt shown until the reader has used a pattern once (a pulse on a diagram tile, a "Hover to
 * expand" hint), then never again, on any copy of the pattern or on a later visit. Remembered in
 * the browser under `key`; if storage is blocked it is remembered for this visit only. Mark it
 * from an effect, never inside a state update: every copy on the page re-renders when it flips.
 */
export function createOnce(key: string) {
  const listeners = new Set<() => void>()
  let used: boolean | null = null
  const read = () => {
    if (used === null) {
      try {
        used = localStorage.getItem(key) === '1'
      } catch {
        used = false
      }
    }
    return used
  }
  const mark = () => {
    if (read()) return
    used = true
    try {
      localStorage.setItem(key, '1')
    } catch {
      // Storage can be blocked; the prompt then stays hidden for this visit only.
    }
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }
  // On the server, and in the first render, treat it as used, so no prompt flashes before the
  // browser's memory is read.
  const useUsed = () => useSyncExternalStore(subscribe, read, () => true)
  return { useUsed, mark }
}
