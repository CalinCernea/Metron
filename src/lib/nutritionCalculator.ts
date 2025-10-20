import { OnboardingData } from '../context/OnboardingContext'

export interface NutritionPlan {
  tdee: number // Total Daily Energy Expenditure
  calories: number // Adjusted calories based on goal
  protein: number // grams
  carbs: number // grams
  fats: number // grams
  waterIntake: number // liters
  mealFrequency: number // meals per day
}

// Activity multipliers
const activityMultipliers: { [key: string]: number } = {
  sedentary: 1.2,
  lightly_active: 1.375,
  active: 1.55,
  very_active: 1.725,
}

// Calculate BMR using Mifflin-St Jeor equation
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  sex: string
): number => {
  let bmr: number

  if (sex === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else if (sex === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  } else {
    // Average for other
    bmr = 10 * weight + 6.25 * height - 5 * age - 78
  }

  return Math.round(bmr)
}

// Calculate TDEE
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multiplier = activityMultipliers[activityLevel] || 1.55
  return Math.round(bmr * multiplier)
}

// Calculate adjusted calories based on goal
export const calculateAdjustedCalories = (
  tdee: number,
  goal: string,
  progressAmount: number
): number => {
  // 1 kg of fat = ~7700 calories
  // 1 kg of muscle = ~1100 calories (but requires surplus)
  const calorieDeficitPerKg = 7700
  const calorieSurplusPerKg = 1100

  let adjustment = 0

  if (goal === 'lose_weight') {
    // Create deficit: 500-1000 calories per day = 0.5-1 kg per week
    adjustment = -(progressAmount * calorieDeficitPerKg) / 7
  } else if (goal === 'gain_weight') {
    // Create surplus: 300-500 calories per day = 0.25-0.5 kg per week
    adjustment = (progressAmount * calorieSurplusPerKg) / 7
  } else if (goal === 'gain_muscle') {
    // Lean bulk: 300-400 calories surplus per day
    adjustment = (progressAmount * calorieSurplusPerKg) / 7
  }

  return Math.round(tdee + adjustment)
}

// Calculate macronutrients based on goals and calories
export const calculateMacros = (
  calories: number,
  goals: string[],
  experience: string
): { protein: number; carbs: number; fats: number } => {
  let proteinRatio = 0.3 // 30% of calories
  let fatRatio = 0.25 // 25% of calories
  let carbRatio = 0.45 // 45% of calories

  // Adjust ratios based on goals
  if (goals.includes('gain_muscle') || goals.includes('gain_strength')) {
    // Higher protein for muscle building
    proteinRatio = 0.35
    fatRatio = 0.25
    carbRatio = 0.4
  }

  if (goals.includes('lose_weight')) {
    // Higher protein to preserve muscle during deficit
    proteinRatio = 0.35
    fatRatio = 0.3
    carbRatio = 0.35
  }

  if (goals.includes('get_leaner')) {
    // High protein, moderate fat, lower carbs
    proteinRatio = 0.4
    fatRatio = 0.3
    carbRatio = 0.3
  }

  // Adjust for experience level
  if (experience === 'beginner') {
    // Beginners benefit from higher carbs for energy
    proteinRatio = 0.3
    carbRatio = 0.5
    fatRatio = 0.2
  }

  // Calculate grams (protein and carbs = 4 cal/g, fat = 9 cal/g)
  const protein = Math.round((calories * proteinRatio) / 4)
  const fats = Math.round((calories * fatRatio) / 9)
  const carbs = Math.round((calories * carbRatio) / 4)

  return { protein, carbs, fats }
}

// Calculate water intake based on weight and activity
export const calculateWaterIntake = (weight: number, activityLevel: string): number => {
  // Base: 30-35 ml per kg of body weight
  let baseWater = weight * 0.035

  // Adjust for activity level
  if (activityLevel === 'active' || activityLevel === 'very_active') {
    baseWater += 0.5 // Add 500ml for active individuals
  }

  return Math.round(baseWater * 10) / 10 // Round to nearest 0.1L
}

// Generate complete nutrition plan
export const generateNutritionPlan = (data: OnboardingData): NutritionPlan => {
  const bmr = calculateBMR(
    data.weight as number,
    data.height as number,
    data.age as number,
    data.sex as string
  )

  const tdee = calculateTDEE(bmr, data.activityLevel as string)

  const calories = calculateAdjustedCalories(
    tdee,
    data.weeklyProgressGoal as string,
    data.progressAmount as number
  )

  const { protein, carbs, fats } = calculateMacros(
    calories,
    data.goals,
    data.experience as string
  )

  const waterIntake = calculateWaterIntake(
    data.weight as number,
    data.activityLevel as string
  )

  // Determine meal frequency based on goal
  let mealFrequency = 3
  if (data.goals.includes('gain_muscle')) {
    mealFrequency = 4 // More frequent meals for muscle building
  }

  return {
    tdee,
    calories,
    protein,
    carbs,
    fats,
    waterIntake,
    mealFrequency,
  }
}

// Calculate macro percentages
export const calculateMacroPercentages = (
  protein: number,
  carbs: number,
  fats: number
): { proteinPercent: number; carbsPercent: number; fatsPercent: number } => {
  const totalCalories = protein * 4 + carbs * 4 + fats * 9
  return {
    proteinPercent: Math.round((protein * 4) / totalCalories * 100),
    carbsPercent: Math.round((carbs * 4) / totalCalories * 100),
    fatsPercent: Math.round((fats * 9) / totalCalories * 100),
  }
}

