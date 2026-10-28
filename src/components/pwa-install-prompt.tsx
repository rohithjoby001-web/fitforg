'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// ============================================================
// PWA Install Prompt — shows Android-style install banner
// Appears when browser detects installability criteria are met.
// Stays dismissed for 7 days after user dismisses.
// ============================================================

const DISMISS_KEY = 'fitforg:install-dismissed'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function PwaInstallPrompt() {
  // Lazy-init: skip rendering entirely if already installed OR recently dismissed
  const [state, setState] = useState<{
    ready: boolean
    deferred: BeforeInstallPromptEvent | null
  }>(() => {
    if (typeof window === 'undefined') {
      return { ready: false, deferred: null }
    }
    // Already installed (standalone mode) — never render
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return { ready: true, deferred: null }
    }
    if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
      return { ready: true, deferred: null }
    }
    // Recently dismissed — never render
    try {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0)
      if (dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION_MS) {
        return { ready: true, deferred: null }
      }
    } catch {
      // localStorage might not be available
    }
    return { ready: false, deferred: null }
  })

  // Listen for beforeinstallprompt — capture the event so we can prompt later
  useEffect(() => {
    if (state.ready) return

    const handler = (e: Event) => {
      e.preventDefault()
      const evt = e as BeforeInstallPromptEvent
      setState({ ready: true, deferred: evt })
    }

    const installedHandler = () => {
      setState({ ready: true, deferred: null })
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [state.ready])

  async function handleInstall() {
    if (!state.deferred) return
    await state.deferred.prompt()
    const choice = await state.deferred.userChoice
    if (choice.outcome === 'accepted') {
      setState({ ready: true, deferred: null })
    } else {
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()))
      } catch {}
      setState({ ready: true, deferred: null })
    }
  }

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {}
    setState({ ready: true, deferred: null })
  }

  // Don't render anything if already installed, recently dismissed, or no prompt available
  if (!state.deferred) return null

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-40 fade-up"
      role="dialog"
      aria-labelledby="install-title"
      aria-describedby="install-desc"
    >
      <div className="mx-auto max-w-md border border-border bg-card backdrop-blur-md shadow-2xl">
        <div className="flex items-start gap-3 p-4">
          <img src="/icons/icon-192.png" alt="" width={48} height={48} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 id="install-title" className="impact text-sm tracking-tight mb-1">
              INSTALL FITFORG
            </h2>
            <p id="install-desc" className="text-xs text-muted-foreground leading-snug">
              Add to home screen. Works offline. No app store.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex-1 h-9 bg-foreground text-background text-xs font-bold uppercase tracking-wide hover:bg-foreground/90 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="h-9 px-3 border border-border text-xs uppercase tracking-wide hover:bg-foreground/5 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

