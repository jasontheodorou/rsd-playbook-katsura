import type { Config } from 'payload'

import { env, oneOf } from './env'

/**
 * Background jobs seam. The queue itself is Payload's, stored in Postgres, on every host.
 * Only the trigger differs:
 *  - http:      something outside calls POST /api/jobs/run with the shared secret
 *               (a GitHub Actions schedule now; anything with cron later)
 *  - inprocess: the long-running server runs the queue itself on a timer
 */
export const jobsTriggers = ['http', 'inprocess'] as const
export type JobsTrigger = (typeof jobsTriggers)[number]

export const jobsTrigger = (): JobsTrigger => oneOf('JOBS_TRIGGER', jobsTriggers, 'http')
export const jobsRunSecret = (): string => env('JOBS_RUN_SECRET')

export const isAuthorisedJobsCaller = (headers: Headers): boolean => {
  const secret = jobsRunSecret()
  return secret !== '' && headers.get('authorization') === `Bearer ${secret}`
}

export const jobsConfig = (): NonNullable<Config['jobs']> => ({
  tasks: [],
  autoRun: jobsTrigger() === 'inprocess' ? [{ cron: '* * * * *', limit: 20, queue: 'default' }] : undefined,
  access: {
    // Payload's own /api/payload-jobs/run endpoint: the shared secret or a logged-in admin.
    run: ({ req }) => isAuthorisedJobsCaller(req.headers) || req.user?.role === 'admin',
  },
})
