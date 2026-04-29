import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  if (hostname === 'food.maptosite.app') {
    const url = request.nextUrl.clone()
    if (url.pathname === '/') {
      url.pathname = '/food'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|sw.js|.*\\.json).*)'],
}
