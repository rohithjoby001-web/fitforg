// ============================================================
// Exercise Video Registry
// ============================================================
// Maps exercise IDs to their video files in /public/videos/exercises/.
// The ExerciseAnimationView component checks this registry first;
// if a video exists for the exercise, it uses the video player.
// Otherwise, it falls back to the SVG stick-figure animation.
//
// To add a new video:
//   1. Drop the .mp4 file in /public/videos/exercises/<id>.mp4
//   2. Add an entry here: '<exerciseId>': '/videos/exercises/<id>.mp4'
// ============================================================

// Cache-busting version — bump this when replacing a video file
// to force browsers to fetch the new version instead of using cache
const VIDEO_VERSION = 'v8'

export const EXERCISE_VIDEOS: Record<string, string> = {
  // Dumbbell Walking Lunge — 3D exercise demo video (portrait 720x1280, matches
  // the previous video's screen size — fills the square container the same way)
  'db-lunge': `/videos/exercises/db-lunge.mp4?${VIDEO_VERSION}`,
  // Dumbbell Calf Raise — 3D exercise demo video (portrait 720x1280)
  'db-calf-raise': `/videos/exercises/db-calf-raise.mp4?${VIDEO_VERSION}`,
}

// Helper: get the video URL for an exercise, or null if no video exists
export function getExerciseVideo(exerciseId: string): string | null {
  return EXERCISE_VIDEOS[exerciseId] ?? null
}
