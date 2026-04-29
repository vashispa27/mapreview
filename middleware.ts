import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Strip port in case it's included (e.g., localhost:3000)
  const hostname = (request.headers.get('host') ?? request.nextUrl.hostname).split(':')[0]

  if (hostname === 'food.maptosite.app') {
    const url = request.nextUrl.clone()
    // Rewrite root and any path that hasn't already been routed to /food
    if (!url.pathname.startsWith('/food')) {
      url.pathname = '/food' + (url.pathname === '/' ? '' : url.pathname)
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|apple-icon\\.png|sw\\.js|.*\\.json|api/).*)',
  ],
}
