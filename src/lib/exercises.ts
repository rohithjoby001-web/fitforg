// ============================================================
// Exercise Database — completely free, hard-coded, no API needed
// ============================================================
// Each exercise is tagged with:
// - id: unique slug
// - name: display name
// - equipment: which equipment it requires (subset of EQUIPMENT_IDS)
// - muscle: primary muscle group
// - type: compound | isolation | cardio | mobility | core
// - level: beginner | intermediate | advanced
// - sets/reps: suggested scheme
// - rest: rest seconds between sets
// - description: short how-to
// ============================================================

export type EquipmentId =
  | 'bodyweight'
  | 'dumbbells'
  | 'pushupRod' // push-up rod / parallettes / push-up bars
  | 'pullupBar'
  | 'resistanceBand'
  | 'kettlebell'
  | 'barbell'
  | 'bench'
  | 'jumpRope'
  | 'yogaMat'

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'cardio'
  | 'mobility'

export type ExerciseType = 'compound' | 'isolation' | 'cardio' | 'mobility' | 'core'
export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface Exercise {
  id: string
  name: string
  equipment: EquipmentId[]
  muscle: MuscleGroup
  type: ExerciseType
  level: Level
  sets: number
  reps: string // e.g. "8-12" or "30s" or "AMRAP"
  rest: number // seconds
  description: string
}

export interface EquipmentInfo {
  id: EquipmentId
  label: string
  description: string
  icon: string // emoji for free, no asset hosting needed
}

export const EQUIPMENT: EquipmentInfo[] = [
  { id: 'bodyweight', label: 'Bodyweight Only', description: 'No equipment — uses your own body weight', icon: '🤸' },
  { id: 'dumbbells', label: 'Dumbbells', description: 'Any pair of dumbbells (adjustable or fixed)', icon: '🏋️' },
  { id: 'pushupRod', label: 'Push-up Rod / Bars', description: 'Push-up bars, parallettes, or rotating handles', icon: '🥢' },
  { id: 'pullupBar', label: 'Pull-up Bar', description: 'Doorway or wall-mounted pull-up bar', icon: '🚪' },
  { id: 'resistanceBand', label: 'Resistance Band', description: 'Loop or tube resistance bands', icon: '🧶' },
  { id: 'kettlebell', label: 'Kettlebell', description: 'Single or pair of kettlebells', icon: '🪣' },
  { id: 'barbell', label: 'Barbell', description: 'Standard or Olympic barbell with plates', icon: '🔩' },
  { id: 'bench', label: 'Bench', description: 'Flat or adjustable workout bench', icon: '🛏️' },
  { id: 'jumpRope', label: 'Jump Rope', description: 'For cardio warm-ups and HIIT', icon: '🪢' },
  { id: 'yogaMat', label: 'Yoga Mat', description: 'For floor work and stretching', icon: '🧘' },
]

export const EQUIPMENT_IDS = EQUIPMENT.map(e => e.id)

// ============================================================
// Exercise library — 60+ exercises covering common hostel setups
// ============================================================
export const EXERCISES: Exercise[] = [
  // ---------- CHEST ----------
  {
    id: 'pushup-standard', name: 'Standard Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'chest', type: 'compound', level: 'beginner',
    sets: 4, reps: '10-15', rest: 60, description: 'Hands shoulder-width, lower chest to floor, push back up. Rod increases range of motion.'
  },
  {
    id: 'pushup-wide', name: 'Wide Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'chest', type: 'compound', level: 'beginner',
    sets: 3, reps: '10-15', rest: 60, description: 'Hands wider than shoulders — targets outer chest.'
  },
  {
    id: 'pushup-diamond', name: 'Diamond Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'chest', type: 'compound', level: 'intermediate',
    sets: 3, reps: '8-12', rest: 60, description: 'Hands form a diamond under chest — heavy triceps + inner chest.'
  },
  {
    id: 'pushup-decline', name: 'Decline Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'chest', type: 'compound', level: 'intermediate',
    sets: 3, reps: '8-12', rest: 75, description: 'Feet elevated on bed/chair — hits upper chest.'
  },
  {
    id: 'pushup-incline', name: 'Incline Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'chest', type: 'compound', level: 'beginner',
    sets: 3, reps: '12-20', rest: 45, description: 'Hands on elevated surface — easier + lower-chest focus.'
  },
  {
    id: 'pushup-archer', name: 'Archer Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'chest', type: 'compound', level: 'advanced',
    sets: 3, reps: '6-8/side', rest: 90, description: 'Shift weight to one arm while other extends — bridge to one-arm push-up.'
  },
  {
    id: 'db-bench-press', name: 'Dumbbell Floor Press', equipment: ['dumbbells'], muscle: 'chest', type: 'compound', level: 'beginner',
    sets: 4, reps: '8-12', rest: 90, description: 'Lie on floor, press dumbbells up — floor stops at elbow level to protect shoulders.'
  },
  {
    id: 'db-fly', name: 'Dumbbell Floor Fly', equipment: ['dumbbells'], muscle: 'chest', type: 'isolation', level: 'beginner',
    sets: 3, reps: '10-15', rest: 60, description: 'Lie on floor, arms slightly bent, open then squeeze chest to bring weights together.'
  },
  {
    id: 'db-pullover', name: 'Dumbbell Pullover', equipment: ['dumbbells', 'bench'], muscle: 'chest', type: 'compound', level: 'intermediate',
    sets: 3, reps: '10-12', rest: 60, description: 'Lie on bench, lower one dumbbell behind head, pull back over chest.'
  },

  // ---------- BACK ----------
  {
    id: 'pullup', name: 'Pull-up', equipment: ['pullupBar'], muscle: 'back', type: 'compound', level: 'intermediate',
    sets: 4, reps: '5-10', rest: 90, description: 'Hang from bar, pull chest to bar. Scale with resistance band if needed.'
  },
  {
    id: 'chinup', name: 'Chin-up', equipment: ['pullupBar'], muscle: 'back', type: 'compound', level: 'intermediate',
    sets: 3, reps: '5-10', rest: 90, description: 'Underhand grip — more biceps, still strong back work.'
  },
  {
    id: 'inverted-row', name: 'Inverted Row', equipment: ['pullupBar'], muscle: 'back', type: 'compound', level: 'beginner',
    sets: 3, reps: '8-12', rest: 60, description: 'Bar at waist height, body straight, pull chest to bar.'
  },
  {
    id: 'db-row', name: 'One-arm Dumbbell Row', equipment: ['dumbbells', 'bench'], muscle: 'back', type: 'compound', level: 'beginner',
    sets: 4, reps: '8-12', rest: 60, description: 'One knee + hand on bench, row dumbbell to hip with the other arm.'
  },
  {
    id: 'db-row-floor', name: 'Bent-over Dumbbell Row', equipment: ['dumbbells'], muscle: 'back', type: 'compound', level: 'beginner',
    sets: 4, reps: '8-12', rest: 75, description: 'Hinge at hips with flat back, row both dumbbells to waist. No bench needed.'
  },
  {
    id: 'db-deadlift', name: 'Dumbbell Romanian Deadlift', equipment: ['dumbbells'], muscle: 'back', type: 'compound', level: 'beginner',
    sets: 4, reps: '8-12', rest: 90, description: 'Hinge hips back, dumbbells slide down legs — stretch hamstrings + work back.'
  },
  {
    id: 'superman', name: 'Superman Hold', equipment: ['bodyweight', 'yogaMat'], muscle: 'back', type: 'core', level: 'beginner',
    sets: 3, reps: '30s', rest: 45, description: 'Lie face down, lift arms + legs — strengthens lower back.'
  },
  {
    id: 'band-pulldown', name: 'Resistance Band Lat Pulldown', equipment: ['resistanceBand'], muscle: 'back', type: 'compound', level: 'beginner',
    sets: 4, reps: '10-15', rest: 60, description: 'Anchor band high overhead, pull down to chest — mimics lat pulldown.'
  },
  {
    id: 'band-row', name: 'Seated Band Row', equipment: ['resistanceBand'], muscle: 'back', type: 'compound', level: 'beginner',
    sets: 3, reps: '12-15', rest: 60, description: 'Loop band around feet, pull handles to waist — mid-back focus.'
  },

  // ---------- SHOULDERS ----------
  {
    id: 'pike-pushup', name: 'Pike Push-up', equipment: ['bodyweight', 'pushupRod'], muscle: 'shoulders', type: 'compound', level: 'intermediate',
    sets: 4, reps: '8-12', rest: 75, description: 'Hips high in downward-dog shape, lower head toward floor — hits shoulders hard.'
  },
  {
    id: 'handstand-hold', name: 'Wall Handstand Hold', equipment: ['bodyweight'], muscle: 'shoulders', type: 'compound', level: 'advanced',
    sets: 3, reps: '20-40s', rest: 90, description: 'Kick up to wall, hold — massive shoulder + core builder.'
  },
  {
    id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', equipment: ['dumbbells'], muscle: 'shoulders', type: 'compound', level: 'beginner',
    sets: 4, reps: '8-12', rest: 75, description: 'Seated or standing, press dumbbells overhead — main shoulder builder.'
  },
  {
    id: 'db-lateral-raise', name: 'Dumbbell Lateral Raise', equipment: ['dumbbells'], muscle: 'shoulders', type: 'isolation', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Raise dumbbells out to sides — side delt isolation.'
  },
  {
    id: 'db-front-raise', name: 'Dumbbell Front Raise', equipment: ['dumbbells'], muscle: 'shoulders', type: 'isolation', level: 'beginner',
    sets: 3, reps: '10-12', rest: 45, description: 'Raise dumbbells in front to shoulder height — front delt.'
  },
  {
    id: 'db-rear-delt-fly', name: 'Bent-over Dumbbell Reverse Fly', equipment: ['dumbbells'], muscle: 'shoulders', type: 'isolation', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Hinge forward, raise dumbbells out to sides — rear delts + posture.'
  },
  {
    id: 'band-press', name: 'Band Overhead Press', equipment: ['resistanceBand'], muscle: 'shoulders', type: 'compound', level: 'beginner',
    sets: 3, reps: '12-15', rest: 60, description: 'Stand on band, press handles overhead — shoulder press alternative.'
  },
  {
    id: 'band-lateral', name: 'Band Lateral Raise', equipment: ['resistanceBand'], muscle: 'shoulders', type: 'isolation', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Stand on band, raise handles to sides — side delts.'
  },

  // ---------- BICEPS ----------
  {
    id: 'db-curl', name: 'Dumbbell Bicep Curl', equipment: ['dumbbells'], muscle: 'biceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '10-12', rest: 45, description: 'Curl dumbbells up, slow on the way down — full control.'
  },
  {
    id: 'db-hammer-curl', name: 'Hammer Curl', equipment: ['dumbbells'], muscle: 'biceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '10-12', rest: 45, description: 'Neutral grip (palms face each other) — biceps + brachialis + forearms.'
  },
  {
    id: 'db-concentration-curl', name: 'Concentration Curl', equipment: ['dumbbells'], muscle: 'biceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '10-12', rest: 45, description: 'Seated, elbow braced on inner thigh — peak contraction focus.'
  },
  {
    id: 'band-curl', name: 'Resistance Band Curl', equipment: ['resistanceBand'], muscle: 'biceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Stand on band, curl handles up — biceps.'
  },
  {
    id: 'towel-curl', name: 'Towel Bicep Curl (isometric)', equipment: ['bodyweight'], muscle: 'biceps', type: 'isolation', level: 'intermediate',
    sets: 3, reps: '30s/side', rest: 45, description: 'Loop towel around one hand, pull with other — bicep iso-hold.'
  },

  // ---------- TRICEPS ----------
  {
    id: 'bench-dip', name: 'Bench Dip', equipment: ['bodyweight', 'bench'], muscle: 'triceps', type: 'compound', level: 'beginner',
    sets: 3, reps: '10-15', rest: 60, description: 'Hands on bench behind you, dip down — triceps + chest.'
  },
  {
    id: 'chair-dip', name: 'Chair Dip', equipment: ['bodyweight'], muscle: 'triceps', type: 'compound', level: 'beginner',
    sets: 3, reps: '10-15', rest: 60, description: 'Use a chair or bed edge instead of a bench — same movement.'
  },
  {
    id: 'db-tricep-extension', name: 'Dumbbell Overhead Tricep Extension', equipment: ['dumbbells'], muscle: 'triceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '10-12', rest: 45, description: 'Hold one dumbbell overhead with both hands, lower behind head, extend.'
  },
  {
    id: 'db-kickback', name: 'Dumbbell Tricep Kickback', equipment: ['dumbbells'], muscle: 'triceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Hinge forward, extend dumbbell back — triceps squeeze.'
  },
  {
    id: 'db-skullcrusher', name: 'Dumbbell Floor Skullcrusher', equipment: ['dumbbells'], muscle: 'triceps', type: 'isolation', level: 'intermediate',
    sets: 3, reps: '10-12', rest: 60, description: 'Lie on floor, lower dumbbells to forehead, extend back up.'
  },
  {
    id: 'band-pushdown', name: 'Band Tricep Pushdown', equipment: ['resistanceBand'], muscle: 'triceps', type: 'isolation', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Anchor band high, push down — triceps isolation.'
  },

  // ---------- LEGS ----------
  {
    id: 'bodyweight-squat', name: 'Bodyweight Squat', equipment: ['bodyweight'], muscle: 'legs', type: 'compound', level: 'beginner',
    sets: 4, reps: '15-25', rest: 45, description: 'Feet shoulder-width, sit back, drive through heels.'
  },
  {
    id: 'db-goblet-squat', name: 'Dumbbell Goblet Squat', equipment: ['dumbbells'], muscle: 'legs', type: 'compound', level: 'beginner',
    sets: 4, reps: '10-15', rest: 75, description: 'Hold one dumbbell at chest, squat down — quad + glute focus.'
  },
  {
    id: 'db-split-squat', name: 'Dumbbell Split Squat', equipment: ['dumbbells'], muscle: 'legs', type: 'compound', level: 'intermediate',
    sets: 3, reps: '10-12/leg', rest: 60, description: 'Staggered stance, lower back knee — single-leg strength.'
  },
  {
    id: 'db-lunge', name: 'Dumbbell Walking Lunge', equipment: ['dumbbells'], muscle: 'legs', type: 'compound', level: 'intermediate',
    sets: 3, reps: '12/leg', rest: 75, description: 'Hold dumbbells at sides, step forward into lunge — alternate legs.'
  },
  {
    id: 'db-calf-raise', name: 'Dumbbell Calf Raise', equipment: ['dumbbells'], muscle: 'legs', type: 'isolation', level: 'beginner',
    sets: 4, reps: '15-20', rest: 45, description: 'Hold dumbbells, rise onto toes — pause at top.'
  },
  {
    id: 'db-rdl', name: 'Dumbbell Romanian Deadlift', equipment: ['dumbbells'], muscle: 'legs', type: 'compound', level: 'beginner',
    sets: 4, reps: '8-12', rest: 90, description: 'Hip hinge — hamstring + glute focus.'
  },
  {
    id: 'pistol-squat', name: 'Pistol Squat (Assisted)', equipment: ['bodyweight'], muscle: 'legs', type: 'compound', level: 'advanced',
    sets: 3, reps: '5-8/leg', rest: 90, description: 'Single-leg squat — hold a door frame for balance if needed.'
  },
  {
    id: 'jump-squat', name: 'Jump Squat', equipment: ['bodyweight'], muscle: 'legs', type: 'compound', level: 'intermediate',
    sets: 4, reps: '12-15', rest: 60, description: 'Squat, then explode up — power + cardio.'
  },
  {
    id: 'band-squat', name: 'Band Squat', equipment: ['resistanceBand'], muscle: 'legs', type: 'compound', level: 'beginner',
    sets: 3, reps: '15-20', rest: 60, description: 'Stand on band, hold handles at shoulders, squat.'
  },
  {
    id: 'kb-goblet-squat', name: 'Kettlebell Goblet Squat', equipment: ['kettlebell'], muscle: 'legs', type: 'compound', level: 'beginner',
    sets: 4, reps: '10-15', rest: 75, description: 'Hold KB by horns at chest, squat down.'
  },
  {
    id: 'kb-swing', name: 'Kettlebell Swing', equipment: ['kettlebell'], muscle: 'legs', type: 'compound', level: 'intermediate',
    sets: 4, reps: '15-20', rest: 60, description: 'Hip-hinge swing — explosive glute + hamstring power.'
  },

  // ---------- CORE ----------
  {
    id: 'plank', name: 'Plank', equipment: ['bodyweight', 'yogaMat'], muscle: 'core', type: 'core', level: 'beginner',
    sets: 3, reps: '30-60s', rest: 45, description: 'Forearms down, body straight — anti-extension.'
  },
  {
    id: 'side-plank', name: 'Side Plank', equipment: ['bodyweight', 'yogaMat'], muscle: 'core', type: 'core', level: 'beginner',
    sets: 3, reps: '30s/side', rest: 30, description: 'On one forearm, stack hips — obliques.'
  },
  {
    id: 'hollow-hold', name: 'Hollow Body Hold', equipment: ['bodyweight', 'yogaMat'], muscle: 'core', type: 'core', level: 'intermediate',
    sets: 3, reps: '30s', rest: 45, description: 'Lower back pressed to floor, legs + arms extended — gymnastic core.'
  },
  {
    id: 'leg-raise', name: 'Lying Leg Raise', equipment: ['bodyweight', 'yogaMat'], muscle: 'core', type: 'core', level: 'beginner',
    sets: 3, reps: '12-15', rest: 45, description: 'Lie flat, raise straight legs to 90°, lower slowly — lower abs.'
  },
  {
    id: 'bicycle-crunch', name: 'Bicycle Crunch', equipment: ['bodyweight', 'yogaMat'], muscle: 'core', type: 'core', level: 'beginner',
    sets: 3, reps: '20/side', rest: 30, description: 'Crunch + twist, alternating elbows to knees — obliques.'
  },
  {
    id: 'mountain-climber', name: 'Mountain Climber', equipment: ['bodyweight', 'yogaMat'], muscle: 'core', type: 'cardio', level: 'beginner',
    sets: 3, reps: '40s', rest: 30, description: 'Plank position, drive knees to chest fast — cardio + core.'
  },
  {
    id: 'db-russian-twist', name: 'Dumbbell Russian Twist', equipment: ['dumbbells', 'yogaMat'], muscle: 'core', type: 'core', level: 'intermediate',
    sets: 3, reps: '20/side', rest: 45, description: 'Sit, lean back, rotate dumbbell side to side — obliques.'
  },
  {
    id: 'hanging-leg-raise', name: 'Hanging Leg Raise', equipment: ['pullupBar'], muscle: 'core', type: 'core', level: 'advanced',
    sets: 3, reps: '8-12', rest: 60, description: 'Hang from bar, raise straight legs to hip height — strong core builder.'
  },

  // ---------- CARDIO ----------
  {
    id: 'jumping-jack', name: 'Jumping Jacks', equipment: ['bodyweight'], muscle: 'cardio', type: 'cardio', level: 'beginner',
    sets: 3, reps: '40s', rest: 20, description: 'Classic warm-up — full-body cardio.'
  },
  {
    id: 'burpee', name: 'Burpee', equipment: ['bodyweight'], muscle: 'cardio', type: 'cardio', level: 'intermediate',
    sets: 4, reps: '10-15', rest: 45, description: 'Squat → plank → push-up → jump — full-body cardio.'
  },
  {
    id: 'high-knees', name: 'High Knees', equipment: ['bodyweight'], muscle: 'cardio', type: 'cardio', level: 'beginner',
    sets: 3, reps: '40s', rest: 20, description: 'Run in place, knees to hip height.'
  },
  {
    id: 'jump-rope', name: 'Jump Rope', equipment: ['jumpRope'], muscle: 'cardio', type: 'cardio', level: 'beginner',
    sets: 5, reps: '60s', rest: 30, description: 'Steady-state or intervals — top cardio for calf + coordination.'
  },
  {
    id: 'shadow-box', name: 'Shadow Boxing', equipment: ['bodyweight'], muscle: 'cardio', type: 'cardio', level: 'beginner',
    sets: 3, reps: '60s', rest: 30, description: 'Throw combinations in the air — cardio + shoulder endurance.'
  },

  // ---------- MOBILITY ----------
  {
    id: 'cat-cow', name: 'Cat-Cow Stretch', equipment: ['bodyweight', 'yogaMat'], muscle: 'mobility', type: 'mobility', level: 'beginner',
    sets: 2, reps: '10', rest: 0, description: 'Quadruped, alternate arching + rounding spine — warm-up spine.'
  },
  {
    id: 'hip-flexor-stretch', name: 'Hip Flexor Stretch', equipment: ['bodyweight', 'yogaMat'], muscle: 'mobility', type: 'mobility', level: 'beginner',
    sets: 2, reps: '30s/side', rest: 0, description: 'Kneeling lunge, push hips forward — opens tight hip flexors.'
  },
  {
    id: 'shoulder-dislocates', name: 'Shoulder Dislocates (Band)', equipment: ['resistanceBand'], muscle: 'mobility', type: 'mobility', level: 'intermediate',
    sets: 2, reps: '10', rest: 0, description: 'Hold band wide, rotate arms overhead to back — shoulder mobility.'
  },
  {
    id: 'world-greatest', name: 'World\'s Greatest Stretch', equipment: ['bodyweight', 'yogaMat'], muscle: 'mobility', type: 'mobility', level: 'beginner',
    sets: 2, reps: '5/side', rest: 0, description: 'Lunge + reach for sky + rotate — full-body warm-up.'
  },
  {
    id: 'thoracic-bridge', name: 'Thoracic Bridge', equipment: ['bodyweight', 'yogaMat'], muscle: 'mobility', type: 'mobility', level: 'beginner',
    sets: 2, reps: '8/side', rest: 0, description: 'From seated, push hips up into a bridge — opens chest + thoracic.'
  },
]

// Helper: filter exercises by available equipment.
// Bodyweight is ALWAYS considered available (you always have your body),
// so exercises that list only bodyweight (or bodyweight + optional gear
// like push-up rod / yoga mat) are always shown.
export function filterByEquipment(exercises: Exercise[], available: EquipmentId[]): Exercise[] {
  const set = new Set<EquipmentId>([...available, 'bodyweight'])
  return exercises.filter(ex => ex.equipment.every(e => set.has(e)))
}

// Helper: get exercises by muscle group
export function byMuscle(exercises: Exercise[], muscle: MuscleGroup): Exercise[] {
  return exercises.filter(ex => ex.muscle === muscle)
}
