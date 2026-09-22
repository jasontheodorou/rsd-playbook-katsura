import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/** Readiness check: the app is up and can reach its database. Used by compose and CI. */
export const GET = async () => {
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users', overrideAccess: true })
    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : 'unknown' }, { status: 503 })
  }
}
