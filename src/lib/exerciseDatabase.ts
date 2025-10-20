export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string[] // 'barbell', 'dumbbell', 'machine', 'bodyweight', 'cable'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  sets: number
  reps: string // e.g., "8-12", "10-15", "3-5"
  restSeconds: number
  videoUrl?: string
}

export const exerciseDatabase: Exercise[] = [
  // CHEST EXERCISES
  {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    muscleGroup: 'chest',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Classic compound movement for chest development',
    sets: 4,
    reps: '6-8',
    restSeconds: 180,
  },
  {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'chest',
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Targets upper chest and front shoulders',
    sets: 3,
    reps: '8-12',
    restSeconds: 120,
  },
  {
    id: 'cable_flyes',
    name: 'Cable Flyes',
    muscleGroup: 'chest',
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Isolation exercise for chest contraction',
    sets: 3,
    reps: '10-15',
    restSeconds: 90,
  },
  {
    id: 'push_ups',
    name: 'Push-ups',
    muscleGroup: 'chest',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Bodyweight exercise for chest and triceps',
    sets: 3,
    reps: '8-15',
    restSeconds: 90,
  },
  {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    muscleGroup: 'chest',
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Allows greater range of motion than barbell',
    sets: 4,
    reps: '8-12',
    restSeconds: 120,
  },

  // BACK EXERCISES
  {
    id: 'deadlift',
    name: 'Deadlift',
    muscleGroup: 'back',
    equipment: ['barbell'],
    difficulty: 'advanced',
    description: 'Ultimate compound movement for back and legs',
    sets: 3,
    reps: '3-5',
    restSeconds: 240,
  },
  {
    id: 'barbell_rows',
    name: 'Barbell Rows',
    muscleGroup: 'back',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Primary back builder for strength and mass',
    sets: 4,
    reps: '6-8',
    restSeconds: 180,
  },
  {
    id: 'pull_ups',
    name: 'Pull-ups',
    muscleGroup: 'back',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Compound pulling exercise for back and biceps',
    sets: 3,
    reps: '6-12',
    restSeconds: 120,
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'back',
    equipment: ['machine', 'cable'],
    difficulty: 'beginner',
    description: 'Accessible alternative to pull-ups',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },
  {
    id: 'dumbbell_rows',
    name: 'Dumbbell Rows',
    muscleGroup: 'back',
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Single-arm rowing for unilateral strength',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },

  // SHOULDERS EXERCISES
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    muscleGroup: 'shoulders',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Compound shoulder builder',
    sets: 3,
    reps: '6-8',
    restSeconds: 150,
  },
  {
    id: 'lateral_raises',
    name: 'Lateral Raises',
    muscleGroup: 'shoulders',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Isolation for shoulder width',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
  },
  {
    id: 'face_pulls',
    name: 'Face Pulls',
    muscleGroup: 'shoulders',
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Rear delt and shoulder health exercise',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
  },
  {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    muscleGroup: 'shoulders',
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    description: 'Unilateral shoulder pressing',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },

  // BICEPS EXERCISES
  {
    id: 'barbell_curls',
    name: 'Barbell Curls',
    muscleGroup: 'biceps',
    equipment: ['barbell'],
    difficulty: 'beginner',
    description: 'Classic bicep builder',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },
  {
    id: 'dumbbell_curls',
    name: 'Dumbbell Curls',
    muscleGroup: 'biceps',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Unilateral bicep work',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },
  {
    id: 'cable_curls',
    name: 'Cable Curls',
    muscleGroup: 'biceps',
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Constant tension bicep exercise',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
  },
  {
    id: 'hammer_curls',
    name: 'Hammer Curls',
    muscleGroup: 'biceps',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    description: 'Targets brachialis for arm thickness',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },

  // TRICEPS EXERCISES
  {
    id: 'close_grip_bench',
    name: 'Close Grip Bench Press',
    muscleGroup: 'triceps',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'Compound tricep exercise',
    sets: 3,
    reps: '6-8',
    restSeconds: 120,
  },
  {
    id: 'tricep_dips',
    name: 'Tricep Dips',
    muscleGroup: 'triceps',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Bodyweight tricep builder',
    sets: 3,
    reps: '6-12',
    restSeconds: 90,
  },
  {
    id: 'rope_pushdowns',
    name: 'Rope Pushdowns',
    muscleGroup: 'triceps',
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Isolation for tricep definition',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
  },
  {
    id: 'overhead_extension',
    name: 'Overhead Extension',
    muscleGroup: 'triceps',
    equipment: ['dumbbell', 'cable'],
    difficulty: 'beginner',
    description: 'Targets long head of triceps',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
  },

  // LEGS EXERCISES
  {
    id: 'barbell_squats',
    name: 'Barbell Squats',
    muscleGroup: 'legs',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    description: 'King of leg exercises',
    sets: 4,
    reps: '6-8',
    restSeconds: 180,
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    muscleGroup: 'legs',
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Machine-based leg exercise',
    sets: 3,
    reps: '8-12',
    restSeconds: 120,
  },
  {
    id: 'leg_curls',
    name: 'Leg Curls',
    muscleGroup: 'legs',
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Hamstring isolation',
    sets: 3,
    reps: '10-15',
    restSeconds: 90,
  },
  {
    id: 'leg_extensions',
    name: 'Leg Extensions',
    muscleGroup: 'legs',
    equipment: ['machine'],
    difficulty: 'beginner',
    description: 'Quadriceps isolation',
    sets: 3,
    reps: '10-15',
    restSeconds: 90,
  },
  {
    id: 'romanian_deadlifts',
    name: 'Romanian Deadlifts',
    muscleGroup: 'legs',
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    description: 'Hamstring and lower back focus',
    sets: 3,
    reps: '6-8',
    restSeconds: 120,
  },
  {
    id: 'lunges',
    name: 'Lunges',
    muscleGroup: 'legs',
    equipment: ['dumbbell', 'bodyweight'],
    difficulty: 'beginner',
    description: 'Unilateral leg exercise',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },

  // ABS EXERCISES
  {
    id: 'cable_crunches',
    name: 'Cable Crunches',
    muscleGroup: 'abs',
    equipment: ['cable'],
    difficulty: 'beginner',
    description: 'Weighted ab exercise',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
  },
  {
    id: 'hanging_leg_raises',
    name: 'Hanging Leg Raises',
    muscleGroup: 'abs',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    description: 'Lower ab focus',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },
  {
    id: 'ab_wheel_rollouts',
    name: 'Ab Wheel Rollouts',
    muscleGroup: 'abs',
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    description: 'Advanced core exercise',
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  },
  {
    id: 'planks',
    name: 'Planks',
    muscleGroup: 'abs',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    description: 'Isometric core exercise',
    sets: 3,
    reps: '30-60 sec',
    restSeconds: 90,
  },
]

// Get exercises by muscle group
export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return exerciseDatabase.filter((ex) => ex.muscleGroup === muscleGroup)
}

// Get exercises by difficulty
export const getExercisesByDifficulty = (difficulty: string): Exercise[] => {
  return exerciseDatabase.filter((ex) => ex.difficulty === difficulty)
}

// Get exercises by equipment
export const getExercisesByEquipment = (equipment: string): Exercise[] => {
  return exerciseDatabase.filter((ex) => ex.equipment.includes(equipment))
}

// Get random exercises from a list
export const getRandomExercises = (exercises: Exercise[], count: number): Exercise[] => {
  const shuffled = [...exercises].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

