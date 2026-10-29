'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

// ============================================================
// SplashScreen — text-only splash shown when the app launches.
// Shows "FITFORG" wordmark + 3-square loading indicator below it.
// Fades out after a brief moment to reveal the app.
// ============================================================

const STORAGE_KEY = 'fitforg:splash-seen-text'
const SPLASH_VISIBLE_MS = 1400  // ms — how long the text splash is visible
const FADE_MS = 400             // ms — how long the fade-out lasts

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
    if (alreadySeen) return

    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, SPLASH_VISIBLE_MS)

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

  if (alreadySeen || hidden) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background grid place-items-center transition-opacity ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={fading}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Text-only wordmark — same styling as the in-app header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight">
            <b>FIT</b>FORG
          </h1>
          <p className="label-eyebrow text-muted-foreground mt-1">
            THE GRIND, SYSTEMATIZED
          </p>
        </div>

        {/* 3-square loading indicator */}
        <div className="flex items-center gap-1.5 mt-4">
          <span
            className="block h-1.5 w-1.5 bg-foreground animate-pulse"
            style={{ animationDelay: '0ms', animationDuration: '900ms' }}
          />
          <span
            className="block h-1.5 w-1.5 bg-foreground animate-pulse"
            style={{ animationDelay: '150ms', animationDuration: '900ms' }}
          />
          <span
            className="block h-1.5 w-1.5 bg-foreground animate-pulse"
            style={{ animationDelay: '300ms', animationDuration: '900ms' }}
          />
        </div>
      </div>
    </div>
  )
}
