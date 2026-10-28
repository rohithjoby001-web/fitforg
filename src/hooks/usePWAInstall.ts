'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

// ============================================================
// usePWAInstall — captures the beforeinstallprompt event so we
// can show a custom "Install app" button, and tracks whether
// the app is already installed (running in standalone mode).
//
// Uses useSyncExternalStore for the standalone check (which is
// browser state, not React state) to comply with React 19's
// "no setState in effects" rule.
// ============================================================

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt: () => Promise<void>
}

// useSyncExternalStore: subscribe + getSnapshot for "is standalone PWA"
function subscribeStandalone(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(display-mode: standalone)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}
function getStandaloneSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}
function getStandaloneServerSnapshot(): boolean {
  return false
}

export function usePWAInstall() {
  // True if the app is running as installed (standalone display mode)
  const installed = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  )
  // True if the browser fired beforeinstallprompt (i.e. installable + not yet installed)
  const [installable, setInstallable] = useState(false)
  // Holds the deferred prompt event so we can call prompt() on user click
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      // Prevent the default browser install prompt
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setInstallable(true)
    }

    function onAppInstalled() {
      setInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return false
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setInstallable(false)
      setDeferredPrompt(null)
      return true
    }
    return false
  }

  return { installable, installed, promptInstall }
}

// ============================================================
// useServiceWorker — registers /sw.js on mount, and listens
// for updates so the user can be told to refresh.
//
// Only runs in production — dev mode would interfere with HMR.
// ============================================================

export function useServiceWorker() {
  const [updateReady, setUpdateReady] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    // Don't register in dev mode — it complicates HMR
    if (process.env.NODE_ENV !== 'production') return

    let cancelled = false

    async function register() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
        if (cancelled) return
        setRegistered(true)

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version ready, waiting to activate
              setUpdateReady(true)
            }
          })
        })
      } catch (err) {
        console.warn('[PWA] Service worker registration failed:', err)
      }
    }

    register()
    return () => {
      cancelled = true
    }
  }, [])

  function applyUpdate() {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker.controller) {
      window.location.reload()
      return
    }
    // Tell the waiting SW to skipWaiting, then reload once it activates
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    }, { once: true })
  }

  return { registered, updateReady, applyUpdate }
}

// ============================================================
// useMounted — simple SSR-safe mount flag using
// useSyncExternalStore to avoid setState-in-effect lint.
// ============================================================

const subscribeNoop = () => () => {}
export function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,    // client snapshot: always true after hydration
    () => false    // server snapshot: always false
  )
}
