import { env } from './env'

/**
 * Database seam. Plain Postgres over the standard `pg` driver.
 * Runtime uses the pooled string; migrations use the direct string (Neon needs this; on a
 * single self-hosted Postgres they are the same value).
 */
export const databaseUrl = (): string => env('DATABASE_URL')
export const databaseMigrateUrl = (): string => env('DATABASE_MIGRATE_URL', databaseUrl())
export const databasePoolMax = (): number => Number(env('DATABASE_POOL_MAX', '5'))
