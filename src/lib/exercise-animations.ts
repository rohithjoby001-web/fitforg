// ============================================================
// fitforg Exercise Animations — Canvas Wireframe Edition
// ============================================================
// Pose data for the canvas-based 3D wireframe figure.
// Each pose defines joint angles + intensity (0-1) which controls
// the orange "muscle engagement" glow on the active body part.
//
// Angle convention (side view, figure faces RIGHT):
//   0°   = pointing DOWN
//   90°  = pointing FORWARD (right)
//   180° = pointing UP
//   270° = pointing BACKWARD (left)
// ============================================================

export interface Pose {
  bodyX?: number
  bodyY?: number
  torsoAngle?: number
  upperArm?: number
  forearm?: number
  backUpperArm?: number
  backForearm?: number
  upperLeg?: number
  lowerLeg?: number
  backUpperLeg?: number
  backLowerLeg?: number
  headTilt?: number
  intensity?: number
}

export type TargetMuscle =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'legs' | 'core' | 'glutes' | 'full'

export interface Animation {
  duration: number
  poses: Pose[]
  target?: TargetMuscle
}

// ============================================================
// Templates
// ============================================================
const TEMPLATES: Record<string, Animation> = {
  // ============ PUSHUPS ============
  pushup: {
    duration: 2400,
    target: 'chest',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.15, headTilt: 30, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 50, forearm: 50, backUpperArm: 50, backForearm: 50, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.15, headTilt: 30, intensity: 0.2 },
    ],
  },
  pushupWide: {
    duration: 2400,
    target: 'chest',
    poses: [
      { torsoAngle: 90, upperArm: 110, forearm: 110, backUpperArm: 110, backForearm: 110, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.15, headTilt: 30, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 70, forearm: 70, backUpperArm: 70, backForearm: 70, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 110, forearm: 110, backUpperArm: 110, backForearm: 110, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.15, headTilt: 30, intensity: 0.2 },
    ],
  },
  pushupDiamond: {
    duration: 2400,
    target: 'triceps',
    poses: [
      { torsoAngle: 90, upperArm: 70, forearm: 70, backUpperArm: 70, backForearm: 70, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.15, headTilt: 50, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 40, forearm: 40, backUpperArm: 40, backForearm: 40, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, headTilt: 50, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 70, forearm: 70, backUpperArm: 70, backForearm: 70, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.15, headTilt: 50, intensity: 0.2 },
    ],
  },
  pushupDecline: {
    duration: 2400,
    target: 'chest',
    poses: [
      { torsoAngle: 80, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 70, lowerLeg: 110, backUpperLeg: 70, backLowerLeg: 110, bodyY: 0.15, headTilt: 30, intensity: 0.2 },
      { torsoAngle: 80, upperArm: 50, forearm: 50, backUpperArm: 50, backForearm: 50, upperLeg: 70, lowerLeg: 110, backUpperLeg: 70, backLowerLeg: 110, bodyY: 0.3, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 80, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 70, lowerLeg: 110, backUpperLeg: 70, backLowerLeg: 110, bodyY: 0.15, headTilt: 30, intensity: 0.2 },
    ],
  },
  pikePushup: {
    duration: 2400,
    target: 'shoulders',
    poses: [
      { torsoAngle: 50, upperArm: 130, forearm: 130, backUpperArm: 130, backForearm: 130, upperLeg: 150, lowerLeg: 60, backUpperLeg: 150, backLowerLeg: 60, bodyY: 0.1, bodyX: -0.05, headTilt: 100, intensity: 0.2 },
      { torsoAngle: 50, upperArm: 95, forearm: 95, backUpperArm: 95, backForearm: 95, upperLeg: 150, lowerLeg: 60, backUpperLeg: 150, backLowerLeg: 60, bodyY: 0.2, bodyX: -0.05, headTilt: 100, intensity: 0.95 },
      { torsoAngle: 50, upperArm: 130, forearm: 130, backUpperArm: 130, backForearm: 130, upperLeg: 150, lowerLeg: 60, backUpperLeg: 150, backLowerLeg: 60, bodyY: 0.1, bodyX: -0.05, headTilt: 100, intensity: 0.2 },
    ],
  },

  // ============ SQUATS ============
  squat: {
    duration: 2200,
    target: 'legs',
    poses: [
      { torsoAngle: 10, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 35, upperArm: 80, forearm: 80, backUpperArm: 80, backForearm: 80, upperLeg: 65, lowerLeg: 25, backUpperLeg: 65, backLowerLeg: 25, bodyY: 0.4, headTilt: 20, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  gobletSquat: {
    duration: 2200,
    target: 'legs',
    poses: [
      { torsoAngle: 10, upperArm: 30, forearm: 100, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 35, upperArm: 30, forearm: 100, backUpperArm: 80, backForearm: 80, upperLeg: 65, lowerLeg: 25, backUpperLeg: 65, backLowerLeg: 25, bodyY: 0.4, headTilt: 20, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 30, forearm: 100, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  splitSquat: {
    duration: 2200,
    target: 'glutes',
    poses: [
      { torsoAngle: 10, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 20, lowerLeg: 0, backUpperLeg: -20, backLowerLeg: 60, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 25, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 60, lowerLeg: 30, backUpperLeg: -10, backLowerLeg: 100, bodyY: 0.3, headTilt: 10, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 20, lowerLeg: 0, backUpperLeg: -20, backLowerLeg: 60, bodyY: 0, intensity: 0.2 },
    ],
  },
  lunge: {
    duration: 2400,
    target: 'glutes',
    poses: [
      { torsoAngle: 5, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 15, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 50, lowerLeg: 20, backUpperLeg: -50, backLowerLeg: 90, bodyY: 0.25, headTilt: 5, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  calfRaise: {
    duration: 1600,
    target: 'legs',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: -25, backUpperLeg: 0, backLowerLeg: -25, bodyY: -0.18, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  jumpSquat: {
    duration: 1800,
    target: 'legs',
    poses: [
      { torsoAngle: 30, upperArm: 30, forearm: 30, backUpperArm: 30, backForearm: 30, upperLeg: 60, lowerLeg: 30, backUpperLeg: 60, backLowerLeg: 30, bodyY: 0.5, headTilt: 20, intensity: 0.4 },
      { torsoAngle: 0, upperArm: 160, forearm: 160, backUpperArm: 160, backForearm: 160, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: -0.5, headTilt: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  pistolSquat: {
    duration: 2600,
    target: 'legs',
    poses: [
      { torsoAngle: 5, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 90, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 30, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 0, bodyY: 0.55, headTilt: 20, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 90, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },

  // ============ HINGE ============
  hinge: {
    duration: 2200,
    target: 'glutes',
    poses: [
      { torsoAngle: 5, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 75, upperArm: 95, forearm: 95, backUpperArm: 95, backForearm: 95, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.18, headTilt: 50, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  kbSwing: {
    duration: 1600,
    target: 'glutes',
    poses: [
      { torsoAngle: 75, upperArm: 100, forearm: 100, backUpperArm: 100, backForearm: 100, upperLeg: 30, lowerLeg: 0, backUpperLeg: 30, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, headTilt: -10, intensity: 0.2 },
      { torsoAngle: 75, upperArm: 100, forearm: 100, backUpperArm: 100, backForearm: 100, upperLeg: 30, lowerLeg: 0, backUpperLeg: 30, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.95 },
    ],
  },

  // ============ CURLS ============
  bicepCurl: {
    duration: 1800,
    target: 'biceps',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 5, forearm: 150, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  hammerCurl: {
    duration: 1800,
    target: 'biceps',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 10, forearm: 100, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  concentrationCurl: {
    duration: 1800,
    target: 'biceps',
    poses: [
      { torsoAngle: 50, upperArm: 80, forearm: 30, backUpperArm: 5, backForearm: 5, upperLeg: 80, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.4, headTilt: 60, intensity: 0.2 },
      { torsoAngle: 50, upperArm: 80, forearm: 150, backUpperArm: 5, backForearm: 5, upperLeg: 80, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.4, headTilt: 60, intensity: 0.95 },
      { torsoAngle: 50, upperArm: 80, forearm: 30, backUpperArm: 5, backForearm: 5, upperLeg: 80, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.4, headTilt: 60, intensity: 0.2 },
    ],
  },

  // ============ TRICEPS ============
  tricepExtension: {
    duration: 2000,
    target: 'triceps',
    poses: [
      { torsoAngle: 0, upperArm: 170, forearm: 90, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 170, forearm: 90, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  tricepKickback: {
    duration: 1800,
    target: 'triceps',
    poses: [
      { torsoAngle: 70, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 5, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.18, headTilt: 40, intensity: 0.2 },
      { torsoAngle: 70, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 5, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.18, headTilt: 40, intensity: 0.95 },
      { torsoAngle: 70, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 5, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.18, headTilt: 40, intensity: 0.2 },
    ],
  },
  skullcrusher: {
    duration: 2000,
    target: 'triceps',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 90, forearm: 30, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.2 },
    ],
  },
  benchDip: {
    duration: 2000,
    target: 'triceps',
    poses: [
      { torsoAngle: 100, upperArm: 270, forearm: 0, backUpperArm: 270, backForearm: 0, upperLeg: 90, lowerLeg: 70, backUpperLeg: 90, backLowerLeg: 70, bodyY: 0.3, bodyX: 0.05, intensity: 0.2 },
      { torsoAngle: 100, upperArm: 270, forearm: 0, backUpperArm: 270, backForearm: 0, upperLeg: 90, lowerLeg: 70, backUpperLeg: 90, backLowerLeg: 70, bodyY: 0.45, bodyX: 0.05, intensity: 0.95 },
      { torsoAngle: 100, upperArm: 270, forearm: 0, backUpperArm: 270, backForearm: 0, upperLeg: 90, lowerLeg: 70, backUpperLeg: 90, backLowerLeg: 70, bodyY: 0.3, bodyX: 0.05, intensity: 0.2 },
    ],
  },

  // ============ PRESSES ============
  shoulderPress: {
    duration: 2000,
    target: 'shoulders',
    poses: [
      { torsoAngle: 0, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  floorPress: {
    duration: 2000,
    target: 'chest',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.2 },
    ],
  },
  dbFly: {
    duration: 2200,
    target: 'chest',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 120, forearm: 30, backUpperArm: 60, backForearm: 30, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, headTilt: 90, intensity: 0.2 },
    ],
  },
  lateralRaise: {
    duration: 1800,
    target: 'shoulders',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  frontRaise: {
    duration: 1800,
    target: 'shoulders',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 90, forearm: 90, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  rearDeltFly: {
    duration: 1800,
    target: 'shoulders',
    poses: [
      { torsoAngle: 70, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.2 },
      { torsoAngle: 70, upperArm: 130, forearm: 130, backUpperArm: 50, backForearm: 50, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.95 },
      { torsoAngle: 70, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.2 },
    ],
  },
  dbPullover: {
    duration: 2200,
    target: 'chest',
    poses: [
      { torsoAngle: 90, upperArm: 170, forearm: 170, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.45, bodyX: -0.03, headTilt: 90, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 110, forearm: 110, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.45, bodyX: -0.03, headTilt: 90, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 170, forearm: 170, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.45, bodyX: -0.03, headTilt: 90, intensity: 0.2 },
    ],
  },

  // ============ ROWS / PULLS ============
  dbRow: {
    duration: 1800,
    target: 'back',
    poses: [
      { torsoAngle: 70, upperArm: 95, forearm: 90, backUpperArm: 5, backForearm: 5, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.2 },
      { torsoAngle: 70, upperArm: 30, forearm: 110, backUpperArm: 5, backForearm: 5, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.95 },
      { torsoAngle: 70, upperArm: 95, forearm: 90, backUpperArm: 5, backForearm: 5, upperLeg: 25, lowerLeg: 0, backUpperLeg: 25, backLowerLeg: 0, bodyY: 0.25, headTilt: 40, intensity: 0.2 },
    ],
  },
  bandRow: {
    duration: 1800,
    target: 'back',
    poses: [
      { torsoAngle: 30, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 20, lowerLeg: 90, backUpperLeg: 20, backLowerLeg: 90, bodyY: 0.35, headTilt: 20, intensity: 0.2 },
      { torsoAngle: 30, upperArm: 20, forearm: 80, backUpperArm: 20, backForearm: 80, upperLeg: 20, lowerLeg: 90, backUpperLeg: 20, backLowerLeg: 90, bodyY: 0.35, headTilt: 20, intensity: 0.95 },
      { torsoAngle: 30, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 20, lowerLeg: 90, backUpperLeg: 20, backLowerLeg: 90, bodyY: 0.35, headTilt: 20, intensity: 0.2 },
    ],
  },
  bandPulldown: {
    duration: 1800,
    target: 'back',
    poses: [
      { torsoAngle: 10, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: -0.12, intensity: 0.2 },
      { torsoAngle: 10, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: -0.12, intensity: 0.2 },
    ],
  },
  bandPress: {
    duration: 1800,
    target: 'chest',
    poses: [
      { torsoAngle: 0, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  bandLateral: {
    duration: 1800,
    target: 'shoulders',
    poses: [
      { torsoAngle: 0, upperArm: 10, forearm: 10, backUpperArm: 10, backForearm: 10, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 10, forearm: 10, backUpperArm: 10, backForearm: 10, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  bandPushdown: {
    duration: 1800,
    target: 'triceps',
    poses: [
      { torsoAngle: 5, upperArm: 5, forearm: 100, backUpperArm: 5, backForearm: 100, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 5, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 5, forearm: 100, backUpperArm: 5, backForearm: 100, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  bandCurl: {
    duration: 1800,
    target: 'biceps',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 5, forearm: 150, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  bandSquat: {
    duration: 2200,
    target: 'legs',
    poses: [
      { torsoAngle: 10, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 35, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 65, lowerLeg: 25, backUpperLeg: 65, backLowerLeg: 25, bodyY: 0.4, headTilt: 20, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  pullup: {
    duration: 2000,
    target: 'back',
    poses: [
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 90, bodyY: 0.3, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 90, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 90, bodyY: 0.3, intensity: 0.2 },
    ],
  },
  chinup: {
    duration: 2000,
    target: 'biceps',
    poses: [
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 90, bodyY: 0.3, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 90, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 90, bodyY: 0.3, intensity: 0.2 },
    ],
  },
  invertedRow: {
    duration: 1800,
    target: 'back',
    poses: [
      { torsoAngle: 90, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.6, bodyX: 0, headTilt: 90, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 110, forearm: 110, backUpperArm: 110, backForearm: 110, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, bodyX: 0, headTilt: 90, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.6, bodyX: 0, headTilt: 90, intensity: 0.2 },
    ],
  },
  hangingLegRaise: {
    duration: 2000,
    target: 'core',
    poses: [
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.3, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.3, intensity: 0.2 },
    ],
  },
  superman: {
    duration: 2000,
    target: 'back',
    poses: [
      { torsoAngle: 0, upperArm: 200, forearm: 200, backUpperArm: 200, backForearm: 200, upperLeg: 180, lowerLeg: 180, backUpperLeg: 180, backLowerLeg: 180, bodyY: 0.55, bodyX: -0.05, headTilt: -10, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 220, forearm: 220, backUpperArm: 220, backForearm: 220, upperLeg: 200, lowerLeg: 200, backUpperLeg: 200, backLowerLeg: 200, bodyY: 0.5, bodyX: -0.05, headTilt: -20, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 200, forearm: 200, backUpperArm: 200, backForearm: 200, upperLeg: 180, lowerLeg: 180, backUpperLeg: 180, backLowerLeg: 180, bodyY: 0.55, bodyX: -0.05, headTilt: -10, intensity: 0.2 },
    ],
  },
  towelCurl: {
    duration: 1800,
    target: 'biceps',
    poses: [
      { torsoAngle: 0, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 90, forearm: 60, backUpperArm: 90, backForearm: 60, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },

  // ============ CORE ============
  plank: {
    duration: 2400,
    target: 'core',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.95 },
    ],
  },
  sidePlank: {
    duration: 2400,
    target: 'core',
    poses: [
      { torsoAngle: 90, upperArm: 0, forearm: 0, backUpperArm: 180, backForearm: 180, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, bodyX: 0.03, headTilt: 90, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 0, forearm: 0, backUpperArm: 180, backForearm: 180, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, bodyX: 0.03, headTilt: 90, intensity: 0.95 },
    ],
  },
  hollowHold: {
    duration: 2400,
    target: 'core',
    poses: [
      { torsoAngle: 30, upperArm: 200, forearm: 200, backUpperArm: 200, backForearm: 200, upperLeg: 60, lowerLeg: 30, backUpperLeg: 60, backLowerLeg: 30, bodyY: 0.45, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 30, upperArm: 200, forearm: 200, backUpperArm: 200, backForearm: 200, upperLeg: 60, lowerLeg: 30, backUpperLeg: 60, backLowerLeg: 30, bodyY: 0.45, headTilt: 30, intensity: 0.95 },
    ],
  },
  legRaise: {
    duration: 2000,
    target: 'core',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.5, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.5, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0.5, intensity: 0.2 },
    ],
  },
  bicycleCrunch: {
    duration: 1600,
    target: 'core',
    poses: [
      { torsoAngle: 45, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 150, backLowerLeg: 60, bodyY: 0.3, headTilt: 50, intensity: 0.95 },
      { torsoAngle: 45, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 150, lowerLeg: 60, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, headTilt: 50, intensity: 0.95 },
      { torsoAngle: 45, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 150, backLowerLeg: 60, bodyY: 0.3, headTilt: 50, intensity: 0.95 },
    ],
  },
  russianTwist: {
    duration: 1600,
    target: 'core',
    poses: [
      { torsoAngle: 50, upperArm: 70, forearm: 70, backUpperArm: 70, backForearm: 70, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, bodyX: -0.03, headTilt: 40, intensity: 0.95 },
      { torsoAngle: 50, upperArm: 110, forearm: 110, backUpperArm: 110, backForearm: 110, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, bodyX: 0.03, headTilt: 40, intensity: 0.95 },
      { torsoAngle: 50, upperArm: 70, forearm: 70, backUpperArm: 70, backForearm: 70, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, bodyX: -0.03, headTilt: 40, intensity: 0.95 },
    ],
  },

  // ============ CARDIO ============
  jumpingJack: {
    duration: 1200,
    target: 'full',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 0, upperArm: 160, forearm: 160, backUpperArm: 160, backForearm: 160, upperLeg: 30, lowerLeg: 0, backUpperLeg: -30, backLowerLeg: 0, bodyY: -0.18, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  burpee: {
    duration: 2400,
    target: 'full',
    poses: [
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: -0.3, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 5, forearm: 5, backUpperArm: 5, backForearm: 5, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.2 },
    ],
  },
  mountainClimber: {
    duration: 1200,
    target: 'core',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 45, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 45, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
    ],
  },
  highKnees: {
    duration: 1000,
    target: 'legs',
    poses: [
      { torsoAngle: 5, upperArm: 60, forearm: 60, backUpperArm: 120, backForearm: 120, upperLeg: 90, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 0, bodyY: -0.06, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 120, forearm: 120, backUpperArm: 60, backForearm: 60, upperLeg: 0, lowerLeg: 0, backUpperLeg: 90, backLowerLeg: 90, bodyY: -0.06, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 60, forearm: 60, backUpperArm: 120, backForearm: 120, upperLeg: 90, lowerLeg: 90, backUpperLeg: 0, backLowerLeg: 0, bodyY: -0.06, intensity: 0.95 },
    ],
  },
  jumpRope: {
    duration: 800,
    target: 'legs',
    poses: [
      { torsoAngle: 5, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.5 },
      { torsoAngle: 5, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: -25, backUpperLeg: 0, backLowerLeg: -25, bodyY: -0.12, intensity: 0.95 },
      { torsoAngle: 5, upperArm: 30, forearm: 90, backUpperArm: 30, backForearm: 90, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.5 },
    ],
  },
  shadowBox: {
    duration: 1000,
    target: 'shoulders',
    poses: [
      { torsoAngle: 10, upperArm: 90, forearm: 90, backUpperArm: 30, backForearm: 30, upperLeg: 20, lowerLeg: 0, backUpperLeg: -10, backLowerLeg: 0, bodyY: -0.06, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 30, forearm: 30, backUpperArm: 90, backForearm: 90, upperLeg: 20, lowerLeg: 0, backUpperLeg: -10, backLowerLeg: 0, bodyY: -0.06, intensity: 0.95 },
      { torsoAngle: 10, upperArm: 90, forearm: 90, backUpperArm: 30, backForearm: 30, upperLeg: 20, lowerLeg: 0, backUpperLeg: -10, backLowerLeg: 0, bodyY: -0.06, intensity: 0.95 },
    ],
  },

  // ============ MOBILITY ============
  catCow: {
    duration: 3000,
    target: 'core',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 0, intensity: 0.5 },
      { torsoAngle: 110, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 70, lowerLeg: 90, backUpperLeg: 70, backLowerLeg: 90, bodyY: 0.4, headTilt: 60, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 0, intensity: 0.5 },
      { torsoAngle: 70, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 110, lowerLeg: 90, backUpperLeg: 110, backLowerLeg: 90, bodyY: 0.4, headTilt: -30, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 0, intensity: 0.5 },
    ],
  },
  hipFlexorStretch: {
    duration: 3000,
    target: 'glutes',
    poses: [
      { torsoAngle: 90, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 110, lowerLeg: 90, backUpperLeg: 180, backLowerLeg: 90, bodyY: 0.45, headTilt: 90, intensity: 0.5 },
      { torsoAngle: 70, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 110, lowerLeg: 90, backUpperLeg: 180, backLowerLeg: 90, bodyY: 0.45, headTilt: 70, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 110, lowerLeg: 90, backUpperLeg: 180, backLowerLeg: 90, bodyY: 0.45, headTilt: 90, intensity: 0.5 },
    ],
  },
  shoulderDislocates: {
    duration: 3000,
    target: 'shoulders',
    poses: [
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.5 },
      { torsoAngle: 0, upperArm: 180, forearm: 180, backUpperArm: 180, backForearm: 180, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 200, forearm: 200, backUpperArm: 200, backForearm: 200, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.95 },
      { torsoAngle: 0, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 0, lowerLeg: 0, backUpperLeg: 0, backLowerLeg: 0, bodyY: 0, intensity: 0.5 },
    ],
  },
  worldsGreatest: {
    duration: 3000,
    target: 'core',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
      { torsoAngle: 60, upperArm: 90, forearm: 0, backUpperArm: 180, backForearm: 180, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 60, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 0, backUpperArm: 90, backForearm: 0, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
    ],
  },
  thoracicBridge: {
    duration: 3000,
    target: 'back',
    poses: [
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
      { torsoAngle: 130, upperArm: 170, forearm: 170, backUpperArm: 170, backForearm: 170, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.3, headTilt: -10, intensity: 0.95 },
      { torsoAngle: 90, upperArm: 90, forearm: 90, backUpperArm: 90, backForearm: 90, upperLeg: 90, lowerLeg: 90, backUpperLeg: 90, backLowerLeg: 90, bodyY: 0.4, headTilt: 30, intensity: 0.5 },
    ],
  },
  handstand: {
    duration: 2400,
    target: 'shoulders',
    poses: [
      { torsoAngle: 180, upperArm: 180, forearm: 180, backUpperArm: 180, backForearm: 180, upperLeg: 180, lowerLeg: 180, backUpperLeg: 180, backLowerLeg: 180, bodyY: 0, headTilt: 180, intensity: 0.95 },
      { torsoAngle: 180, upperArm: 180, forearm: 180, backUpperArm: 180, backForearm: 180, upperLeg: 180, lowerLeg: 180, backUpperLeg: 180, backLowerLeg: 180, bodyY: 0, headTilt: 180, intensity: 0.95 },
    ],
  },
}

// ============================================================
// Exercise ID → template mapping
// ============================================================
export const EXERCISE_ANIMATIONS: Record<string, Animation> = {
  // Push-ups
  'pushup-standard': TEMPLATES.pushup,
  'pushup-wide': TEMPLATES.pushupWide,
  'pushup-diamond': TEMPLATES.pushupDiamond,
  'pushup-decline': TEMPLATES.pushupDecline,
  'pushup-incline': TEMPLATES.pushup,
  'pushup-archer': TEMPLATES.pushup,
  'pike-pushup': TEMPLATES.pikePushup,
  'handstand-hold': TEMPLATES.handstand,
  // Chest
  'db-bench-press': TEMPLATES.floorPress,
  'db-fly': TEMPLATES.dbFly,
  'db-pullover': TEMPLATES.dbPullover,
  // Back
  'pullup': TEMPLATES.pullup,
  'chinup': TEMPLATES.chinup,
  'inverted-row': TEMPLATES.invertedRow,
  'db-row': TEMPLATES.dbRow,
  'db-row-floor': TEMPLATES.dbRow,
  'db-deadlift': TEMPLATES.hinge,
  'superman': TEMPLATES.superman,
  'band-pulldown': TEMPLATES.bandPulldown,
  'band-row': TEMPLATES.bandRow,
  // Shoulders
  'db-shoulder-press': TEMPLATES.shoulderPress,
  'db-lateral-raise': TEMPLATES.lateralRaise,
  'db-front-raise': TEMPLATES.frontRaise,
  'db-rear-delt-fly': TEMPLATES.rearDeltFly,
  'band-press': TEMPLATES.bandPress,
  'band-lateral': TEMPLATES.bandLateral,
  // Biceps
  'db-curl': TEMPLATES.bicepCurl,
  'db-hammer-curl': TEMPLATES.hammerCurl,
  'db-concentration-curl': TEMPLATES.concentrationCurl,
  'band-curl': TEMPLATES.bandCurl,
  'towel-curl': TEMPLATES.towelCurl,
  // Triceps
  'bench-dip': TEMPLATES.benchDip,
  'chair-dip': TEMPLATES.benchDip,
  'db-tricep-extension': TEMPLATES.tricepExtension,
  'db-kickback': TEMPLATES.tricepKickback,
  'db-skullcrusher': TEMPLATES.skullcrusher,
  'band-pushdown': TEMPLATES.bandPushdown,
  // Legs
  'bodyweight-squat': TEMPLATES.squat,
  'db-goblet-squat': TEMPLATES.gobletSquat,
  'db-split-squat': TEMPLATES.splitSquat,
  'db-lunge': TEMPLATES.lunge,
  'db-calf-raise': TEMPLATES.calfRaise,
  'db-rdl': TEMPLATES.hinge,
  'pistol-squat': TEMPLATES.pistolSquat,
  'jump-squat': TEMPLATES.jumpSquat,
  'band-squat': TEMPLATES.bandSquat,
  'kb-goblet-squat': TEMPLATES.gobletSquat,
  'kb-swing': TEMPLATES.kbSwing,
  // Core
  'plank': TEMPLATES.plank,
  'side-plank': TEMPLATES.sidePlank,
  'hollow-hold': TEMPLATES.hollowHold,
  'leg-raise': TEMPLATES.legRaise,
  'bicycle-crunch': TEMPLATES.bicycleCrunch,
  'mountain-climber': TEMPLATES.mountainClimber,
  'db-russian-twist': TEMPLATES.russianTwist,
  'hanging-leg-raise': TEMPLATES.hangingLegRaise,
  // Cardio
  'jumping-jack': TEMPLATES.jumpingJack,
  'burpee': TEMPLATES.burpee,
  'high-knees': TEMPLATES.highKnees,
  'jump-rope': TEMPLATES.jumpRope,
  'shadow-box': TEMPLATES.shadowBox,
  // Mobility
  'cat-cow': TEMPLATES.catCow,
  'hip-flexor-stretch': TEMPLATES.hipFlexorStretch,
  'shoulder-dislocates': TEMPLATES.shoulderDislocates,
  'world-greatest': TEMPLATES.worldsGreatest,
  'thoracic-bridge': TEMPLATES.thoracicBridge,
}

export function getExerciseAnimation(exerciseId: string): Animation {
  return EXERCISE_ANIMATIONS[exerciseId] ?? {
    duration: 2000,
    poses: [{ torsoAngle: 0, upperArm: 5, forearm: 5, upperLeg: 0, lowerLeg: 0, intensity: 0.3 }],
    target: 'full',
  }
}
