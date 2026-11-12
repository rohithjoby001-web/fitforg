// Fitforg service worker — offline-first cache for the app shell + videos,
// and the workout notifications (rest timer in the notification panel).
const CACHE = 'fitforg-v3'

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './badge-96.png']))
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  // Don't intercept cross-origin requests (Google Fonts, etc.) — let them go to network.
  if (url.origin !== self.location.origin) return

  // For videos: cache-first (they're large and stable), fall back to network.
  // For everything else: network-first (so updates land quickly), fall back to cache.
  if (url.pathname.startsWith('/videos/')) {
    e.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(req, clone))
          }
          return res
        }).catch(() => cached)
      )
    )
    return
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(req, clone))
          }
          return res
        })
        .catch(() => cached)
      return cached || fetchPromise
    })
  )
})

// ================= workout notifications =================
// The app (src/notify.js) posts what the workout is doing whenever you switch away from it:
//   {type:'ff-show', kind:'rest'|'trans'|'hold'|'idle', end, name, label, p15}  or  {type:'ff-clear'}
// rest / trans (warm-up done) / hold: a live countdown, then an alert when it reaches zero.
// idle: a quiet "Workout in progress" line.
// Chrome keeps a worker alive for one message for up to 5 minutes, which covers every rest in the
// app; anything longer falls back to a fixed "ends at" line.

const TAG = 'ff-workout'
const ICON = './icon-192.png'
const BADGE = './badge-96.png'   // white-on-transparent mark for the Android status bar
const MAX_TICK_MS = 4.5 * 60 * 1000

let run = 0      // id of the countdown that is allowed to keep ticking
let T = null     // the running timer: {kind, end, name, label, p15, quiet}

const mmss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clock = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })

function show(title, o) {
  return self.registration.showNotification(title, Object.assign({ tag: TAG, icon: ICON, badge: BADGE }, o))
}

function countdown(t, left, stuck) {
  const k = t.kind
  const title = k === 'hold' ? t.name + ' · ' + mmss(left)
    : (k === 'trans' ? 'Warm-up done · ' : 'Rest · ') + mmss(left)
  const next = k === 'hold' ? t.label + ' · keep going'
    : (k === 'trans' ? 'First up: ' : 'Up next: ') + t.name + ' · ' + t.label
  const actions = k === 'hold' ? [] : [
    ...(t.p15 > 0 ? [{ action: 'add15', title: '+15s' }] : []),
    { action: 'skip', title: k === 'trans' ? 'Start now' : 'Skip rest' }
  ]
  return show(title, {
    body: stuck ? next + '\nEnds at ' + clock(t.end) : next,
    silent: true, renotify: false, actions, data: { kind: k }
  })
}

function alarm(t) {
  const k = t.kind
  const title = k === 'hold' ? 'Time’s up' : k === 'trans' ? 'Warm-up done. Let’s go' : 'Rest over'
  const body = k === 'hold' ? t.name + ' · ' + t.label + ' done'
    : (k === 'trans' ? 'First up: ' : 'Next: ') + t.name + ' · ' + t.label
  return show(title, {
    body, silent: false, renotify: true, requireInteraction: true,
    vibrate: [300, 120, 300], data: { kind: 'alert' }
  })
}

async function tick(id) {
  const stopAt = Date.now() + MAX_TICK_MS
  while (id === run && T) {
    const left = Math.ceil((T.end - Date.now()) / 1000)
    if (left <= 0) { const t = T; T = null; await alarm(t); return }
    if (Date.now() > stopAt) { if (!T.quiet) await countdown(T, left, true); return }
    if (!T.quiet) await countdown(T, left)
    // wake just after the shown number changes
    const wait = (T.end - Date.now()) - (left - 1) * 1000
    await sleep(Math.max(60, wait + 30))
  }
}

async function closeAll() {
  const list = await self.registration.getNotifications({ tag: TAG })
  list.forEach((n) => n.close())
}

async function idle(m) {
  // a timer just ended and its alert is still up: keep the alert rather than swap in a quiet line
  const list = await self.registration.getNotifications({ tag: TAG })
  if (list.some((n) => n.data && n.data.kind === 'alert')) return
  return show('Workout in progress', {
    // two lines: what you're on, then the tap hint — clearer than one run-on sentence
    body: m.name + ' · ' + m.label + '\nTap to carry on',
    silent: true, renotify: false, data: { kind: 'idle' }
  })
}

self.addEventListener('message', (e) => {
  const m = e.data || {}
  if (m.type === 'ff-clear') { run++; T = null; e.waitUntil(closeAll()); return }
  if (m.type !== 'ff-show') return
  run++
  if (m.kind === 'idle') { T = null; e.waitUntil(idle(m)); return }
  T = { kind: m.kind, end: +m.end, name: m.name || '', label: m.label || '', p15: m.p15 | 0, quiet: false }
  e.waitUntil(tick(run))
})

// swiped away: stop updating it every second, but still buzz when the time is up
self.addEventListener('notificationclose', (e) => {
  if (T && e.notification.tag === TAG && e.notification.data && e.notification.data.kind !== 'alert') T.quiet = true
})

async function tell(action) {
  const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  cs.forEach((c) => c.postMessage({ type: 'ff-action', action }))
}

async function openApp() {
  const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const c = cs.find((x) => 'focus' in x)
  if (c) return c.focus()
  return self.clients.openWindow(self.registration.scope)
}

self.addEventListener('notificationclick', (e) => {
  const n = e.notification
  if (e.action === 'add15') {
    // update the shade right away; the app adds the same 15 s and sends the new end time back
    if (T && T.p15 > 0) { T.end += 15000; T.p15--; T.quiet = false }
    const left = T ? Math.max(1, Math.ceil((T.end - Date.now()) / 1000)) : 0
    e.waitUntil(Promise.all([tell('add15'), T ? countdown(T, left) : Promise.resolve()]))
    return
  }
  n.close()
  if (e.action === 'skip') {
    run++; T = null
    e.waitUntil(Promise.all([tell('skip'), openApp()]))
    return
  }
  e.waitUntil(openApp())
})
