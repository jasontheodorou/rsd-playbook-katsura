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

/*
 * Prompt memory (30 September 2026). A component's prompt (its speech bubble and pulses) shows
 * until the reader first uses that component on that page, and then never again on that page,
 * on any later visit. Each page and component is remembered on its own, under
 * `katsura:prompted:<page path>:<component>`. Opening any page with `?reset-prompts` in its
 * address forgets them all, so a reviewer can see the prompts again. If storage is blocked, a
 * prompt is remembered for this visit only.
 */
const PREFIX = 'katsura:prompted:'
const memory = new Map<string, boolean>()
const promptListeners = new Set<() => void>()
let resetChecked = false

function resetIfAsked() {
  if (resetChecked) return
  resetChecked = true
  try {
    if (!new URLSearchParams(window.location.search).has('reset-prompts')) return
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i)
      if (k?.startsWith(PREFIX)) localStorage.removeItem(k)
    }
  } catch {
    // Storage can be blocked; there is then nothing to forget.
  }
}

function promptKey(name: string) {
  return `${PREFIX}${window.location.pathname}:${name}`
}

function readPrompted(name: string) {
  resetIfAsked()
  const key = promptKey(name)
  if (!memory.has(key)) {
    let v = false
    try {
      v = localStorage.getItem(key) === '1'
    } catch {
      v = false
    }
    memory.set(key, v)
  }
  return memory.get(key) as boolean
}

function subscribePrompted(l: () => void) {
  promptListeners.add(l)
  return () => {
    promptListeners.delete(l)
  }
}

/**
 * Whether this page's `name` component has been used before, and a function to remember that it
 * has. Call `remember` from an event handler. On the server, and in the first render, it counts
 * as used, so no prompt flashes before the browser's memory is read.
 */
export function usePromptMemory(name: string): [boolean, () => void] {
  const used = useSyncExternalStore(
    subscribePrompted,
    () => readPrompted(name),
    () => true,
  )
  const remember = () => {
    const key = promptKey(name)
    if (memory.get(key)) return
    memory.set(key, true)
    try {
      localStorage.setItem(key, '1')
    } catch {
      // Storage can be blocked; the prompt then stays hidden for this visit only.
    }
    promptListeners.forEach((l) => l())
  }
  return [used, remember]
}
