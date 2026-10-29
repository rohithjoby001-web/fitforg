'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, RotateCcw, ChevronLeft, ChevronRight, Play, Clock, Dumbbell, TrendingUp, Calendar } from 'lucide-react'
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
import { SplashScreen } from '@/components/splash-screen'
import { ExerciseAnimationView } from '@/components/exercise-animation'

type TabKey = 'today' | 'week' | 'gear'

// Day quotes — keep these for the editorial footer
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
  chest: 'CHEST', back: 'BACK', shoulders: 'SHOULDERS', biceps: 'BICEPS',
  triceps: 'TRICEPS', legs: 'LEGS', core: 'CORE', cardio: 'CARDIO', mobility: 'MOBILITY',
}

// ============================================================
// ACTIVITY HEATMAP — shows last 30 days of workout activity
// Uses the completed exercises localStorage to determine which
// days had activity. Simplified — checks if any exercise was
// marked complete on each day.
// ============================================================
function generateHeatmapData(completed: Record<string, boolean>): { date: Date; active: boolean; isToday: boolean }[] {
  const days: { date: Date; active: boolean; isToday: boolean }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Check if this date had any completed exercises
    // We approximate by checking if the day-of-week key has any completed exercises
    const dayMap: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const dayKey = dayMap[date.getDay()]

    // Check if any completed entry starts with this day key
    // This is approximate — it shows "this day of week has had activity"
    const hasActivity = Object.keys(completed).some(k => k.startsWith(`${dayKey}:`) && completed[k])

    days.push({
      date,
      active: hasActivity,
      isToday: i === 0,
    })
  }
  return days
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
  const heatmapData = useMemo(() => generateHeatmapData(completed), [completed])
  const activeDays = heatmapData.filter(d => d.active).length

  function toggleComplete(dayKey: DayKey, exId: string) {
    const key = `${dayKey}:${exId}`
    setCompleted(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (!prev[key] && dayKey === todayKey) {
        const todayStr = new Date().toDateString()
        if (lastWorkoutDate !== todayStr) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          if (lastWorkoutDate === yesterday.toDateString()) setStreak(streak + 1)
          else setStreak(1)
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

  function nextWeek() { setWeekOffset(weekOffset + 1); setCompleted({}) }
  function prevWeek() { setWeekOffset(Math.max(0, weekOffset - 1)); setCompleted({}) }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse label-eyebrow text-muted-foreground">LOADING</div>
      </div>
    )
  }

  if (equipment.length === 0) {
    return <OnboardingScreen equipment={equipment} setEquipment={setEquipment} />
  }

  return (
    <>
      <SplashScreen />

      <div className="min-h-screen flex flex-col bg-background">
        {/* Header — minimal */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-5 py-3.5 flex items-center justify-between">
            <span className="font-display text-lg tracking-tight"><b>FIT</b>FORG</span>
            {streak > 0 && (
              <div className="flex items-center gap-2 px-2.5 py-1 border border-border rounded-full">
                <span className="label-eyebrow text-muted-foreground">STREAK</span>
                <span className="label-data text-sm font-semibold tabular-nums">{streak}d</span>
              </div>
            )}
          </div>
        </header>

        <PWAInstallBanner />

        <main className="flex-1 mx-auto max-w-3xl w-full px-5 py-6 pb-32">
          {tab === 'today' && today && (
            <PremiumTodayView
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
              heatmapData={heatmapData}
              activeDays={activeDays}
            />
          )}
          {tab === 'today' && !today && <EmptyPlanNotice />}
          {tab === 'week' && plan && (
            <WeekView plan={plan} todayKey={todayKey} completed={completed} weekOffset={weekOffset} onNextWeek={nextWeek} onPrevWeek={prevWeek} />
          )}
          {tab === 'gear' && (
            <GearView equipment={equipment} setEquipment={setEquipment} onResetAll={resetAll} weekOffset={weekOffset} onNextWeek={nextWeek} />
          )}
        </main>

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
// PREMIUM TODAY VIEW — dashboard-style layout
// Inspired by the iOS fitness app reference UI.
// Sections: Hero card → Stats grid → Heatmap → Exercise list
// ============================================================
function PremiumTodayView({
  today, dayKey, completed, onToggle, progressPct, completedCount, totalToday,
  onResetToday, streak, weekLabel, heatmapData, activeDays,
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
  heatmapData: { date: Date; active: boolean; isToday: boolean }[]
  activeDays: number
}) {
  const isRestDay = today.rest
  const estMinutes = Math.ceil(
    today.exercises.reduce((s, ex) => s + ex.sets * 45 + ex.rest * (ex.sets - 1), 0) / 60
  )
  const dayQuote = DAY_QUOTES[today.key]

  // Extract muscle groups for the hero card subtitle
  const muscleGroups = useMemo(() => {
    const counts: Record<string, number> = {}
    today.exercises.forEach(ex => { counts[ex.muscle] = (counts[ex.muscle] || 0) + 1 })
    return Object.keys(counts).map(m => MUSCLE_LABELS[m]).join(' · ')
  }, [today])

  return (
    <div className="space-y-5">
      {/* HERO WORKOUT CARD */}
      <div className="card-premium p-5 animate-count-up">
        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-3">
          <span className="label-eyebrow text-muted-foreground">{weekLabel} · {isRestDay ? 'RECOVERY' : 'TODAY'}</span>
          <span className="label-eyebrow text-muted-foreground">{today.label.toUpperCase()}</span>
        </div>

        {/* Workout type — in a dashed border badge */}
        <div className="border-dashed-premium px-4 py-3 mb-4">
          <h1 className="font-display text-4xl font-bold tracking-tight leading-none">
            {today.focus.split('(')[0].trim()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">{muscleGroups}</p>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{estMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{totalToday} exercises</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{completedCount}/{totalToday} done</span>
          </div>
        </div>

        {/* Start Workout button — white pill CTA */}
        <Button
          className="btn-pill w-full bg-foreground text-background hover:bg-foreground/90"
          onClick={() => {
            // Scroll to the first exercise
            const firstEx = document.querySelector('[data-exercise-row]')
            firstEx?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
        >
          <Play className="h-4 w-4 fill-current" />
          Start Workout
        </Button>
      </div>

      {/* STATS GRID — 3 columns */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Dumbbell className="h-4 w-4" />} label="MOVES" value={`${totalToday}`} />
        <StatCard icon={<Clock className="h-4 w-4" />} label="TIME" value={`${estMinutes}m`} />
        <StatCard icon={<Check className="h-4 w-4" />} label="DONE" value={`${completedCount}`} />
      </div>

      {/* 30-DAY ACTIVITY HEATMAP */}
      <div className="card-premium p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Last 30 days</span>
          </div>
          <span className="label-meta text-muted-foreground tabular-nums">{activeDays} / 30 active</span>
        </div>

        {/* Heatmap grid — 6 columns × 5 rows = 30 cells */}
        <div className="grid grid-cols-6 gap-1.5">
          {heatmapData.map((day, i) => (
            <div
              key={i}
              className={
                day.isToday
                  ? 'heatmap-cell-today'
                  : day.active
                  ? 'heatmap-cell-active'
                  : 'heatmap-cell-empty'
              }
              title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${day.active ? ' — Active' : ''}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="label-eyebrow text-muted-foreground">TODAY'S PROGRESS</span>
            <span className="label-data text-sm font-semibold tabular-nums">{progressPct}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {completedCount > 0 && (
            <button
              onClick={onResetToday}
              className="ghost-text label-eyebrow mt-2.5 inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> RESET
            </button>
          )}
        </div>
      </div>

      {/* EXERCISE LIST */}
      <div className="space-y-0 divide-y divide-border border-y border-border">
        {today.exercises.length === 0 && (
          <div className="py-10 text-center">
            <p className="label-eyebrow text-muted-foreground">NO MATCHES</p>
            <p className="text-sm text-muted-foreground mt-2">Add more gear in the GEAR tab.</p>
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

      {/* Editorial quote */}
      <div className="pt-2">
        <blockquote className="font-display italic text-lg text-muted-foreground leading-snug">
          &ldquo;{dayQuote.quote}&rdquo;
        </blockquote>
        <p className="label-meta text-muted-foreground mt-2">{dayQuote.source}</p>
      </div>
    </div>
  )
}

// ============================================================
// STAT CARD — small dark card with icon + number + label
// ============================================================
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-premium p-3 flex flex-col items-center justify-center gap-1.5">
      <div className="text-muted-foreground">{icon}</div>
      <p className="label-data text-xl font-bold tabular-nums leading-none">{value}</p>
      <p className="label-eyebrow text-muted-foreground">{label}</p>
    </div>
  )
}

// ============================================================
// EXERCISE ROW — same as before, with animation
// ============================================================
function ExerciseRow({
  exercise, index, dayKey: _dayKey, completed, onToggle,
}: {
  exercise: Exercise
  index: number
  dayKey: DayKey
  completed: boolean
  onToggle: () => void
}) {
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className={`group transition-colors ${completed ? 'opacity-50' : ''}`} data-exercise-row>
      <div className="flex items-start gap-4 px-2 py-4">
        <button
          onClick={onToggle}
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          className={`mt-0.5 grid place-items-center h-7 w-7 border shrink-0 transition-all rounded ${
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
          <span className="label-eyebrow text-muted-foreground inline-block">
            {MUSCLE_LABELS[exercise.muscle]} · {exercise.type.toUpperCase()} · {exercise.level.toUpperCase()}
          </span>
          <div className="flex items-center gap-5 mt-3">
            <DataStat label="SETS" value={`${exercise.sets}`} />
            <DataStat label="REPS" value={exercise.reps} />
            <DataStat label="REST" value={`${exercise.rest}s`} />
          </div>

          {/* Animation */}
          <div className="mt-4">
            <p className="label-eyebrow text-muted-foreground mb-2">DEMONSTRATION</p>
            <ExerciseAnimationView exerciseId={exercise.id} />
          </div>

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
      <p className="font-display italic text-2xl text-muted-foreground">Pick your gear in the GEAR tab to begin.</p>
    </div>
  )
}

// ============================================================
// WEEK VIEW (simplified)
// ============================================================
function WeekView({
  plan, todayKey, completed, weekOffset, onNextWeek, onPrevWeek,
}: {
  plan: WorkoutPlan
  todayKey: DayKey
  completed: Record<string, boolean>
  weekOffset: number
  onNextWeek: () => void
  onPrevWeek: () => void
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-5xl font-semibold tracking-tight leading-none">The week.</h1>
        <div className="text-right">
          <p className="label-data text-3xl font-semibold tabular-nums leading-none">WK{String(weekOffset + 1).padStart(2, '0')}</p>
          <p className="label-eyebrow text-muted-foreground mt-1">ROTATION</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onPrevWeek} disabled={weekOffset === 0} className="rounded-none h-9 px-3"><ChevronLeft className="h-4 w-4" /> PREV</Button>
        <Button size="sm" variant="outline" onClick={onNextWeek} className="rounded-none h-9 px-3">NEXT <ChevronRight className="h-4 w-4" /></Button>
        <div className="flex-1" />
        <p className="label-meta text-muted-foreground tabular-nums">{plan.days.reduce((s, d) => s + d.exercises.length, 0)} MOVES TOTAL</p>
      </div>
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
                  <p className={`impact text-xl leading-none ${isToday ? '' : 'text-muted-foreground'}`}>{day.shortLabel.toUpperCase()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight leading-tight">{day.label}.</h3>
                    {isToday && <span className="label-eyebrow border border-foreground px-1.5 py-0.5">TODAY</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 italic font-display">{day.focus}.</p>
                  {total > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex gap-0.5 h-1">
                        {Array.from({ length: total }).map((_, k) => (
                          <div key={k} className={`flex-1 ${k < doneCount ? 'bg-foreground' : 'bg-muted'}`} />
                        ))}
                      </div>
                      <span className="label-data text-xs font-semibold tabular-nums">{String(doneCount).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
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
// GEAR VIEW (simplified)
// ============================================================
function GearView({
  equipment, setEquipment, onResetAll, weekOffset, onNextWeek,
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
        <h1 className="font-display text-5xl font-semibold tracking-tight leading-none mb-2">Your gear.</h1>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">Update anytime. Plan rebuilds instantly.</p>
      </div>
      <div>
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
          <h2 className="impact text-base">ARSENAL</h2>
          <p className="label-meta text-muted-foreground tabular-nums">{String(equipment.length).padStart(2, '0')} ACTIVE</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {EQUIPMENT.map((eq, i) => {
            const checked = equipment.includes(eq.id)
            return (
              <button key={eq.id} onClick={() => toggle(eq.id)} type="button" aria-pressed={checked}
                className={`w-full flex items-center gap-4 px-2 py-3.5 text-left transition-colors ${checked ? 'bg-foreground/5' : 'hover:bg-foreground/[0.03]'}`}>
                <span className="label-data text-[11px] text-muted-foreground w-8 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xl leading-none w-7 shrink-0 grayscale">{eq.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold uppercase tracking-wide">{eq.label}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{eq.description}</p>
                </div>
                <span aria-hidden="true" className={`grid place-items-center h-5 w-5 border shrink-0 transition-all rounded ${checked ? 'bg-foreground border-foreground text-background' : 'border-muted-foreground'}`}>
                  {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
          <h2 className="impact text-base">ROTATION</h2>
          <p className="label-meta text-muted-foreground">WK{String(weekOffset + 1).padStart(2, '0')}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">Generate a fresh set of exercises for next week. Resets today's progress.</p>
        <Button onClick={onNextWeek} className="w-full h-12 rounded-none uppercase tracking-wide font-bold">Get next week's plan<ArrowRight className="h-4 w-4 ml-2" /></Button>
      </div>
      <div>
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
          <h2 className="impact text-base text-muted-foreground">RESET</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">Clears progress, streak, and completed exercises. Equipment selection is kept.</p>
        <Button variant="outline" onClick={onResetAll} className="w-full h-12 rounded-none uppercase tracking-wide font-bold"><RotateCcw className="h-4 w-4 mr-2" /> Reset everything</Button>
      </div>
      <div className="text-center py-4">
        <p className="font-display text-sm mb-1"><b>FIT</b>FORG</p>
        <p className="label-eyebrow text-muted-foreground">NO ACCOUNTS · NO ADS · OFFLINE</p>
      </div>
    </div>
  )
}

// ============================================================
// ONBOARDING (simplified)
// ============================================================
function OnboardingScreen({ equipment, setEquipment }: { equipment: EquipmentId[]; setEquipment: (e: EquipmentId[]) => void }) {
  const [local, setLocal] = useState<EquipmentId[]>(equipment)
  function toggle(id: EquipmentId) { setLocal(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) }
  const exerciseCount = filterByEquipment(EXERCISES, local).length
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 mx-auto max-w-3xl w-full px-5 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8"><FitforgLogo size={64} /><span className="font-display text-3xl tracking-tight"><b>FIT</b>FORG</span></div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight mb-5">Pick your gear.<br /><em className="italic font-normal text-muted-foreground">Show up.</em> <span className="font-display">Repeat.</span></h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">Tell us what equipment you actually have. We'll build a different workout for every day of the week using only that gear.</p>
        </div>
        <div className="mb-8">
          <div className="flex items-end justify-between mb-4 pb-2 border-b border-border"><h2 className="impact text-lg">YOUR ARSENAL</h2><p className="label-meta text-muted-foreground tabular-nums">{String(local.length).padStart(2, '0')} / {String(EQUIPMENT.length).padStart(2, '0')} SELECTED</p></div>
          <div className="divide-y divide-border border-y border-border">
            {EQUIPMENT.map((eq, i) => {
              const checked = local.includes(eq.id)
              return (
                <button key={eq.id} onClick={() => toggle(eq.id)} type="button" aria-pressed={checked} className={`w-full flex items-center gap-4 px-2 py-3.5 text-left transition-colors ${checked ? 'bg-foreground/5' : 'hover:bg-foreground/[0.03]'}`}>
                  <span className="label-data text-[11px] text-muted-foreground w-8 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-2xl leading-none w-8 shrink-0 grayscale">{eq.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold uppercase tracking-wide">{eq.label}</div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{eq.description}</p>
                  </div>
                  <span aria-hidden="true" className={`grid place-items-center h-5 w-5 border shrink-0 transition-all rounded ${checked ? 'bg-foreground border-foreground text-background' : 'border-muted-foreground'}`}>{checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between mb-6 py-4 border-y border-border">
          <div><p className="label-eyebrow text-muted-foreground">UNLOCKED</p><p className="label-data text-2xl font-semibold mt-1 tabular-nums">{exerciseCount} MOVES</p></div>
          <div className="text-right"><p className="label-eyebrow text-muted-foreground">COST</p><p className="label-data text-2xl font-semibold mt-1 tabular-nums">$0.00</p></div>
        </div>
        <Button size="lg" className="w-full h-14 text-base tracking-wide uppercase font-bold rounded-none" disabled={local.length === 0} onClick={() => setEquipment(local)}>Build my plan<ArrowRight className="h-4 w-4 ml-2" /></Button>
        <p className="text-center label-eyebrow text-muted-foreground mt-4">NO ACCOUNTS · NO ADS · OFFLINE</p>
      </div>
    </div>
  )
}

// ============================================================
// TAB BUTTON
// ============================================================
function TabButton({ active, onClick, label, index }: { active: boolean; onClick: () => void; label: string; index: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-[48px] transition-colors relative ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
      <span className={`label-data text-[10px] tabular-nums ${active ? 'opacity-100' : 'opacity-40'}`}>{index}</span>
      <span className="impact text-[11px] tracking-wider">{label}</span>
      {active && <span className="absolute -top-px left-1/4 right-1/4 h-px bg-foreground" />}
    </button>
  )
}
