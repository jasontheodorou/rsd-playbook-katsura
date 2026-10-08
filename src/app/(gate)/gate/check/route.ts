import { NextResponse } from 'next/server'

import { GATE_COOKIE, tokenFor } from '@/gate'

export const dynamic = 'force-dynamic'

/** Checks the password and, if right, sets the gate cookie for 30 days. */
export const POST = async (request: Request) => {
  const form = await request.formData()
  const next = String(form.get('next') ?? '/')
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const token = await tokenFor(String(form.get('password') ?? ''))
  if (!token) {
    const back = new URL('/gate', request.url)
    back.searchParams.set('wrong', '1')
    if (safeNext !== '/') back.searchParams.set('next', safeNext)
    return NextResponse.redirect(back, 303)
  }
  const response = NextResponse.redirect(new URL(safeNext, request.url), 303)
  response.cookies.set(GATE_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}
