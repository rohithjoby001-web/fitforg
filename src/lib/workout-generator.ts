// ============================================================
// Workout Plan Generator
// ============================================================
// Generates a 7-day rotating workout plan based on available equipment.
// Each day has a different focus to avoid overtraining and keep things fresh.
// Deterministic: same equipment + same seed = same plan (so users can repeat).
// ============================================================

import {
  Exercise,
  EquipmentId,
  MuscleGroup,
  EXERCISES,
  filterByEquipment,
  byMuscle,
} from './exercises'

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface DayPlan {
  key: DayKey
  label: string
  shortLabel: string
  focus: string
  rest: boolean
  exercises: Exercise[]
}

export interface WorkoutPlan {
  equipment: EquipmentId[]
  days: DayPlan[] // 7 entries
  createdAt: number
}

const DAY_META: { key: DayKey; label: string; shortLabel: string }[] = [
  { key: 'mon', label: 'Monday', shortLabel: 'Mon' },
  { key: 'tue', label: 'Tuesday', shortLabel: 'Tue' },
  { key: 'wed', label: 'Wednesday', shortLabel: 'Wed' },
  { key: 'thu', label: 'Thursday', shortLabel: 'Thu' },
  { key: 'fri', label: 'Friday', shortLabel: 'Fri' },
  { key: 'sat', label: 'Saturday', shortLabel: 'Sat' },
  { key: 'sun', label: 'Sunday', shortLabel: 'Sun' },
]

// Deterministic pseudo-random based on a string seed (mulberry32)
function seededRandom(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(arr: T[], n: number, rand: () => number): T[] {
  const pool = [...arr]
  const out: T[] = []
  while (pool.length && out.length < n) {
    const idx = Math.floor(rand() * pool.length)
    out.push(pool.splice(idx, 1)[0])
  }
  return out
}

// ============================================================
// Weekly template — 7 day focuses
// Push/Pull/Legs + Upper/Lower split with rest days + full-body + mobility
// ============================================================
interface DayFocus {
  focus: string
  muscles: MuscleGroup[]
  count: number
  rest: boolean
}

const WEEK_TEMPLATE: DayFocus[] = [
  { focus: 'Push Day (Chest · Shoulders · Triceps)', muscles: ['chest', 'shoulders', 'triceps'], count: 6, rest: false },
  { focus: 'Pull Day (Back · Biceps)', muscles: ['back', 'biceps'], count: 5, rest: false },
  { focus: 'Leg Day', muscles: ['legs'], count: 5, rest: false },
  { focus: 'Upper Body (Push + Pull)', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'], count: 6, rest: false },
  { focus: 'Core & Cardio', muscles: ['core', 'cardio'], count: 6, rest: false },
  { focus: 'Full Body Conditioning', muscles: ['legs', 'chest', 'back', 'shoulders'], count: 6, rest: false },
  { focus: 'Active Recovery & Mobility', muscles: ['mobility'], count: 5, rest: true },
]

// Build one day: distribute `count` exercises across the listed muscle groups
function buildDay(focus: DayFocus, available: Exercise[], rand: () => number): Exercise[] {
  if (focus.rest) {
    return pick(focus.muscles.flatMap(m => byMuscle(available, m)), focus.count, rand)
  }
  // Group available exercises by muscle so we get a balanced day
  const perMuscle = available
    .filter(ex => focus.muscles.includes(ex.muscle))
  // Distribute count across muscles as evenly as possible
  const grouped: Record<string, Exercise[]> = {}
  for (const m of focus.muscles) grouped[m] = []
  for (const ex of perMuscle) {
    if (!grouped[ex.muscle]) grouped[ex.muscle] = []
    grouped[ex.muscle].push(ex)
  }
  // How many exercises per muscle (rounded up, then trimmed)
  const musclesWithEx = Object.keys(grouped).filter(m => grouped[m].length > 0)
  if (musclesWithEx.length === 0) return []

  const out: Exercise[] = []
  // First pass: one exercise per muscle that has any
  for (const m of musclesWithEx) {
    const pickOne = pick(grouped[m], 1, rand)[0]
    if (pickOne) {
      out.push(pickOne)
      grouped[m] = grouped[m].filter(e => e.id !== pickOne.id)
    }
    if (out.length >= focus.count) return out
  }
  // Second pass: keep picking one from each muscle until count met
  let safety = 0
  while (out.length < focus.count && safety < 50) {
    for (const m of musclesWithEx) {
      if (out.length >= focus.count) break
      if (grouped[m].length === 0) continue
      const pickOne = pick(grouped[m], 1, rand)[0]
      if (pickOne && !out.find(e => e.id === pickOne.id)) {
        out.push(pickOne)
        grouped[m] = grouped[m].filter(e => e.id !== pickOne.id)
      }
    }
    safety++
  }
  return out
}

// ============================================================
// Main generator: produces a deterministic 7-day plan
// Equipment + weekOffset (week number) seed the RNG so each week differs
// ============================================================
export function generatePlan(equipment: EquipmentId[], weekOffset = 0): WorkoutPlan {
  const available = filterByEquipment(EXERCISES, equipment)
  const seedStr = `${equipment.sort().join(',')}|${weekOffset}`
  const rand = seededRandom(hashString(seedStr))

  const days: DayPlan[] = DAY_META.map((meta, i) => {
    const focus = WEEK_TEMPLATE[i]
    const exercises = buildDay(focus, available, rand)
    return {
      key: meta.key,
      label: meta.label,
      shortLabel: meta.shortLabel,
      focus: focus.focus,
      rest: focus.rest,
      exercises,
    }
  })

  return {
    equipment,
    days,
    createdAt: Date.now(),
  }
}

// Helper: get today's plan based on JS day of week (0=Sun ... 6=Sat)
export function getTodayKey(): DayKey {
  const map: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return map[new Date().getDay()]
}

export function getTodayPlan(plan: WorkoutPlan): DayPlan {
  const today = getTodayKey()
  return plan.days.find(d => d.key === today) ?? plan.days[0]
}
