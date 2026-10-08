import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { GATE_COOKIE, gateOn, isValidToken } from './gate'

/** Sends anyone without the password cookie to the password screen. */
export async function proxy(request: NextRequest) {
  if (!gateOn()) return NextResponse.next()
  if (await isValidToken(request.cookies.get(GATE_COOKIE)?.value)) return NextResponse.next()
  const { pathname, search } = request.nextUrl
  const url = new URL('/gate', request.url)
  if (pathname !== '/') url.searchParams.set('next', pathname + search)
  return NextResponse.redirect(url)
}

export const config = {
  // Everything except the password screen itself and Next's own files. Photos stay behind the gate.
  matcher: ['/((?!gate|_next/static|_next/image|favicon.ico).*)'],
}
