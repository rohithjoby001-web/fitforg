'use client'

import { useEffect } from 'react'

// ============================================================
// Service Worker Registration
// Registers /sw.js when in production OR dev with HTTPS-like context.
// Silent on failure (no annoying dev errors).
// ============================================================

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Register after window load to not block first paint
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Check for updates every hour
          setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000)
        })
        .catch((err) => {
          // Silent — SW registration is optional, app still works
          console.debug('[fitforg] SW registration skipped:', err.message)
        })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
