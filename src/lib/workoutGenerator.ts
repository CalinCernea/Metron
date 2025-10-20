import { OnboardingData } from '../context/OnboardingContext'
import { Exercise, exerciseDatabase, getExercisesByMuscleGroup, getRandomExercises } from './exerciseDatabase'

export interface WorkoutSession {
  day: string
  dayNumber: number
  focusMuscles: string[]
  exercises: Exercise[]
  duration: number // minutes
  notes: string
}

export interface WorkoutPlan {
  name: string
  daysPerWeek: number
  duration: number // weeks
  difficulty: string
  description: string
  sessions: WorkoutSession[]
}

// Determine difficulty based on experience
const getDifficultyLevel = (experience: string): 'beginner' | 'intermediate' | 'advanced' => {
  switch (experience) {
    case 'untrained':
      return 'beginner'
    case 'beginner':
      return 'beginner'
    case 'intermediate':
      return 'intermediate'
    case 'advanced':
      return 'advanced'
    default:
      return 'intermediate'
  }
}

// Get available equipment based on training location
const getAvailableEquipment = (location: string): string[] => {
  if (location === 'gym') {
    return ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight']
  } else {
    // Home training
    return ['dumbbell', 'bodyweight']
  }
}

// Create a push/pull/legs split
const createPPLSplit = (data: OnboardingData, difficulty: 'beginner' | 'intermediate' | 'advanced'): WorkoutSession[] => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const availableEquipment = getAvailableEquipment(data.trainingLocation as string)
  const sessions: WorkoutSession[] = []

  const trainingDays = data.trainingDays || []

  // Push Day (Chest, Shoulders, Triceps)
  if (trainingDays.length > 0) {
    const pushExercises = [
      ...getExercisesByMuscleGroup('chest').filter((e) => availableEquipment.some((eq) => e.equipment.includes(eq))),
      ...getExercisesByMuscleGroup('shoulders').filter((e) => availableEquipment.some((eq) => e.equipment.includes(eq))),
      ...getExercisesByMuscleGroup('triceps').filter((e) => availableEquipment.some((eq) => e.equipment.includes(eq))),
    ]

    const selectedPush = getRandomExercises(pushExercises, 5)

    sessions.push({
      day: daysOfWeek[trainingDays[0]],
      dayNumber: trainingDays[0],
      focusMuscles: ['chest', 'shoulders', 'triceps'],
      exercises: selectedPush,
      duration: data.sessionDuration as number,
      notes: 'Focus on compound movements first, then isolation exercises',
    })
  }

  // Pull Day (Back, Biceps)
  if (trainingDays.length > 1) {
    const pullExercises = [
      ...getExercisesByMuscleGroup('back').filter((e) => availableEquipment.some((eq) => e.equipment.includes(eq))),
      ...getExercisesByMuscleGroup('biceps').filter((e) => availableEquipment.some((eq) => e.equipment.includes(eq))),
    ]

    const selectedPull = getRandomExercises(pullExercises, 5)

    sessions.push({
      day: daysOfWeek[trainingDays[1]],
      dayNumber: trainingDays[1],
      focusMuscles: ['back', 'biceps'],
      exercises: selectedPull,
      duration: data.sessionDuration as number,
      notes: 'Prioritize pulling movements for back development',
    })
  }

  // Legs Day
  if (trainingDays.length > 2) {
    const legExercises = getExercisesByMuscleGroup('legs').filter((e) =>
      availableEquipment.some((eq) => e.equipment.includes(eq))
    )

    const selectedLegs = getRandomExercises(legExercises, 5)

    sessions.push({
      day: daysOfWeek[trainingDays[2]],
      dayNumber: trainingDays[2],
      focusMuscles: ['legs'],
      exercises: selectedLegs,
      duration: data.sessionDuration as number,
      notes: 'Start with compound leg movements, finish with isolation',
    })
  }

  // Additional days for upper/lower or full body
  if (trainingDays.length > 3) {
    const upperExercises = [
      ...getExercisesByMuscleGroup('chest'),
      ...getExercisesByMuscleGroup('back'),
      ...getExercisesByMuscleGroup('shoulders'),
    ].filter((e) => availableEquipment.some((eq) => e.equipment.includes(eq)))

    const selectedUpper = getRandomExercises(upperExercises, 5)

    sessions.push({
      day: daysOfWeek[trainingDays[3]],
      dayNumber: trainingDays[3],
      focusMuscles: ['chest', 'back', 'shoulders'],
      exercises: selectedUpper,
      duration: data.sessionDuration as number,
      notes: 'Secondary upper body session with moderate intensity',
    })
  }

  if (trainingDays.length > 4) {
    const lowerExercises = getExercisesByMuscleGroup('legs').filter((e) =>
      availableEquipment.some((eq) => e.equipment.includes(eq))
    )

    const selectedLower = getRandomExercises(lowerExercises, 4)

    sessions.push({
      day: daysOfWeek[trainingDays[4]],
      dayNumber: trainingDays[4],
      focusMuscles: ['legs'],
      exercises: selectedLower,
      duration: data.sessionDuration as number,
      notes: 'Secondary leg session focusing on weak points',
    })
  }

  if (trainingDays.length > 5) {
    const absExercises = getExercisesByMuscleGroup('abs')
    const selectedAbs = getRandomExercises(absExercises, 3)

    sessions.push({
      day: daysOfWeek[trainingDays[5]],
      dayNumber: trainingDays[5],
      focusMuscles: ['abs'],
      exercises: selectedAbs,
      duration: 30,
      notes: 'Light abs and core work',
    })
  }

  return sessions
}

// Generate workout plan based on onboarding data
export const generateWorkoutPlan = (data: OnboardingData): WorkoutPlan => {
  const difficulty = getDifficultyLevel(data.experience as string)
  const daysPerWeek = data.trainingDays?.length || 4
  const trainingLocation = data.trainingLocation as string

  let planName = ''
  let description = ''
  let duration = 12 // weeks

  if (daysPerWeek <= 3) {
    planName = 'Full Body 3x per Week'
    description = 'Efficient full-body workouts perfect for beginners and those with limited time'
  } else if (daysPerWeek <= 4) {
    planName = 'Push/Pull/Legs Split'
    description = 'Classic split for balanced muscle development and recovery'
  } else if (daysPerWeek <= 5) {
    planName = 'Upper/Lower Split'
    description = 'Advanced split for maximum volume and recovery'
  } else {
    planName = 'High Frequency Training'
    description = 'Intense program hitting each muscle group twice per week'
  }

  if (difficulty === 'beginner') {
    duration = 8
  } else if (difficulty === 'advanced') {
    duration = 16
  }

  const sessions = createPPLSplit(data, difficulty)

  return {
    name: planName,
    daysPerWeek,
    duration,
    difficulty,
    description,
    sessions,
  }
}

// Calculate estimated workout duration
export const calculateWorkoutDuration = (exercises: Exercise[]): number => {
  let totalTime = 5 // 5 min warmup

  exercises.forEach((ex) => {
    const timePerSet = 1.5 // minutes per set
    totalTime += ex.sets * timePerSet + ex.restSeconds / 60
  })

  totalTime += 5 // 5 min cooldown

  return Math.round(totalTime)
}

// Get workout intensity level
export const getWorkoutIntensity = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'Moderate'
    case 'intermediate':
      return 'High'
    case 'advanced':
      return 'Very High'
    default:
      return 'Moderate'
  }
}

// Get progression recommendations
export const getProgressionRecommendations = (difficulty: string): string[] => {
  switch (difficulty) {
    case 'beginner':
      return [
        'Focus on form and technique before adding weight',
        'Increase weight by 2-5 lbs when you can complete all reps with good form',
        'Rest 2-3 minutes between compound sets',
      ]
    case 'intermediate':
      return [
        'Aim to increase weight or reps every 1-2 weeks',
        'Use RPE (Rate of Perceived Exertion) 7-8 for compound lifts',
        'Incorporate drop sets and supersets for intensity',
      ]
    case 'advanced':
      return [
        'Periodize your training with phases of 4-6 weeks',
        'Use advanced techniques like cluster sets and paused reps',
        'Track all workouts and aim for progressive overload',
      ]
    default:
      return []
  }
}

