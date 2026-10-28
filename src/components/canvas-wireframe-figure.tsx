'use client'

import { useEffect, useRef } from 'react'

// ============================================================
// fitforg Canvas Wireframe Figure
// ============================================================
// A canvas-based 3D wireframe human renderer inspired by the
// user's reference HTML. Renders limbs as cylinders with depth
// shading, joints as spheres, and supports:
//   - Side-view pose (hip, shoulder, all joints)
//   - Back/front limb depth differentiation (dimmer for far side)
//   - Warm-up intensity glow on active muscle groups (orange tint)
//   - Subtle ground ellipse + radial gradient halo
//   - Pure white wireframe on dark charcoal background
//   - 60fps requestAnimationFrame loop with eased interpolation
//
// Pose data structure (per exercise):
//   poses: array of keyframes
//   each pose defines joint angles (0=down, 90=forward, 180=up)
// ============================================================

interface Pose {
  bodyY?: number           // vertical offset (squat depth, jump height)
  bodyX?: number           // horizontal offset (lunge stride)
  torsoAngle?: number      // forward lean (0=vertical, 90=horizontal)
  upperArm?: number        // front arm shoulder angle
  forearm?: number         // front arm elbow angle
  backUpperArm?: number
  backForearm?: number
  upperLeg?: number        // front leg hip angle
  lowerLeg?: number        // front leg knee angle
  backUpperLeg?: number
  backLowerLeg?: number
  headTilt?: number
  intensity?: number       // 0-1, controls muscle glow intensity
}

interface Animation {
  duration: number
  poses: Pose[]
  // Which body part is "working" (gets the orange highlight glow)
  target?: 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'core' | 'glutes' | 'full'
}

// ============================================================
// 3D Math helpers
// ============================================================
type V3 = [number, number, number]

function sub(a: V3, b: V3): V3 { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]] }
function add(a: V3, b: V3): V3 { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]] }
function mul(a: V3, k: number): V3 { return [a[0]*k, a[1]*k, a[2]*k] }
function len(a: V3): number { return Math.hypot(a[0], a[1], a[2]) }
function norm(a: V3): V3 { const l = len(a) || 1; return [a[0]/l, a[1]/l, a[2]/l] }

// 2-bone IK: given hip, ankle, and segment lengths, return knee position
function ik(hip: V3, ankle: V3, L1: number, L2: number): V3 {
  const v = sub(ankle, hip)
  let d = Math.min(len(v), L1 + L2 - 0.001)
  const cosAng = (L1*L1 + d*d - L2*L2) / (2 * L1 * d)
  const ang = Math.acos(Math.max(-1, Math.min(1, cosAng)))
  const baseAng = Math.atan2(v[1], v[0]) + ang
  return add(hip, [L1 * Math.cos(baseAng), L1 * Math.sin(baseAng), 0])
}

// Project 3D point to 2D screen coords.
// 3D convention: +Y = up, +X = right (figure faces +X), +Z = out of screen
// Screen convention: +X = right, +Y = down
// So we INVERT Y when projecting (3D up = screen up = lower Y value)
function project(p: V3, W: number, H: number, S: number, X0: number, Y0: number): [number, number, number] {
  // Camera: slight yaw + pitch for 3D feel
  const YAW = -0.4
  const cy = Math.cos(YAW), sy = Math.sin(YAW)
  const PITCH = 0.12
  // Apply yaw rotation around Y axis
  const X = p[0] * cy + p[2] * sy
  const Z = -p[0] * sy + p[2] * cy
  // Project to screen — Y0 is the ground line, figure extends UP from there
  // 3D +Y → screen -Y (up), so we subtract Y * S from Y0
  return [
    X0 + X * S,
    Y0 - (p[1] - Z * PITCH) * S,  // p[1] is up in 3D, so subtract to go up on screen
    Z, // depth for shading
  ]
}

// ============================================================
// Body geometry — compute all joint positions for a pose
// ============================================================
interface Joints {
  head: V3; neck: V3; shoulder: V3; hip: V3; pelvis: V3
  elbow: V3; wrist: V3
  backElbow: V3; backWrist: V3
  knee: V3; ankle: V3
  backKnee: V3; backAnkle: V3
}

function computeJoints(pose: Pose): Joints {
  const bodyY = pose.bodyY ?? 0
  const bodyX = pose.bodyX ?? 0
  const torsoAngle = (pose.torsoAngle ?? 0) * Math.PI / 180

  // Center of figure — Y is "up" in 3D space (positive = up)
  // We'll project to screen coords where +Y screen = down
  const cx = bodyX
  // hipY positive — figure stands with hip at height ~0.85 above ground (y=0)
  const hipY = 0.85 + bodyY  // bodyY positive = squat down (lower hip), negative = jump up

  // Hip (base of torso)
  const hip: V3 = [cx, hipY, 0]

  // Shoulder = hip + torso direction
  // torsoAngle 0 = vertical (shoulder above hip)
  // torsoAngle 90 = horizontal forward
  const torsoLen = 0.55
  // In 3D: shoulder is at hip + (sin(angle)*len, cos(angle)*len, 0)
  // For angle=0: shoulder = hip + (0, len, 0) = above hip ✓
  // For angle=90: shoulder = hip + (len, 0, 0) = forward of hip ✓
  const shoulder: V3 = add(hip, [Math.sin(torsoAngle) * torsoLen, Math.cos(torsoAngle) * torsoLen, 0])

  // Neck + head
  const headDir = norm(sub(shoulder, hip))
  const neck: V3 = add(shoulder, mul(headDir, 0.08))
  const head: V3 = add(add(neck, mul(headDir, 0.17)), [0.025, 0, 0])

  // Front arm (offset to +z side)
  const upperArmAng = (pose.upperArm ?? 5) * Math.PI / 180
  const forearmAng = (pose.forearm ?? upperArmAng) * Math.PI / 180
  const upperArmLen = 0.27
  const forearmLen = 0.27
  // Arm hangs DOWN from shoulder: angle 0 = down (away from shoulder in -Y direction)
  // So elbow = shoulder + (-sin*len, -cos*len, z)
  const elbow: V3 = add(shoulder, [-Math.sin(upperArmAng) * upperArmLen, -Math.cos(upperArmAng) * upperArmLen, 0.18])
  const wrist: V3 = add(elbow, [-Math.sin(forearmAng) * forearmLen, -Math.cos(forearmAng) * forearmLen, 0.18])

  // Back arm (offset to -z side)
  const bua = (pose.backUpperArm ?? upperArmAng) * Math.PI / 180
  const bfa = (pose.backForearm ?? forearmAng) * Math.PI / 180
  const backElbow: V3 = add(shoulder, [-Math.sin(bua) * upperArmLen, -Math.cos(bua) * upperArmLen, -0.18])
  const backWrist: V3 = add(backElbow, [-Math.sin(bfa) * forearmLen, -Math.cos(bfa) * forearmLen, -0.18])

  // Front leg (+z) — hangs DOWN from hip
  const upperLegAng = (pose.upperLeg ?? 0) * Math.PI / 180
  const lowerLegAng = (pose.lowerLeg ?? upperLegAng) * Math.PI / 180
  const upperLegLen = 0.42
  const lowerLegLen = 0.42
  const hipR: V3 = add(hip, [0, 0, 0.09])
  // Leg goes DOWN from hip: knee = hip + (-sin*len, -cos*len, z)
  // For angle 0 (down): knee = hip + (0, -len, z) = below hip ✓
  // For angle 90 (forward): knee = hip + (-len, 0, z) = in front of hip ✓
  // Wait — for figure facing right (+x), "forward" means +x, so sin should be positive
  // Let me redo: angle 0 = down, angle 90 = forward (figure faces +x)
  // So knee = hip + (sin*len, -cos*len, z)  ← positive sin for forward
  const knee: V3 = add(hipR, [Math.sin(upperLegAng) * upperLegLen, -Math.cos(upperLegAng) * upperLegLen, 0.09])
  const ankle: V3 = add(knee, [Math.sin(lowerLegAng) * lowerLegLen, -Math.cos(lowerLegAng) * lowerLegLen, 0.09])

  // Back leg (-z)
  const bula = (pose.backUpperLeg ?? upperLegAng) * Math.PI / 180
  const blla = (pose.backLowerLeg ?? lowerLegAng) * Math.PI / 180
  const hipL: V3 = add(hip, [0, 0, -0.09])
  const backKnee: V3 = add(hipL, [Math.sin(bula) * upperLegLen, -Math.cos(bula) * upperLegLen, -0.09])
  const backAnkle: V3 = add(backKnee, [Math.sin(blla) * lowerLegLen, -Math.cos(blla) * lowerLegLen, -0.09])

  // Pelvis (small extension below hip for visual)
  const pelvis: V3 = add(hip, mul(norm(sub(hip, shoulder)), 0.08))

  return { head, neck, shoulder, hip, pelvis, elbow, wrist, backElbow, backWrist, knee, ankle, backKnee, backAnkle }
}

// ============================================================
// Drawing primitives
// ============================================================
function drawCylinder(
  ctx: CanvasRenderingContext2D,
  A: V3, B: V3, radius: number, depth: number,
  W: number, H: number, S: number, X0: number, Y0: number,
  hot: boolean,
) {
  // Compute direction and perpendicular
  const dir = sub(B, A)
  const L = len(dir)
  if (L < 0.001) return
  const ux = dir[0] / L
  const uy = dir[1] / L
  const uz = dir[2] / L
  // Perpendicular (in screen plane, z-axis is "out of screen")
  // For side view, perpendicular is in the z direction
  const px = 0, py = 0, pz = 1

  const segments = 12
  const rings: [number, number, number][][] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const center: V3 = [A[0] + dir[0] * t, A[1] + dir[1] * t, A[2] + dir[2] * t]
    const ring: [number, number, number][] = []
    const ringR = 8 // circumference segments
    for (let j = 0; j < ringR; j++) {
      const ang = (j / ringR) * Math.PI * 2
      // Point on circle perpendicular to axis
      const cx = Math.cos(ang) * radius
      const cz = Math.sin(ang) * radius
      // Rotate so circle is perpendicular to axis (simplified — just use z-axis for side view)
      const point: V3 = [center[0], center[1], center[2] + cz]
      const projected = project(point, W, H, S, X0, Y0)
      ring.push(projected)
    }
    rings.push(ring)
  }

  // Draw wireframe lines
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j < 8; j++) {
      const a = rings[i][j]
      const b = rings[i][(j + 1) % 8]
      // Depth-based brightness
      const depthAvg = (a[2] + b[2]) / 2
      const brightness = Math.max(0.05, Math.min(0.95, 0.5 + depthAvg * 0.8))
      if (hot) {
        ctx.strokeStyle = `rgba(255, 140, 50, ${brightness * 0.9})`
      } else {
        ctx.strokeStyle = `rgba(245, 245, 245, ${brightness * 0.7})`
      }
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(a[0], a[1])
      ctx.lineTo(b[0], b[1])
      ctx.stroke()
      // Longitudinal lines (only between rings, not closing the circle)
      if (i < segments) {
        const c = rings[i + 1][j]
        const dAvg = (a[2] + c[2]) / 2
        const b2 = Math.max(0.05, Math.min(0.95, 0.5 + dAvg * 0.8))
        if (hot) {
          ctx.strokeStyle = `rgba(255, 140, 50, ${b2 * 0.7})`
        } else {
          ctx.strokeStyle = `rgba(245, 245, 245, ${b2 * 0.5})`
        }
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(c[0], c[1])
        ctx.stroke()
      }
    }
  }
}

function drawSphere(
  ctx: CanvasRenderingContext2D,
  center: V3, radius: number,
  W: number, H: number, S: number, X0: number, Y0: number,
  hot: boolean,
) {
  const latSegs = 8
  const lonSegs = 12
  const rings: [number, number, number][][] = []

  for (let i = 0; i <= latSegs; i++) {
    const ph = -Math.PI / 2 + (Math.PI * i) / latSegs
    const row: [number, number, number][] = []
    for (let j = 0; j < lonSegs; j++) {
      const th = (j / lonSegs) * Math.PI * 2
      const point: V3 = [
        center[0] + radius * Math.cos(ph) * Math.cos(th),
        center[1] + radius * Math.sin(ph),
        center[2] + radius * Math.cos(ph) * Math.sin(th),
      ]
      row.push(project(point, W, H, S, X0, Y0))
    }
    rings.push(row)
  }

  for (let i = 0; i <= latSegs; i++) {
    for (let j = 0; j < lonSegs; j++) {
      const a = rings[i][j]
      const b = rings[i][(j + 1) % lonSegs]
      const depthAvg = (a[2] + b[2]) / 2
      const brightness = Math.max(0.05, Math.min(0.95, 0.5 + depthAvg * 0.8))
      if (hot) {
        ctx.strokeStyle = `rgba(255, 140, 50, ${brightness * 0.85})`
      } else {
        ctx.strokeStyle = `rgba(245, 245, 245, ${brightness * 0.65})`
      }
      ctx.lineWidth = 0.7
      ctx.beginPath()
      ctx.moveTo(a[0], a[1])
      ctx.lineTo(b[0], b[1])
      ctx.stroke()
      if (i < latSegs) {
        const c = rings[i + 1][j]
        const dAvg = (a[2] + c[2]) / 2
        const b2 = Math.max(0.05, Math.min(0.95, 0.5 + dAvg * 0.8))
        if (hot) {
          ctx.strokeStyle = `rgba(255, 140, 50, ${b2 * 0.6})`
        } else {
          ctx.strokeStyle = `rgba(245, 245, 245, ${b2 * 0.45})`
        }
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(c[0], c[1])
        ctx.stroke()
      }
    }
  }
}

// ============================================================
// Main canvas component
// ============================================================
export function CanvasWireframeFigure({ animation }: { animation: Animation }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0, S = 0, X0 = 0, Y0 = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!canvas || !ctx) return
      W = canvas.clientWidth
      H = canvas.clientHeight
      if (W === 0 || H === 0) {
        // Layout not ready yet — retry after a frame
        requestAnimationFrame(resize)
        return
      }
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      S = Math.min(H * 0.36, W * 0.62)
      X0 = W / 2 + S * 0.02
      Y0 = H * 0.88  // ground line near bottom — figure stands on it, extends UP
    }
    resize()
    window.addEventListener('resize', resize)

    function ease(x: number): number {
      return x * x * (3 - 2 * x)
    }

    function lerp(a: number, b: number, t: number): number {
      return a + (b - a) * t
    }

    function lerpAngle(a: number, b: number, t: number): number {
      let diff = b - a
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      return a + diff * t
    }

    function interpolatePose(a: Pose, b: Pose, t: number): Pose {
      const out: Pose = {}
      const keys: (keyof Pose)[] = [
        'bodyX', 'bodyY', 'torsoAngle',
        'upperArm', 'forearm', 'backUpperArm', 'backForearm',
        'upperLeg', 'lowerLeg', 'backUpperLeg', 'backLowerLeg',
        'headTilt', 'intensity',
      ]
      for (const k of keys) {
        const av = (a as Record<string, number | undefined>)[k as string] ?? 0
        const bv = (b as Record<string, number | undefined>)[k as string] ?? 0
        if (k === 'torsoAngle' || k === 'upperArm' || k === 'forearm' || k === 'backUpperArm' || k === 'backForearm' || k === 'upperLeg' || k === 'lowerLeg' || k === 'backUpperLeg' || k === 'backLowerLeg' || k === 'headTilt') {
          out[k] = lerpAngle(av, bv, t)
        } else {
          out[k] = lerp(av, bv, t)
        }
      }
      return out
    }

    function frame(now: number) {
      if (!ctx || !canvas) return
      if (startRef.current === null) startRef.current = now
      const elapsed = (now - startRef.current) % animation.duration
      const progress = elapsed / animation.duration

      // Interpolate pose
      const numPoses = animation.poses.length
      let pose: Pose
      if (numPoses === 1) {
        pose = animation.poses[0]
      } else {
        const scaledPos = progress * numPoses
        const idx = Math.floor(scaledPos) % numPoses
        const nextIdx = (idx + 1) % numPoses
        const t = scaledPos - Math.floor(scaledPos)
        const easedT = ease(t)
        pose = interpolatePose(animation.poses[idx], animation.poses[nextIdx], easedT)
      }

      // Clear with dark background
      ctx.fillStyle = '#1a1a1c'
      ctx.fillRect(0, 0, W, H)

      // Ground ellipse + radial halo
      const grad = ctx.createRadialGradient(X0, Y0, 0, X0, Y0, S)
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.06)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(X0, Y0, S * 0.95, S * 0.16, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(X0, Y0, S * 0.7, S * 0.11, 0, 0, Math.PI * 2)
      ctx.stroke()

      // Compute joints
      const j = computeJoints(pose)
      const intensity = pose.intensity ?? 0

      // Determine which limbs are "hot" (working) based on target muscle group
      const target = animation.target
      const frontLegHot = target === 'legs' || target === 'glutes'
      const backLegHot = target === 'legs' || target === 'glutes'
      const frontArmHot = target === 'chest' || target === 'shoulders' || target === 'triceps' || target === 'biceps'
      const backArmHot = target === 'back' || target === 'biceps'

      // Draw back limbs first (dimmer)
      drawCylinder(ctx, j.hip, j.backKnee, 0.07, 0, W, H, S, X0, Y0, backLegHot && intensity > 0.3)
      drawCylinder(ctx, j.backKnee, j.backAnkle, 0.05, 0, W, H, S, X0, Y0, backLegHot && intensity > 0.3)
      drawSphere(ctx, j.backKnee, 0.055, W, H, S, X0, Y0, backLegHot && intensity > 0.3)

      drawCylinder(ctx, j.shoulder, j.backElbow, 0.04, 0, W, H, S, X0, Y0, backArmHot && intensity > 0.3)
      drawCylinder(ctx, j.backElbow, j.backWrist, 0.035, 0, W, H, S, X0, Y0, backArmHot && intensity > 0.3)
      drawSphere(ctx, j.backElbow, 0.04, W, H, S, X0, Y0, backArmHot && intensity > 0.3)

      // Torso
      drawCylinder(ctx, j.hip, j.shoulder, 0.09, 0, W, H, S, X0, Y0, target === 'core' || target === 'chest' || target === 'back')
      drawSphere(ctx, j.shoulder, 0.07, W, H, S, X0, Y0, target === 'shoulders')
      drawSphere(ctx, j.hip, 0.085, W, H, S, X0, Y0, target === 'glutes' || target === 'core')

      // Neck + head
      drawCylinder(ctx, j.shoulder, j.neck, 0.035, 0, W, H, S, X0, Y0, false)
      drawSphere(ctx, j.head, 0.075, W, H, S, X0, Y0, false)

      // Front leg
      drawCylinder(ctx, j.hip, j.knee, 0.08, 0, W, H, S, X0, Y0, frontLegHot && intensity > 0.3)
      drawCylinder(ctx, j.knee, j.ankle, 0.06, 0, W, H, S, X0, Y0, frontLegHot && intensity > 0.3)
      drawSphere(ctx, j.knee, 0.065, W, H, S, X0, Y0, frontLegHot && intensity > 0.3)

      // Front arm
      drawCylinder(ctx, j.shoulder, j.elbow, 0.045, 0, W, H, S, X0, Y0, frontArmHot && intensity > 0.3)
      drawCylinder(ctx, j.elbow, j.wrist, 0.038, 0, W, H, S, X0, Y0, frontArmHot && intensity > 0.3)
      drawSphere(ctx, j.elbow, 0.042, W, H, S, X0, Y0, frontArmHot && intensity > 0.3)

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [animation])

  // If animation prop changes (e.g. user navigates to a new exercise),
  // React reuses this component instance, so the useEffect above runs
  // again because animation is in the dep array. The cleanup cancels
  // the previous RAF and starts a new one. Good.
  //
  // The animation prop comes from getExerciseAnimation(exerciseId) which
  // returns a stable object reference per exerciseId, so unnecessary
  // re-renders are avoided.

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
