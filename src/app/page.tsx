'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Check,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  EQUIPMENT,
  EquipmentId,
  Exercise,
  EXERCISES,
  filterByEquipment,
} from '@/lib/exercises'
import {
  WorkoutPlan,
  generatePlan,
  getTodayKey,
  getTodayPlan,
  DayKey,
  DayPlan,
} from '@/lib/workout-generator'
import { FitforgLogo } from '@/components/fitforg-logo'
import { PWAInstallBanner } from '@/components/pwa-install-banner'
import { ExerciseAnimationView } from '@/components/exercise-animation'

type TabKey = 'today' | 'week' | 'gear'

// Editorial copy — rotating discipline quotes per day-of-week
const DAY_QUOTES: Record<DayKey, { quote: string; source: string }> = {
  mon: { quote: 'Discipline is choosing what you want most over what you want now.', source: '— Abraham Lincoln' },
  tue: { quote: "Don't count the days. Make the days count.", source: '— Muhammad Ali' },
  wed: { quote: 'The body achieves what the mind believes.', source: '— Napoleon Hill' },
  thu: { quote: "Strength does not come from winning. Your struggles develop your strengths.", source: '— Arnold Schwarzenegger' },
  fri: { quote: "We are what we repeatedly do. Excellence is not an act, but a habit.", source: '— Aristotle' },
  sat: { quote: "The pain you feel today is the strength you feel tomorrow.", source: '— Anonymous' },
  sun: { quote: "Rest is not idleness. Recovery is part of the work.", source: '— fitforg' },
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'CHEST',
  back: 'BACK',
  shoulders: 'SHOULDERS',
  biceps: 'BICEPS',
  triceps: 'TRICEPS',
  legs: 'LEGS',
  core: 'CORE',
  cardio: 'CARDIO',
  mobility: 'MOBILITY',
}

export default function Home() {
  const [equipment, setEquipment, eqReady] = useLocalStorage<EquipmentId[]>(
    'fitforg:equipment',
    ['bodyweight', 'dumbbells', 'pushupRod']
  )
  const [weekOffset, setWeekOffset] = useLocalStorage<number>('fitforg:week', 0)
  const [completed, setCompleted] = useLocalStorage<Record<string, boolean>>('fitforg:completed', {})
  const [lastWorkoutDate, setLastWorkoutDate] = useLocalStorage<string>('fitforg:lastWorkout', '')
  const [streak, setStreak] = useLocalStorage<number>('fitforg:streak', 0)
  const [tab, setTab] = useState<TabKey>('today')

  const ready = eqReady

  const plan: WorkoutPlan | null = useMemo(() => {
    if (!ready) return null
    if (equipment.length === 0) return null
    return generatePlan(equipment, weekOffset)
  }, [equipment, weekOffset, ready])

  const todayKey = getTodayKey()
  const today: DayPlan | null = plan ? getTodayPlan(plan) : null

  const completedCount = useMemo(() => {
    if (!today) return 0
    return today.exercises.filter(ex => completed[`${todayKey}:${ex.id}`]).length
  }, [today, completed, todayKey])

  const totalToday = today?.exercises.length ?? 0
  const progressPct = totalToday > 0 ? Math.round((completedCount / totalToday) * 100) : 0

  function toggleComplete(dayKey: DayKey, exId: string) {
    const key = `${dayKey}:${exId}`
    setCompleted(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (!prev[key] && dayKey === todayKey) {
        const todayStr = new Date().toDateString()
        if (lastWorkoutDate !== todayStr) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          if (lastWorkoutDate === yesterday.toDateString()) {
            setStreak(streak + 1)
          } else {
            setStreak(1)
          }
          setLastWorkoutDate(todayStr)
        }
      }
      return next
    })
  }

  function resetToday() {
    if (!today) return
    const next = { ...completed }
    for (const ex of today.exercises) delete next[`${todayKey}:${ex.id}`]
    setCompleted(next)
  }

  function resetAll() {
    setCompleted({})
    setStreak(0)
    setLastWorkoutDate('')
  }

  function nextWeek() {
    setWeekOffset(weekOffset + 1)
    setCompleted({})
  }

  function prevWeek() {
    setWeekOffset(Math.max(0, weekOffset - 1))
    setCompleted({})
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse label-meta text-muted-foreground">LOADING</div>
      </div>
    )
  }

  if (equipment.length === 0) {
    return <OnboardingScreen equipment={equipment} setEquipment={setEquipment} />
  }

  return (
    <>

      <div className="min-h-screen flex flex-col bg-background">
        {/* Header — minimal, no logo (splash already showed it) */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-5 py-3.5 flex items-center justify-between">
            <span className="font-display text-lg tracking-tight"><b>FIT</b>FORG</span>
            {streak > 0 && (
              <div className="flex items-center gap-2 px-2.5 py-1 border border-border">
                <span className="label-eyebrow text-muted-foreground">STREAK</span>
                <span className="label-data text-sm font-semibold tabular-nums">{streak}d</span>
              </div>
            )}
          </div>
        </header>

      {/* PWA install / update banner — auto-hides when nothing to show */}
      <PWAInstallBanner />

      {/* Main */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-5 py-6 pb-32">
        {tab === 'today' && today && (
          <TodayView
            today={today}
            dayKey={todayKey}
            completed={completed}
            onToggle={toggleComplete}
            progressPct={progressPct}
            completedCount={completedCount}
            totalToday={totalToday}
            onResetToday={resetToday}
            streak={streak}
            weekLabel={`WK ${String(weekOffset + 1).padStart(2, '0')}`}
          />
        )}
        {tab === 'today' && !today && <EmptyPlanNotice />}
        {tab === 'week' && plan && (
          <WeekView
            plan={plan}
            todayKey={todayKey}
            completed={completed}
            weekOffset={weekOffset}
            onNextWeek={nextWeek}
            onPrevWeek={prevWeek}
          />
        )}
        {tab === 'gear' && (
          <GearView
            equipment={equipment}
            setEquipment={setEquipment}
            onResetAll={resetAll}
            weekOffset={weekOffset}
            onNextWeek={nextWeek}
          />
        )}
      </main>

      {/* Bottom Tab Bar — minimal, hairline divider */}
      <nav className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-3xl px-2 py-2 grid grid-cols-3 gap-0">
          <TabButton active={tab === 'today'} onClick={() => setTab('today')} label="TODAY" index="01" />
          <TabButton active={tab === 'week'} onClick={() => setTab('week')} label="WEEK" index="02" />
          <TabButton active={tab === 'gear'} onClick={() => setTab('gear')} label="GEAR" index="03" />
        </div>
      </nav>
      </div>
    </>
  )
}

// ============================================================
// Onboarding
// ============================================================
function OnboardingScreen({
  equipment,
  setEquipment,
}: {
  equipment: EquipmentId[]
  setEquipment: (e: EquipmentId[]) => void
}) {
  const [local, setLocal] = useState<EquipmentId[]>(equipment)

  function toggle(id: EquipmentId) {
    setLocal(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const exerciseCount = filterByEquipment(EXERCISES, local).length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 mx-auto max-w-3xl w-full px-5 py-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8">
            <FitforgLogo size={64} />
            <span className="font-display text-3xl tracking-tight"><b>FIT</b>FORG</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight mb-5">
            Pick your gear.
            <br />
            <em className="italic font-normal text-muted-foreground">Show up.</em>{' '}
            <span className="font-display">Repeat.</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Tell us what equipment you actually have. We'll build a different workout for
            every day of the week using only that gear. No fluff. No upgrades. No accounts.
          </p>
        </div>

        {/* Equipment picker */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
            <h2 className="impact text-lg">YOUR ARSENAL</h2>
            <p className="label-meta text-muted-foreground tabular-nums">
              {String(local.length).padStart(2, '0')} / {String(EQUIPMENT.length).padStart(2, '0')} SELECTED
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {EQUIPMENT.map((eq, i) => {
              const checked = local.includes(eq.id)
              return (
                <button
                  key={eq.id}
                  onClick={() => toggle(eq.id)}
                  type="button"
                  aria-pressed={checked}
                  className={`w-full flex items-center gap-4 px-2 py-3.5 text-left transition-colors ${
                    checked ? 'bg-foreground/5' : 'hover:bg-foreground/[0.03]'
                  }`}
                >
                  <span className="label-data text-[11px] text-muted-foreground w-8 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-2xl leading-none w-8 shrink-0 grayscale">{eq.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold uppercase tracking-wide ${checked ? '' : 'text-foreground'}`}>
                      {eq.label}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{eq.description}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`grid place-items-center h-5 w-5 border shrink-0 transition-all ${
                      checked ? 'bg-foreground border-foreground text-background' : 'border-muted-foreground'
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats line */}
        <div className="flex items-center justify-between mb-6 py-4 border-y border-border">
          <div>
            <p className="label-eyebrow text-muted-foreground">UNLOCKED</p>
            <p className="label-data text-2xl font-semibold mt-1 tabular-nums">{exerciseCount} MOVES</p>
          </div>
          <div className="text-right">
            <p className="label-eyebrow text-muted-foreground">COST</p>
            <p className="label-data text-2xl font-semibold mt-1 tabular-nums">$0.00</p>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-base tracking-wide uppercase font-bold rounded-none"
          disabled={local.length === 0}
          onClick={() => setEquipment(local)}
        >
          Build my plan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-center label-eyebrow text-muted-foreground mt-4">
          NO ACCOUNTS · NO ADS · WORKS OFFLINE · STAYS ON YOUR DEVICE
        </p>
      </div>
    </div>
  )
}

// ============================================================
// Today View
// ============================================================
function TodayView({
  today,
  dayKey,
  completed,
  onToggle,
  progressPct,
  completedCount,
  totalToday,
  onResetToday,
  streak,
  weekLabel,
}: {
  today: DayPlan
  dayKey: DayKey
  completed: Record<string, boolean>
  onToggle: (k: DayKey, id: string) => void
  progressPct: number
  completedCount: number
  totalToday: number
  onResetToday: () => void
  streak: number
  weekLabel: string
}) {
  const isRestDay = today.rest
  const estMinutes = Math.ceil(
    today.exercises.reduce((s, ex) => s + ex.sets * 45 + ex.rest * (ex.sets - 1), 0) / 60
  )
  const dayQuote = DAY_QUOTES[today.key]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div>
        <p className="label-eyebrow text-muted-foreground mb-3">
          {weekLabel} · {isRestDay ? 'RECOVERY' : 'TODAY'}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[0.95] mb-2">
          {today.label}.
        </h1>
        <p className="font-display italic text-xl text-muted-foreground leading-snug">{today.focus}.</p>
      </div>

      {/* Stats strip — minimalist data row */}
      <div className="grid grid-cols-3 gap-0 border-y border-border">
        <Stat label="MOVES" value={`${totalToday}`} />
        <Stat label="TIME" value={`${estMinutes}m`} divider />
        <Stat label="DONE" value={`${completedCount}/${totalToday}`} divider />
      </div>

      {/* Progress — dashed/segregated */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label-meta text-muted-foreground">PROGRESS</span>
          <span className="label-data text-sm font-semibold tabular-nums">{progressPct}%</span>
        </div>
        <DashedProgress value={progressPct} total={totalToday} completed={completedCount} />
        {completedCount > 0 && (
          <button
            onClick={onResetToday}
            className="ghost-text label-eyebrow mt-3 inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> RESET TODAY
          </button>
        )}
      </div>

      {/* Exercise list */}
      <div className="space-y-0 divide-y divide-border border-y border-border">
        {today.exercises.length === 0 && (
          <div className="py-10 text-center">
            <p className="label-eyebrow text-muted-foreground">NO MATCHES</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add more gear in the GEAR tab to unlock exercises for this day.
            </p>
          </div>
        )}
        {today.exercises.map((ex, i) => (
          <ExerciseRow
            key={`${today.key}:${ex.id}`}
            exercise={ex}
            index={i + 1}
            dayKey={dayKey}
            completed={!!completed[`${dayKey}:${ex.id}`]}
            onToggle={() => onToggle(dayKey, ex.id)}
          />
        ))}
      </div>

      {/* Editorial quote — discipline moment */}
      <div className="pt-4">
        <blockquote className="font-display italic text-lg text-muted-foreground leading-snug">
          &ldquo;{dayQuote.quote}&rdquo;
        </blockquote>
        <p className="label-meta text-muted-foreground mt-2">{dayQuote.source}</p>
      </div>
    </div>
  )
}

function Stat({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <div className={`px-3 py-3 ${divider ? 'border-l border-border' : ''}`}>
      <p className="label-eyebrow text-muted-foreground mb-1.5">{label}</p>
      <p className="label-data text-2xl font-semibold tabular-nums leading-none">{value}</p>
    </div>
  )
}

// Segmented progress bar — like the staircase-of-progress reference image
function DashedProgress({ value, total, completed }: { value: number; total: number; completed: number }) {
  if (total === 0) return null
  const segments = total
  return (
    <div className="flex gap-1 h-2">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 transition-colors duration-300 ${
            i < completed ? 'bg-foreground' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-border" />
}

// ============================================================
// Exercise row — editorial style
// ============================================================
function ExerciseRow({
  exercise,
  index,
  dayKey: _dayKey,
  completed,
  onToggle,
}: {
  exercise: Exercise
  index: number
  dayKey: DayKey
  completed: boolean
  onToggle: () => void
}) {
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className={`group transition-colors ${completed ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-4 px-2 py-4">
        <button
          onClick={onToggle}
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          className={`mt-0.5 grid place-items-center h-7 w-7 border shrink-0 transition-all ${
            completed
              ? 'bg-foreground border-foreground text-background'
              : 'border-muted-foreground hover:border-foreground'
          }`}
        >
          {completed && <Check className="h-4 w-4" strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="label-data text-[11px] text-muted-foreground tabular-nums">
              {String(index).padStart(2, '0')}
            </span>
            <h3 className={`text-base font-semibold tracking-tight ${completed ? 'line-through decoration-1' : ''}`}>
              {exercise.name}
            </h3>
          </div>
          {/* Muscle tag — minimal uppercase */}
          <span className="label-eyebrow text-muted-foreground inline-block">
            {MUSCLE_LABELS[exercise.muscle]} · {exercise.type.toUpperCase()} · {exercise.level.toUpperCase()}
          </span>
          {/* Stats row — mono data */}
          <div className="flex items-center gap-5 mt-3">
            <DataStat label="SETS" value={`${exercise.sets}`} />
            <DataStat label="REPS" value={exercise.reps} />
            <DataStat label="REST" value={`${exercise.rest}s`} />
          </div>

          {/* Animation — always visible, loops forever */}
          <div className="mt-4">
            <p className="label-eyebrow text-muted-foreground mb-2">DEMONSTRATION</p>
            <ExerciseAnimationView exerciseId={exercise.id} />
          </div>

          {/* Optional text instructions — tap to show */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="ghost-text label-eyebrow mt-3 inline-flex items-center hover:text-foreground transition-colors"
          >
            {showInfo ? '− HIDE NOTES' : '+ COACH NOTES'}
          </button>
          {showInfo && (
            <p className="fade-up text-xs text-muted-foreground mt-2 leading-relaxed border-l border-border pl-3">
              {exercise.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function DataStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-eyebrow text-muted-foreground mb-0.5">{label}</p>
      <p className="label-data text-sm font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function EmptyPlanNotice() {
  return (
    <div className="py-20 text-center">
      <p className="label-eyebrow text-muted-foreground mb-2">NOTHING TO SHOW</p>
      <p className="font-display italic text-2xl text-muted-foreground">
        Pick your gear in the GEAR tab to begin.
      </p>
    </div>
  )
}

// ============================================================
// Week View
// ============================================================
function WeekView({
  plan,
  todayKey,
  completed,
  weekOffset,
  onNextWeek,
  onPrevWeek,
}: {
  plan: WorkoutPlan
  todayKey: DayKey
  completed: Record<string, boolean>
  weekOffset: number
  onNextWeek: () => void
  onPrevWeek: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-5xl font-semibold tracking-tight leading-none">
          The week.
        </h1>
        <div className="text-right">
          <p className="label-data text-3xl font-semibold tabular-nums leading-none">
            WK{String(weekOffset + 1).padStart(2, '0')}
          </p>
          <p className="label-eyebrow text-muted-foreground mt-1">ROTATION</p>
        </div>
      </div>

      {/* Week navigation — brutalist arrows */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevWeek}
          disabled={weekOffset === 0}
          className="rounded-none h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4" /> PREV
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onNextWeek}
          className="rounded-none h-9 px-3"
        >
          NEXT <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <p className="label-meta text-muted-foreground tabular-nums">
          {plan.days.reduce((s, d) => s + d.exercises.length, 0)} MOVES TOTAL
        </p>
      </div>

      {/* Day list — left-aligned editorial */}
      <div className="space-y-0 divide-y divide-border border-y border-border">
        {plan.days.map((day, i) => {
          const isToday = day.key === todayKey
          const doneCount = day.exercises.filter(ex => completed[`${day.key}:${ex.id}`]).length
          const total = day.exercises.length
          const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
          return (
            <div key={day.key} className={`px-2 py-4 ${isToday ? 'bg-foreground/[0.04]' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 text-center">
                  <p className="label-eyebrow text-muted-foreground mb-1">{String(i + 1).padStart(2, '0')}</p>
                  <p className={`impact text-xl leading-none ${isToday ? '' : 'text-muted-foreground'}`}>
                    {day.shortLabel.toUpperCase()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight leading-tight">
                      {day.label}.
                    </h3>
                    {isToday && (
                      <span className="label-eyebrow border border-foreground px-1.5 py-0.5">TODAY</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic font-display">
                    {day.focus}.
                  </p>
                  {/* Muscle tags — deduplicated with counts */}
                  {(() => {
                    const counts: Record<string, number> = {}
                    day.exercises.forEach(ex => {
                      counts[ex.muscle] = (counts[ex.muscle] || 0) + 1
                    })
                    const tags = Object.entries(counts).slice(0, 5)
                    return (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                        {tags.map(([muscle, count], j) => (
                          <span key={muscle} className="label-eyebrow text-muted-foreground">
                            {count > 1 ? `${count}× ` : ''}{MUSCLE_LABELS[muscle]}{j < tags.length - 1 ? ' ·' : ''}
                          </span>
                        ))}
                      </div>
                    )
                  })()}
                  {/* Mini progress bar */}
                  {total > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex gap-0.5 h-1">
                        {Array.from({ length: total }).map((_, k) => (
                          <div
                            key={k}
                            className={`flex-1 ${k < doneCount ? 'bg-foreground' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="label-data text-xs font-semibold tabular-nums">
                        {String(doneCount).padStart(2, '0')}/{String(total).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// Gear View
// ============================================================
function GearView({
  equipment,
  setEquipment,
  onResetAll,
  weekOffset,
  onNextWeek,
}: {
  equipment: EquipmentId[]
  setEquipment: (e: EquipmentId[]) => void
  onResetAll: () => void
  weekOffset: number
  onNextWeek: () => void
}) {
  function toggle(id: EquipmentId) {
    setEquipment(equipment.includes(id) ? equipment.filter(x => x !== id) : [...equipment, id])
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-5xl font-semibold tracking-tight leading-none mb-2">
          Your gear.
        </h1>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          Update anytime. Plan rebuilds instantly.
        </p>
      </div>

      {/* Equipment list */}
      <div>
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
          <h2 className="impact text-base">ARSENAL</h2>
          <p className="label-meta text-muted-foreground tabular-nums">
            {String(equipment.length).padStart(2, '0')} ACTIVE
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {EQUIPMENT.map((eq, i) => {
            const checked = equipment.includes(eq.id)
            return (
              <button
                key={eq.id}
                onClick={() => toggle(eq.id)}
                type="button"
                aria-pressed={checked}
                className={`w-full flex items-center gap-4 px-2 py-3.5 text-left transition-colors ${
                  checked ? 'bg-foreground/5' : 'hover:bg-foreground/[0.03]'
                }`}
              >
                <span className="label-data text-[11px] text-muted-foreground w-8 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xl leading-none w-7 shrink-0 grayscale">{eq.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold uppercase tracking-wide">{eq.label}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{eq.description}</p>
                </div>
                <span
                  aria-hidden="true"
                  className={`grid place-items-center h-5 w-5 border shrink-0 transition-all ${
                    checked ? 'bg-foreground border-foreground text-background' : 'border-muted-foreground'
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Plan rotation */}
      <div>
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
          <h2 className="impact text-base">ROTATION</h2>
          <p className="label-meta text-muted-foreground">WK{String(weekOffset + 1).padStart(2, '0')}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Generate a fresh set of exercises for next week. Resets today&apos;s progress.
        </p>
        <Button
          onClick={onNextWeek}
          className="w-full h-12 rounded-none uppercase tracking-wide font-bold"
        >
          Get next week's plan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Reset */}
      <div>
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
          <h2 className="impact text-base text-muted-foreground">RESET</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Clears progress, streak, and completed exercises. Equipment selection is kept.
        </p>
        <Button
          variant="outline"
          onClick={onResetAll}
          className="w-full h-12 rounded-none uppercase tracking-wide font-bold"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Reset everything
        </Button>
      </div>

      <div className="text-center py-4">
        <p className="font-display text-sm mb-1"><b>FIT</b>FORG</p>
        <p className="label-eyebrow text-muted-foreground">
          NO ACCOUNTS · NO ADS · OFFLINE
        </p>
      </div>
    </div>
  )
}

// ============================================================
// Tab button — brutalist with index number
// ============================================================
function TabButton({
  active,
  onClick,
  label,
  index,
}: {
  active: boolean
  onClick: () => void
  label: string
  index: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-[48px] transition-colors relative ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <span className={`label-data text-[10px] tabular-nums ${active ? 'opacity-100' : 'opacity-40'}`}>
        {index}
      </span>
      <span className="impact text-[11px] tracking-wider">{label}</span>
      {active && <span className="absolute -top-px left-1/4 right-1/4 h-px bg-foreground" />}
    </button>
  )
}
