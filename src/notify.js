// ============================================================
// Fitforg · workout notifications (app side)
//
// While you're in the app, nothing is shown: the timer is on screen.
// When you switch to another app during a workout, the app hands what
// it's doing to the service worker (public/sw.js), which:
//   - shows the rest countdown in the notification panel and ticks it
//     every second, with "+15s" and "Skip rest" buttons
//   - buzzes when the rest (or a timed hold) is over
//   - shows a quiet "Workout in progress" line otherwise
// Coming back to the app clears it. Nothing leaves the phone: there is
// no server and no push, it's all local.
//
// The service worker does the ticking because Chrome slows down and can
// pause timers in pages that are in the background, but not in a worker
// that is busy with a message.
// ============================================================

const OK = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator

let state = null         // what the workout is doing now, or null when no workout is running
let sent = ''            // last message sent, so the same thing isn't sent twice
let allowed = () => false
const handlers = {}

export const notifySupported = () => OK
export const notifyPermission = () => (OK ? Notification.permission : 'unsupported')

// call from a tap: browsers only show the permission prompt in response to one
export async function notifyAsk() {
  if (!OK) return 'unsupported'
  try { return await Notification.requestPermission() } catch (e) { return Notification.permission }
}

// fn() says whether notifications are switched on in Fitforg's settings
export function notifyEnabled(fn) { allowed = fn }

// fn runs when a notification button is tapped: 'add15' or 'skip'
export function notifyOn(action, fn) { handlers[action] = fn }

// st: null, or {kind:'rest'|'trans'|'hold'|'idle', end, name, label, p15}
export function notifyState(st) {
  state = st
  if (document.visibilityState === 'hidden') push()
}

function push() {
  const msg = state && allowed() ? { type: 'ff-show', ...state } : { type: 'ff-clear' }
  const k = JSON.stringify(msg)
  if (k === sent) return
  sent = k
  post(msg)
}

async function post(msg) {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    const sw = reg && (reg.active || reg.waiting || reg.installing)
    if (sw) sw.postMessage(msg)
  } catch (e) {}
}

if (OK) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') push()
    else { sent = ''; clearShade() }
  })
  navigator.serviceWorker.addEventListener('message', (e) => {
    const d = e.data || {}
    if (d.type === 'ff-action' && handlers[d.action]) handlers[d.action]()
  })
  // messages sent before this page started listening are held until this is called
  if (navigator.serviceWorker.startMessages) navigator.serviceWorker.startMessages()
}

// back in the app: take the notification down
function clearShade() {
  const msg = { type: 'ff-clear' }
  sent = JSON.stringify(msg)
  post(msg)
}
