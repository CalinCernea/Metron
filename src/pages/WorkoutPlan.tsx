import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateWorkoutPlan, getWorkoutIntensity, getProgressionRecommendations, WorkoutPlan } from '../lib/workoutGenerator'
import { OnboardingData } from '../context/OnboardingContext'

const WorkoutPlanPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedDay, setExpandedDay] = useState<number | null>(0)

  useEffect(() => {
    const fetchAndGenerateWorkout = async () => {
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

        // Generate workout plan
        const plan = generateWorkoutPlan(onboardingData)
        setWorkoutPlan(plan)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchAndGenerateWorkout()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white">Generating your workout plan...</p>
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

  if (!workoutPlan) {
    return null
  }

  const progressionTips = getProgressionRecommendations(workoutPlan.difficulty)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Your Workout Plan</h1>
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
        {/* Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Program Name</p>
            <p className="text-2xl font-bold text-white">{workoutPlan.name}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Days Per Week</p>
            <p className="text-2xl font-bold text-blue-400">{workoutPlan.daysPerWeek}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Duration</p>
            <p className="text-2xl font-bold text-green-400">{workoutPlan.duration} weeks</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Intensity</p>
            <p className="text-2xl font-bold text-orange-400">{getWorkoutIntensity(workoutPlan.difficulty)}</p>
          </div>
        </div>

        {/* Plan Description */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Program Overview</h2>
          <p className="text-gray-300 mb-4">{workoutPlan.description}</p>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">💡 Tip:</span> Follow this program consistently for {workoutPlan.duration} weeks. 
              After that, consider switching to a new program to avoid plateaus.
            </p>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Weekly Schedule</h2>
          <div className="space-y-4">
            {workoutPlan.sessions.map((session, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                {/* Day Header */}
                <button
                  onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">{session.day}</h3>
                    <p className="text-gray-400 text-sm">
                      {session.focusMuscles.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">{session.exercises.length} exercises</span>
                    <svg
                      className={`h-6 w-6 text-gray-400 transition-transform ${expandedDay === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedDay === index && (
                  <div className="border-t border-slate-700 px-6 py-6 bg-slate-700 bg-opacity-50">
                    {/* Notes */}
                    <div className="mb-6 pb-6 border-b border-slate-600">
                      <p className="text-gray-300 text-sm">
                        <span className="font-semibold">📝 Note:</span> {session.notes}
                      </p>
                    </div>

                    {/* Exercises */}
                    <div className="space-y-4">
                      {session.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="bg-slate-600 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-semibold">{exercise.name}</h4>
                              <p className="text-gray-400 text-sm">{exercise.description}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
                              {exercise.difficulty}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="text-gray-400 text-xs">Sets</p>
                              <p className="text-white font-semibold">{exercise.sets}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Reps</p>
                              <p className="text-white font-semibold">{exercise.reps}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Rest</p>
                              <p className="text-white font-semibold">{exercise.restSeconds}s</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Equipment</p>
                              <p className="text-white font-semibold text-sm">{exercise.equipment.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progression Tips */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Progression Tips</h2>
          <div className="space-y-4">
            {progressionTips.map((tip, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-2xl">📈</span>
                <p className="text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkoutPlanPage

