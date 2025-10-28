import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateNutritionPlan, calculateMacroPercentages, NutritionPlan } from '../lib/nutritionCalculator'
import { OnboardingData } from '../context/OnboardingContext'
import {
  ArrowLeftIcon,
  FireIcon,
  WaterDropIcon,
  ChartPieIcon,
  BeakerIcon,
  ClockIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid'

// Helper component for macro display
const MacroCard: React.FC<{ title: string; amount: number; unit: string; percentage: number; color: string; icon: React.ElementType; calories: number }> = ({ title, amount, unit, percentage, color, icon: Icon, calories }) => (
  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
    <p className={`text-4xl font-extrabold ${color} mb-1`}>{amount}{unit}</p>
    <p className="text-gray-400 text-sm mb-3">{percentage}% of total calories</p>
    <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-3">
      <span>Caloric Value:</span>
      <span className="font-semibold text-white">{calories} kcal</span>
    </div>
  </div>
)

const NutritionPlanPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null)
  const [macroPercentages, setMacroPercentages] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAndCalculate = async () => {
      if (!user) {
        setError('You must be logged in')
        setLoading(false)
        return
      }

      try {
        // Fetch the latest onboarding data
        const { data, error: fetchError } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (fetchError) {
          console.error('Error fetching onboarding data:', fetchError)
          setError('Failed to load your profile data')
          setLoading(false)
          return
        }

        if (!data || data.length === 0) {
          setError('No profile data found. Please complete onboarding first.')
          setLoading(false)
          return
        }

        // Convert database data to OnboardingData format
        const onboardingData: OnboardingData = {
          name: data[0].name,
          age: data[0].age,
          sex: data[0].sex,
          height: data[0].height,
          weight: data[0].weight,
          dateOfBirth: data[0].date_of_birth,
          activityLevel: data[0].activity_level,
          goals: data[0].goals || [],
          experience: data[0].experience,
          trainingDays: data[0].training_days || [],
          sessionDuration: data[0].session_duration,
          trainingLocation: data[0].training_location,
          muscleGroups: data[0].muscle_groups || {},
          allergies: data[0].allergies || [],
          dietaryPreferences: data[0].dietary_preferences || [],
          weeklyProgressGoal: data[0].weekly_progress_goal,
          progressAmount: data[0].progress_amount,
        }

        // Generate nutrition plan
        const plan = generateNutritionPlan(onboardingData)
        setNutritionPlan(plan)

        // Calculate macro percentages
        const percentages = calculateMacroPercentages(plan.protein, plan.carbs, plan.fats)
        setMacroPercentages(percentages)

        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchAndCalculate()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Calculating your personalized nutrition plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center border border-red-500/50">
            <div className="mb-4">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Plan</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center mx-auto gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!nutritionPlan || !macroPercentages) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <UtensilsIcon className="h-7 w-7 text-green-400" />
            Your Nutrition Plan
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Daily Targets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-500/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-400 text-lg font-semibold">Calorie Target</p>
              <FireIcon className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-5xl font-extrabold text-white">{nutritionPlan.calories}</p>
            <p className="text-gray-400">kcal per day</p>
            <p className="text-gray-500 text-sm mt-3 border-t border-gray-700 pt-3">
              TDEE: {nutritionPlan.tdee} kcal
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-green-500/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-400 text-lg font-semibold">Water Intake</p>
              <WaterDropIcon className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-5xl font-extrabold text-white">{nutritionPlan.waterIntake}</p>
            <p className="text-gray-400">liters per day</p>
            <p className="text-gray-500 text-sm mt-3 border-t border-gray-700 pt-3">
              Meal Frequency: {nutritionPlan.mealFrequency} meals
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-500/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-400 text-lg font-semibold">Goal Adjustment</p>
              <ChartPieIcon className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">
              {nutritionPlan.calories - nutritionPlan.tdee > 0 ? '+' : ''}
              {nutritionPlan.calories - nutritionPlan.tdee} kcal
            </p>
            <p className="text-gray-400">to {nutritionPlan.weeklyProgressGoal?.replace(/_/g, ' ')}</p>
            <p className="text-gray-500 text-sm mt-3 border-t border-gray-700 pt-3">
              Target: {nutritionPlan.progressAmount} kg/week
            </p>
          </div>
        </div>

        {/* Macronutrients */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Daily Macronutrient Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MacroCard
              title="Protein"
              amount={nutritionPlan.protein}
              unit="g"
              percentage={macroPercentages.proteinPercent}
              color="text-blue-400"
              icon={BeakerIcon}
              calories={Math.round(nutritionPlan.protein * 4)}
            />
            <MacroCard
              title="Carbohydrates"
              amount={nutritionPlan.carbs}
              unit="g"
              percentage={macroPercentages.carbsPercent}
              color="text-orange-400"
              icon={ChartPieIcon}
              calories={Math.round(nutritionPlan.carbs * 4)}
            />
            <MacroCard
              title="Fats"
              amount={nutritionPlan.fats}
              unit="g"
              percentage={macroPercentages.fatsPercent}
              color="text-yellow-400"
              icon={ClockIcon}
              calories={Math.round(nutritionPlan.fats * 9)}
            />
          </div>
        </div>

        {/* Macro Distribution Chart */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700/50 mb-10">
          <h3 className="text-2xl font-bold text-white mb-6">Macro Distribution</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-white">Protein ({macroPercentages.proteinPercent}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-white">Carbs ({macroPercentages.carbsPercent}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-white">Fats ({macroPercentages.fatsPercent}%)</span>
            </div>
          </div>
          <div className="h-6 flex rounded-lg overflow-hidden">
            <div
              className="bg-blue-500 transition-all duration-500"
              style={{ width: `${macroPercentages.proteinPercent}%` }}
            />
            <div
              className="bg-orange-500 transition-all duration-500"
              style={{ width: `${macroPercentages.carbsPercent}%` }}
            />
            <div
              className="bg-yellow-500 transition-all duration-500"
              style={{ width: `${macroPercentages.fatsPercent}%` }}
            />
          </div>
        </div>

        {/* Nutrition Tips */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-bold text-white mb-6">Nutrition Strategy & Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 bg-gray-700 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Focus on Protein</h3>
                <p className="text-gray-400 text-sm">
                  Protein is crucial for muscle repair and satiety. Distribute your intake evenly across all meals.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-700 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Consistent Timing</h3>
                <p className="text-gray-400 text-sm">
                  Try to eat your {nutritionPlan.mealFrequency} meals at similar times each day to regulate hunger and energy.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-700 rounded-lg">
              <WaterDropIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Hydration Goal</h3>
                <p className="text-gray-400 text-sm">
                  Ensure you hit your target of {nutritionPlan.waterIntake} liters daily, especially around workouts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-700 rounded-lg">
              <ChartPieIcon className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Prioritize Whole Foods</h3>
                <p className="text-gray-400 text-sm">
                  Focus on lean proteins, complex carbohydrates, and healthy fats from unprocessed sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionPlanPage

