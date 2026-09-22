import { NextResponse } from 'next/server'

import { LEARNER_COOKIE, decodeLearnerCookie, newLearnerId, setLearnerCookieHeader } from '@/learning/cookie'
import { ensureLearner, recordCompletion } from '@/learning/progress'
import { siteUrl } from '@/platform/site-url'

export const dynamic = 'force-dynamic'

const readBody = async (request: Request): Promise<{ pageId: string; action: string; returnTo: string; json: boolean }> => {
  const type = request.headers.get('content-type') ?? ''
  if (type.includes('application/json')) {
    const body = (await request.json()) as Record<string, unknown>
    return { pageId: String(body.pageId ?? ''), action: String(body.action ?? ''), returnTo: '', json: true }
  }
  const form = await request.formData()
  return {
    pageId: String(form.get('pageId') ?? ''),
    action: String(form.get('action') ?? ''),
    returnTo: String(form.get('returnTo') ?? '/'),
    json: false,
  }
}

const sameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin')
  if (!origin) return true // plain form posts from older browsers omit it
  return origin === siteUrl() || origin === new URL(request.url).origin
}

/** Records that the current learner completed (or un-completed) a page. Creates the learner if new. */
export const POST = async (request: Request) => {
  if (!sameOrigin(request)) return new Response('forbidden', { status: 403 })
  const { pageId, action, returnTo, json } = await readBody(request)
  if (!/^[a-z0-9\-\/]+$/i.test(pageId) || !['complete', 'uncomplete'].includes(action)) {
    return new Response('bad request', { status: 400 })
  }

  const cookieHeader = request.headers.get('cookie') ?? ''
  const existing = decodeLearnerCookie(cookieHeader.match(new RegExp(`${LEARNER_COOKIE}=([^;]+)`))?.[1])
  const learnerId = existing ?? newLearnerId()
  await ensureLearner(learnerId)
  await recordCompletion(learnerId, pageId, action === 'complete')

  const safeReturn = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'
  const response = json
    ? NextResponse.json({ ok: true, completed: action === 'complete' })
    : NextResponse.redirect(new URL(safeReturn, request.url), 303)
  if (!existing) response.headers.append('set-cookie', setLearnerCookieHeader(learnerId))
  return response
}
