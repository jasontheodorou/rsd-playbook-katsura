import { env } from './env'

/** Absolute origin of this deployment. Set explicitly; never read from a host's own variables. */
export const siteUrl = (): string =>
  env('SITE_URL', `http://localhost:${env('PORT', '3019')}`).replace(/\/$/, '')
