'use client'

import { useSyncExternalStore } from 'react'

/*
 * Shape your practice progress, kept in this browser for the demo (the plan's open question 2 asks
 * whether server-side progress comes later). One set of finished card ids per course, shared by
 * the landing page and the course pages, so both stay in step.
 */
const KEY = (slug: string) => `katsura:practice:${slug}`
const listeners = new Set<() => void>()
const cache = new Map<string, { raw: string | null; set: Set<number> }>()
const EMPTY = new Set<number>()

function read(slug: string): Set<number> {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY(slug))
  } catch {
    // Storage unavailable: nothing is remembered.
  }
  const hit = cache.get(slug)
  if (hit && hit.raw === raw) return hit.set
  let set = new Set<number>()
  try {
    set = new Set(JSON.parse(raw ?? '[]') as number[])
  } catch {
    // A damaged value starts afresh.
  }
  cache.set(slug, { raw, set })
  return set
}

export function setDone(slug: string, n: number, done: boolean) {
  const next = new Set(read(slug))
  if (done) next.add(n)
  else next.delete(n)
  try {
    localStorage.setItem(KEY(slug), JSON.stringify([...next].sort((a, b) => a - b)))
  } catch {
    // Storage unavailable: the change lasts for this view only.
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  const onStorage = () => l()
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

/** The finished cards of one course, in this browser. Empty on the server. */
export function useDone(slug: string): Set<number> {
  return useSyncExternalStore(
    subscribe,
    () => read(slug),
    () => EMPTY,
  )
}

/** True once the page is running in the browser, so a component can swap its plain, no-JavaScript render for its interactive one. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

/** The finished cards of several courses at once, for the landing page. */
export function useDoneMap(slugs: string[]): Record<string, Set<number>> {
  const key = useSyncExternalStore(
    subscribe,
    () => slugs.map((s) => `${s}:${[...read(s)].join(',')}`).join('|'),
    () => '',
  )
  const out: Record<string, Set<number>> = {}
  for (const part of key ? key.split('|') : []) {
    const [slug, list] = part.split(':')
    out[slug] = new Set(list ? list.split(',').map(Number) : [])
  }
  return out
}
