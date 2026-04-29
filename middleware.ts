import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Strip port in case it's included (e.g., localhost:3000)
  const hostname = (request.headers.get('host') ?? request.nextUrl.hostname).split(':')[0]

  if (hostname === 'food.maptosite.app') {
    const url = request.nextUrl.clone()
    // Only rewrite the root — everything else (my-sites, preview, api, static files) passes through
    if (url.pathname === '/') {
      url.pathname = '/food'
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
