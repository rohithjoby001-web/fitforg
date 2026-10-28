'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { FitforgLogo } from '@/components/fitforg-logo'

// ============================================================
// SplashScreen — centered logo + FITFORG wordmark shown on
// app open. Fades out after a brief moment to reveal the app.
// Uses sessionStorage so it only shows once per app session
// (not every time you switch tabs within the app).
// ============================================================

const STORAGE_KEY = 'fitforg:splash-seen'
const SPLASH_DURATION = 1800 // ms — how long the splash is visible
const FADE_DURATION = 500    // ms — how long the fade-out lasts

// useSyncExternalStore: subscribe to sessionStorage "already seen" state.
// Avoids setState-in-effect lint issue.
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
  // If already seen this session, never mount the splash at all
  const [fading, setFading] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (alreadySeen) return // nothing to do — splash is already not rendered

    // After SPLASH_DURATION, start the fade
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, SPLASH_DURATION)

    // After fade completes, unmount the splash + mark seen
    const hideTimer = setTimeout(() => {
      setHidden(true)
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // ignore
      }
    }, SPLASH_DURATION + FADE_DURATION)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [alreadySeen])

  // Don't render if already seen this session OR we've hidden it
  if (alreadySeen || hidden) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background grid place-items-center transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={fading}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Big centered logo */}
        <FitforgLogo size={96} />

        {/* Wordmark */}
        <div className="text-center">
          <h1 className="impact text-3xl tracking-tight">fitforg</h1>
          <p className="label-eyebrow text-muted-foreground mt-2">
            THE GRIND, SYSTEMATIZED
          </p>
        </div>
      </div>

      {/* Subtle pulse loader at bottom — indicates the app is loading */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1">
        <span className="block h-1 w-1 bg-foreground/60 animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="block h-1 w-1 bg-foreground/60 animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="block h-1 w-1 bg-foreground/60 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
