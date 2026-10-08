import { createHmac, timingSafeEqual } from 'node:crypto'

import { env, isProduction, oneOf } from '@/platform/env'

/**
 * Progress store seam.
 *  - database: completions are events in Postgres, keyed by the anonymous learner cookie
 *  - cookie:   completions live in a signed cookie on the reader's device; no database needed.
 *              Used while the site is hosted as front end only.
 */
export const progressStores = ['database', 'cookie'] as const
export type ProgressStore = (typeof progressStores)[number]

// With no database configured, fall back to the cookie so the front end runs with no settings at all.
export const progressStore = (): ProgressStore =>
  oneOf('PROGRESS_STORE', progressStores, env('DATABASE_URL') ? 'database' : 'cookie')

export const PROGRESS_COOKIE = 'katsura_progress'
const ONE_YEAR = 60 * 60 * 24 * 365

const sign = (value: string): string => {
  // Built-in fallback for the settings-free preview (Jason, 8 October 2026). It is public, so a
  // reader could forge their own ticks; that only changes what their own browser shows.
  const secret = env('LEARNER_COOKIE_SECRET', 'katsura-front-end-preview')
  return createHmac('sha256', secret).update(value).digest('base64url')
}

/** Completed page ids from the cookie, or an empty set if it is missing or has been tampered with. */
export const decodeProgressCookie = (value: string | undefined): Set<string> => {
  if (!value) return new Set()
  const dot = value.lastIndexOf('.')
  if (dot <= 0) return new Set()
  const body = value.slice(0, dot)
  const given = Buffer.from(value.slice(dot + 1))
  const expected = Buffer.from(sign(body))
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return new Set()
  return new Set(Buffer.from(body, 'base64url').toString('utf8').split('|').filter(Boolean))
}

const attrs = (maxAge: number): string =>
  [`Path=/`, `Max-Age=${maxAge}`, 'HttpOnly', 'SameSite=Lax', isProduction() ? 'Secure' : '']
    .filter(Boolean)
    .join('; ')

export const setProgressCookieHeader = (completed: Set<string>): string => {
  const body = Buffer.from([...completed].sort().join('|'), 'utf8').toString('base64url')
  return `${PROGRESS_COOKIE}=${body}.${sign(body)}; ${attrs(ONE_YEAR)}`
}

export const clearProgressCookieHeader = (): string => `${PROGRESS_COOKIE}=; ${attrs(0)}`

export const readProgressFromHeader = (cookieHeader: string): Set<string> =>
  decodeProgressCookie(cookieHeader.match(new RegExp(`${PROGRESS_COOKIE}=([^;]+)`))?.[1])
