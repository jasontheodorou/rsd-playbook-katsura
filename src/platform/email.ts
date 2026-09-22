import type { Config } from 'payload'

import { oneOf } from './env'

/**
 * Email seam. `log` means no email service at all: Payload logs the message and publish
 * requests are shown as a list in the admin. `smtp` (employer relay) and `resend` are wired
 * when needed by adding the matching Payload adapter here and nowhere else.
 */
export const emailDrivers = ['log', 'smtp', 'resend'] as const
export type EmailDriver = (typeof emailDrivers)[number]

export const emailDriver = (): EmailDriver => oneOf('EMAIL_DRIVER', emailDrivers, 'log')

export const emailAdapter = (): Config['email'] => {
  const driver = emailDriver()
  if (driver === 'log') return undefined
  throw new Error(`EMAIL_DRIVER=${driver} is not wired yet. See docs/PORTABILITY.md.`)
}
