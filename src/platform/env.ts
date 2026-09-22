/** Small helpers so every seam reads the environment the same way. */

export const env = (name: string, fallback = ''): string => process.env[name] ?? fallback

export const oneOf = <T extends string>(name: string, allowed: readonly T[], fallback: T): T => {
  const value = process.env[name]
  if (value === undefined || value === '') return fallback
  if ((allowed as readonly string[]).includes(value)) return value as T
  throw new Error(`${name} must be one of ${allowed.join(', ')}; got "${value}"`)
}

export const isProduction = (): boolean => process.env.NODE_ENV === 'production'
