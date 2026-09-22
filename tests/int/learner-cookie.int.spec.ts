import { describe, expect, it } from 'vitest'

import { decodeLearnerCookie, encodeLearnerCookie, newLearnerId } from '@/learning/cookie'

describe('learner cookie', () => {
  it('round-trips a signed id', () => {
    process.env.LEARNER_COOKIE_SECRET = 'test-secret'
    const id = newLearnerId()
    expect(decodeLearnerCookie(encodeLearnerCookie(id))).toBe(id)
  })

  it('rejects a tampered or unsigned value', () => {
    process.env.LEARNER_COOKIE_SECRET = 'test-secret'
    const id = newLearnerId()
    const signed = encodeLearnerCookie(id)
    expect(decodeLearnerCookie(signed.slice(0, -2) + 'xx')).toBeNull()
    expect(decodeLearnerCookie(id)).toBeNull()
    expect(decodeLearnerCookie(undefined)).toBeNull()
  })
})
