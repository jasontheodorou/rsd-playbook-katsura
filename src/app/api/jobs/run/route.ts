import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { isAuthorisedJobsCaller } from '@/platform/jobs'

export const dynamic = 'force-dynamic'

/**
 * Runs queued background jobs. Called by an external scheduler when JOBS_TRIGGER=http.
 * Portable: the caller can be GitHub Actions, cron, or anything else that can send a request.
 */
export const POST = async (request: Request) => {
  if (!isAuthorisedJobsCaller(request.headers)) {
    return new Response('unauthorised', { status: 401 })
  }
  const payload = await getPayload({ config })
  // Payload only creates its jobs collection once a task or workflow is registered (build step 3).
  if (!('payload-jobs' in payload.collections)) {
    return Response.json({ ok: true, ran: 0, note: 'no job types registered yet' })
  }
  const req = await createLocalReq({}, payload)
  const result = await payload.jobs.run({ limit: 20, overrideAccess: true, req })
  return Response.json({ ok: true, ...result })
}

export const GET = POST
