'use client'

// ============================================================
// ExerciseAnimationView — Smart dispatcher
// ============================================================
// Decides which animation renderer to use for a given exercise:
//   1. If a video file exists for this exercise → ExerciseVideoPlayer
//   2. Otherwise → CanvasWireframeFigure (3D wireframe stick figure
//      rendered with canvas, matches the user's reference HTML style)
//
// The SVG mannequin code that used to live here has been replaced by
// the canvas renderer in `canvas-wireframe-figure.tsx`, which produces
// a much more recognizable figure (cylindrical limbs with depth shading,
// spherical joints, warm-up intensity glow on the active muscle group).
// ============================================================

import { getExerciseVideo } from '@/lib/exercise-videos'
import { ExerciseVideoPlayer } from '@/components/exercise-video-player'
import { CanvasWireframeFigure } from '@/components/canvas-wireframe-figure'
import { getExerciseAnimation } from '@/lib/exercise-animations'

export function ExerciseAnimationView({ exerciseId }: { exerciseId: string }) {
  const videoUrl = getExerciseVideo(exerciseId)
  if (videoUrl) {
    return <ExerciseVideoPlayer videoUrl={videoUrl} />
  }
  // Use the canvas wireframe renderer
  const animation = getExerciseAnimation(exerciseId)
  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto border border-border overflow-hidden bg-background">
      <CanvasWireframeFigure animation={animation} />
      {/* Top-left DEMO label */}
      <div className="absolute top-2 left-2 pointer-events-none">
        <span className="label-eyebrow text-foreground bg-background/60 px-1.5 py-0.5">
          DEMO
        </span>
      </div>
    </div>
  )
}
