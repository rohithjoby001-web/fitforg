// fitforg service worker — minimal offline-first caching
// Strategy:
//   1. Precache the app shell (HTML, manifest, icons)
//   2. For navigations: network-first, fall back to cache when offline
//   3. For static assets: stale-while-revalidate (instant from cache, refresh in background)
//   4. For everything else: try network, fall back to cache

const VERSION = 'fitforg-v1.0.0'
const APP_SHELL_CACHE = `${VERSION}-shell`
const ASSET_CACHE = `${VERSION}-assets`

// Files to precache on install — the bare minimum to boot offline
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/fitforg-logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
]

// Install — precache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE)
      // Use individual adds so one failure doesn't abort all
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }))
          } catch (err) {
            console.warn(`[SW] Failed to precache ${url}:`, err.message)
          }
        })
      )
      // Activate immediately so the SW takes control on first load
      await self.skipWaiting()
    })()
  )
})

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      )
      await self.clients.claim()
    })()
  )
})

// Helper: stale-while-revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const fetchPromise = fetch(request)
    .then((response) => {
      // Only cache successful, basic (non-opaque) responses
      if (response && response.status === 200 && response.type === 'basic') {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)
  return cached || fetchPromise
}

// Helper: network-first with cache fallback (for navigations)
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(APP_SHELL_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    // Offline — try cache, then fall back to root
    const cache = await caches.open(APP_SHELL_CACHE)
    const cached = await cache.match(request)
    if (cached) return cached
    return cache.match('/')
  }
}

// Fetch handler — route by request type
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip cross-origin requests (let them hit the network normally)
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Skip Next.js dev-only HMR + RSC requests
  if (url.pathname.startsWith('/_next/webpack-hmr')) return
  if (request.headers.get('purpose') === 'preflight') return

  // Navigations (HTML page loads) → network-first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets (JS/CSS/images/fonts from /_next/) → stale-while-revalidate
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/icon-') || url.pathname.startsWith('/favicon-')) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE))
    return
  }

  // Manifest + logo + other same-origin GETs → stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, APP_SHELL_CACHE))
})

// Listen for messages from the page (e.g. "SKIP_WAITING" from update UI)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
