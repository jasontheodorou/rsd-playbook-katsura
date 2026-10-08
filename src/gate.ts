/**
 * One shared password in front of the whole site, for the preview on Vercel (Jason, 8 October 2026).
 * The repository is public, so only a hash of a hash is kept here. Signing in sets a cookie holding
 * sha256('katsura-gate:' + password); the gate lets a request through when the sha256 of that cookie
 * matches GATE_HASH. Neither the password nor a working cookie can be read from this file.
 * Uses Web Crypto so it runs in the proxy on any runtime.
 */
export const GATE_COOKIE = 'katsura_gate'
const GATE_HASH = '5e9b933fcb0ea66346a7596870d4bd64a6298efea2fc9cc103721162710ae7e2'

const sha256 = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** The cookie value for a password, or null if the password is wrong. */
export const tokenFor = async (password: string): Promise<string | null> => {
  const token = await sha256(`katsura-gate:${password}`)
  return (await sha256(token)) === GATE_HASH ? token : null
}

export const isValidToken = async (token: string | undefined): Promise<boolean> =>
  Boolean(token) && (await sha256(token as string)) === GATE_HASH

/** The gate is off in `next dev`, so local work needs no password. */
export const gateOn = (): boolean => process.env.NODE_ENV !== 'development'
