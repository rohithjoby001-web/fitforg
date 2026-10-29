'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

// ============================================================
// SplashScreen — text-only splash shown when the app launches.
// Replaces Android's native splash (logo only) with a smooth
// fade to the "FITFORG" wordmark, then fades into the app.
//
// Text style:
//   - "FIT" bold
//   - "FORG" normal weight
//   - Space Grotesk font (via .font-display class)
//   - Same styling as the in-app header text
//
// Shows once per browser session (sessionStorage), so switching
// tabs within the app doesn't trigger it again.
// ============================================================

const STORAGE_KEY = 'fitforg:splash-seen-text'
const SPLASH_VISIBLE_MS = 1400  // ms — how long the text splash is visible
const FADE_MS = 400             // ms — how long the fade-out lasts

// useSyncExternalStore: subscribe to sessionStorage "already seen" state.
function subscribeSeen(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}
function getSeenSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}
function getSeenServerSnapshot(): boolean {
  return false
}

export function SplashScreen() {
  const alreadySeen = useSyncExternalStore(subscribeSeen, getSeenSnapshot, getSeenServerSnapshot)
  const [fading, setFading] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (alreadySeen) return // splash already shown this session

    // After SPLASH_VISIBLE_MS, start fading out
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, SPLASH_VISIBLE_MS)

    // After fade completes, unmount the splash + mark as seen
    const hideTimer = setTimeout(() => {
      setHidden(true)
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // ignore
      }
    }, SPLASH_VISIBLE_MS + FADE_MS)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [alreadySeen])

  // Don't render if already seen this session OR we've hidden it
  if (alreadySeen || hidden) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background grid place-items-center transition-opacity duration-400 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={fading}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Text-only wordmark — same styling as the in-app header */}
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight">
          <b>FIT</b>FORG
        </h1>

        {/* Tagline — small mono eyebrow */}
        <p className="label-eyebrow text-muted-foreground mt-1">
          THE GRIND, SYSTEMATIZED
        </p>
      </div>
    </div>
  )
}
