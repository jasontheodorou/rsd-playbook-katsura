import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

import { env, isProduction } from '@/platform/env'

/**
 * The anonymous learner cookie: an opaque id, signed so it cannot be forged. Separate secret from
 * Payload's, because rotating it orphans every anonymous learner and that must be a deliberate act.
 */
export const LEARNER_COOKIE = 'katsura_learner'
const ONE_YEAR = 60 * 60 * 24 * 365

const secret = (): string => {
  const value = env('LEARNER_COOKIE_SECRET')
  if (!value) throw new Error('LEARNER_COOKIE_SECRET is not set')
  return value
}

const sign = (id: string): string => createHmac('sha256', secret()).update(id).digest('base64url')

export const newLearnerId = (): string => randomUUID()

export const encodeLearnerCookie = (id: string): string => `${id}.${sign(id)}`

/** Returns the learner id if the cookie is present and its signature checks out, else null. */
export const decodeLearnerCookie = (value: string | undefined): string | null => {
  if (!value) return null
  const dot = value.lastIndexOf('.')
  if (dot <= 0) return null
  const id = value.slice(0, dot)
  const given = Buffer.from(value.slice(dot + 1))
  const expected = Buffer.from(sign(id))
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  return id
}

const attrs = (maxAge: number): string =>
  [`Path=/`, `Max-Age=${maxAge}`, 'HttpOnly', 'SameSite=Lax', isProduction() ? 'Secure' : '']
    .filter(Boolean)
    .join('; ')

export const setLearnerCookieHeader = (id: string): string =>
  `${LEARNER_COOKIE}=${encodeLearnerCookie(id)}; ${attrs(ONE_YEAR)}`

export const clearLearnerCookieHeader = (): string => `${LEARNER_COOKIE}=; ${attrs(0)}`
