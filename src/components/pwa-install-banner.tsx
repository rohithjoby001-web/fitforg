'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, RefreshCw } from 'lucide-react'
import { usePWAInstall, useServiceWorker, useMounted } from '@/hooks/usePWAInstall'

// ============================================================
// PWA Install + Update banner
// Shows when:
//   - the app is installable (beforeinstallprompt fired) → "Install app"
//   - a new SW version is ready                            → "Update"
// Dismissable. Sticks to the bottom of the screen above the
// bottom nav so it doesn't get covered.
// ============================================================

export function PWAInstallBanner() {
  const { installable, installed, promptInstall } = usePWAInstall()
  const { updateReady, applyUpdate } = useServiceWorker()
  const [dismissed, setDismissed] = useState(false)
  const mounted = useMounted()

  // Don't show anything if: not mounted yet, dismissed, already installed, or nothing to say
  if (!mounted) return null
  if (dismissed) return null
  if (installed) {
    // Already installed — only show the update banner if there's an update
    if (!updateReady) return null
    return (
      <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="mx-auto max-w-3xl bg-foreground text-background px-4 py-3 flex items-center gap-3 pointer-events-auto">
          <RefreshCw className="h-4 w-4 shrink-0" />
          <p className="text-xs font-semibold uppercase tracking-wide flex-1">
            New version ready
          </p>
          <Button
            size="sm"
            onClick={applyUpdate}
            className="bg-background text-foreground hover:bg-background/80 h-8 rounded-none px-3 uppercase tracking-wide"
          >
            Update
          </Button>
        </div>
      </div>
    )
  }

  if (!installable && !updateReady) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="mx-auto max-w-3xl bg-foreground text-background px-4 py-3 flex items-center gap-3 pointer-events-auto">
        <Download className="h-4 w-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide leading-tight">
            Install fitforg
          </p>
          <p className="text-[10px] opacity-70 leading-tight mt-0.5">
            Works offline · no app store · free
          </p>
        </div>
        <Button
          size="sm"
          onClick={promptInstall}
          className="bg-background text-foreground hover:bg-background/80 h-8 rounded-none px-3 uppercase tracking-wide"
        >
          Install
        </Button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss install banner"
          className="text-background/60 hover:text-background p-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

