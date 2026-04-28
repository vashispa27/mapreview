const CACHE = 'maptosite-console-v1'

// Static shell assets to pre-cache
const PRECACHE = ['/icon.svg', '/apple-icon.png', '/placeholder-user.jpg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Only handle same-origin GETs
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // API routes: network-only (member data must always be fresh)
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(request))
    return
  }

  // Next.js internals: pass through
  if (url.pathname.startsWith('/_next/')) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached
          return fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone())
            return res
          })
        })
      )
    )
    return
  }

  // Navigation (HTML pages): network-first, fall back to cache
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(request, clone))
          return res
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Everything else: stale-while-revalidate
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const network = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone())
          return res
        })
        return cached ?? network
      })
    )
  )
})
