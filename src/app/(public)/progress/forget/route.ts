import { NextResponse } from 'next/server'

import { LEARNER_COOKIE, clearLearnerCookieHeader, decodeLearnerCookie } from '@/learning/cookie'
import { forgetLearner } from '@/learning/progress'

export const dynamic = 'force-dynamic'

/** Deletes everything stored about the current learner and clears the cookie. */
export const POST = async (request: Request) => {
  const form = await request.formData().catch(() => null)
  const returnTo = String(form?.get('returnTo') ?? '/')
  const cookieHeader = request.headers.get('cookie') ?? ''
  const learnerId = decodeLearnerCookie(cookieHeader.match(new RegExp(`${LEARNER_COOKIE}=([^;]+)`))?.[1])
  if (learnerId) await forgetLearner(learnerId)
  const safeReturn = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'
  const response = NextResponse.redirect(new URL(safeReturn, request.url), 303)
  response.headers.append('set-cookie', clearLearnerCookieHeader())
  return response
}
