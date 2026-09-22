import { oneOf } from '@/platform/env'

/**
 * Editorial auth seam.
 *  - local:          Payload email + password (now)
 *  - trusted-header: an upstream gate has already authenticated the person and forwards
 *                    their identity in a header, protected by a shared secret (later)
 *  - oidc:           the app validates a token from the company identity provider (later)
 * Roles always live in our users table, never derived from the identity provider.
 */
export const authModes = ['local', 'trusted-header', 'oidc'] as const
export type AuthMode = (typeof authModes)[number]
export const authMode = (): AuthMode => oneOf('AUTH_MODE', authModes, 'local')

/**
 * Reader access seam.
 *  - open:       anyone (local development)
 *  - passphrase: a shared passphrase sets a signed cookie (the Vercel period)
 *  - trusted:    the company gate sits upstream; the app trusts it (after migration)
 */
export const readerAccessModes = ['open', 'passphrase', 'trusted'] as const
export type ReaderAccessMode = (typeof readerAccessModes)[number]
export const readerAccess = (): ReaderAccessMode => oneOf('READER_ACCESS', readerAccessModes, 'open')
