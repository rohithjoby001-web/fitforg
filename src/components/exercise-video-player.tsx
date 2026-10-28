'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

// ============================================================
// ExerciseVideoPlayer — plays a looping exercise demo video
// styled to match fitforg's brutalist theme.
//
// Features:
//   - Auto-plays muted + loops by default
//   - Tap video to play/pause
//   - Custom play/pause button overlay (centered)
//   - Restart button (bottom-right)
//   - Slight dark filter only (NOT full grayscale) — keeps original
//     colors visible, just slightly darkened for mood matching
//   - Blurred background video layer fills the empty pillarbox space
//     with a dimmed, blurred version of the video itself — no visible
//     edge between video and container, even with portrait videos
//   - Smart fit: object-contain so portrait videos don't get cropped
//   - Falls back gracefully if video fails to load
// ============================================================

export function ExerciseVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const bgVideoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [progress, setProgress] = useState(0) // 0-1

  // Auto-play on mount (muted, looped — required for mobile autoplay)
  useEffect(() => {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return
    v.muted = true
    v.loop = true
    v.playsInline = true
    v.play().then(() => {
      setIsPlaying(true)
      // Also play the background video in sync
      if (bg) {
        bg.currentTime = v.currentTime
        bg.play().catch(() => {})
      }
    }).catch(() => setIsPlaying(false))
  }, [videoUrl])

  function togglePlay() {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return
    if (v.paused) {
      v.play().then(() => {
        setIsPlaying(true)
        if (bg) {
          bg.currentTime = v.currentTime
          bg.play().catch(() => {})
        }
      }).catch(() => {})
    } else {
      v.pause()
      bg?.pause()
      setIsPlaying(false)
    }
  }

  function restart() {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return
    v.currentTime = 0
    if (bg) bg.currentTime = 0
    v.play().then(() => {
      setIsPlaying(true)
      bg?.play().catch(() => {})
    }).catch(() => {})
  }

  function onTimeUpdate() {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v || !v.duration) return
    setProgress(v.currentTime / v.duration)
    // Keep background video roughly in sync
    if (bg && Math.abs(bg.currentTime - v.currentTime) > 0.3) {
      bg.currentTime = v.currentTime
    }
  }

  if (hasError) {
    return (
      <div className="w-full aspect-square max-w-[280px] mx-auto border border-border grid place-items-center bg-background">
        <p className="label-eyebrow text-muted-foreground">VIDEO UNAVAILABLE</p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto border border-border overflow-hidden group bg-black">
      {/* Background video layer — fills the entire container with object-cover,
          heavily blurred + darkened. This creates an ambient background that
          matches the video's colors/gradients perfectly, so there's NO visible
          edge between the video and the container — the empty pillarbox space
          is filled with a blurred version of the video itself.
          Both video elements share the same src + currentTime (kept in sync
          via the ref). */}
      <video
        ref={bgVideoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          // Blurred + slightly dimmed to match the main video's filtered background.
          // brightness(0.8) was calculated to match: original video bg (38,44,52)
          // × 0.8 = (30, 35, 42), which matches the main video's rendered bg (30, 36, 44)
          // after its brightness(0.92) contrast(1.05) filter is applied.
          filter: 'blur(20px) brightness(0.8) saturate(0.6)',
          transform: 'scale(1.2)', // scale up slightly so blur edges don't show
        }}
        playsInline
        muted
        loop
        preload="auto"
      />

      {/* Main video — the actual content the user watches.
          object-contain preserves the full video (no cropping).
          The blurred background layer fills any empty space. */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'contain',
          objectPosition: 'center',
          filter: 'brightness(0.92) contrast(1.05)',
        }}
        onClick={togglePlay}
        onTimeUpdate={onTimeUpdate}
        onError={() => setHasError(true)}
        playsInline
        muted
        loop
        preload="auto"
      />

      {/* Top-left DEMO label */}
      <div className="absolute top-2 left-2 pointer-events-none">
        <span className="label-eyebrow text-foreground bg-background/60 px-1.5 py-0.5">
          DEMO
        </span>
      </div>

      {/* Center play/pause button — only shows when paused OR on hover */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        className={`absolute inset-0 grid place-items-center transition-opacity ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <span className="grid place-items-center h-14 w-14 border-2 border-foreground bg-background/70 backdrop-blur-sm">
          {isPlaying ? (
            <Pause className="h-6 w-6 text-foreground" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 text-foreground ml-1" fill="currentColor" />
          )}
        </span>
      </button>

      {/* Bottom progress bar + restart button */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-2 py-1.5 bg-gradient-to-t from-background/95 to-transparent">
        {/* Progress track */}
        <div className="flex-1 h-px bg-muted/60 relative">
          <div
            className="absolute inset-y-0 left-0 bg-foreground"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {/* Restart button */}
        <button
          onClick={restart}
          aria-label="Restart video"
          className="text-foreground/70 hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
