import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateNutritionPlan, calculateMacroPercentages, NutritionPlan } from '../lib/nutritionCalculator'
import { OnboardingData } from '../context/OnboardingContext'

const NutritionPlan: React.FC = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white">Loading your nutrition plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-4">
              <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Your Nutrition Plan</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Daily Calorie Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <p className="text-blue-100 text-sm font-medium mb-2">Daily Calorie Target</p>
              <p className="text-5xl font-bold text-white mb-2">{nutritionPlan.calories}</p>
              <p className="text-blue-100">kcal per day</p>
              <p className="text-blue-200 text-sm mt-4">
                TDEE: {nutritionPlan.tdee} kcal
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <p className="text-green-100 text-sm font-medium mb-2">Water Intake</p>
              <p className="text-5xl font-bold text-white mb-2">{nutritionPlan.waterIntake}</p>
              <p className="text-green-100">liters per day</p>
              <p className="text-green-200 text-sm mt-4">
                Meals: {nutritionPlan.mealFrequency} per day
              </p>
            </div>
          </div>
        </div>

        {/* Macronutrients */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Daily Macronutrients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Protein */}
            <div className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Protein</h3>
                <span className="text-2xl">💪</span>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-2">{nutritionPlan.protein}g</p>
              <p className="text-gray-400 text-sm mb-2">{macroPercentages.proteinPercent}% of calories</p>
              <p className="text-gray-500 text-xs">
                {Math.round(nutritionPlan.protein * 4)} kcal
              </p>
            </div>

            {/* Carbs */}
            <div className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Carbs</h3>
                <span className="text-2xl">🌾</span>
              </div>
              <p className="text-3xl font-bold text-orange-400 mb-2">{nutritionPlan.carbs}g</p>
              <p className="text-gray-400 text-sm mb-2">{macroPercentages.carbsPercent}% of calories</p>
              <p className="text-gray-500 text-xs">
                {Math.round(nutritionPlan.carbs * 4)} kcal
              </p>
            </div>

            {/* Fats */}
            <div className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Fats</h3>
                <span className="text-2xl">🥑</span>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-2">{nutritionPlan.fats}g</p>
              <p className="text-gray-400 text-sm mb-2">{macroPercentages.fatsPercent}% of calories</p>
              <p className="text-gray-500 text-xs">
                {Math.round(nutritionPlan.fats * 9)} kcal
              </p>
            </div>
          </div>

          {/* Macro Distribution Chart */}
          <div className="bg-slate-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Macro Distribution</h3>
            <div className="flex items-end gap-2 h-48">
              {/* Protein Bar */}
              <div className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${macroPercentages.proteinPercent}%` }}
                />
                <p className="text-gray-300 text-sm mt-2">Protein</p>
                <p className="text-white font-semibold">{macroPercentages.proteinPercent}%</p>
              </div>

              {/* Carbs Bar */}
              <div className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${macroPercentages.carbsPercent}%` }}
                />
                <p className="text-gray-300 text-sm mt-2">Carbs</p>
                <p className="text-white font-semibold">{macroPercentages.carbsPercent}%</p>
              </div>

              {/* Fats Bar */}
              <div className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${macroPercentages.fatsPercent}%` }}
                />
                <p className="text-gray-300 text-sm mt-2">Fats</p>
                <p className="text-white font-semibold">{macroPercentages.fatsPercent}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Nutrition Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <span className="text-2xl">🥗</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Balanced Meals</h3>
                <p className="text-gray-400 text-sm">
                  Aim to include protein, carbs, and fats in each meal for balanced nutrition.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">⏰</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Meal Timing</h3>
                <p className="text-gray-400 text-sm">
                  Spread your meals throughout the day for consistent energy levels.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Track Progress</h3>
                <p className="text-gray-400 text-sm">
                  Monitor your weight and adjust calories if needed after 2-3 weeks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">💧</span>
              <div>
                <h3 className="text-white font-semibold mb-1">Stay Hydrated</h3>
                <p className="text-gray-400 text-sm">
                  Drink water throughout the day, especially around workouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionPlan

