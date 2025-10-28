import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { generateWorkoutPlan, getWorkoutIntensity, getProgressionRecommendations, WorkoutPlan } from '../lib/workoutGenerator'
import { OnboardingData } from '../context/OnboardingContext'
import {
  ArrowLeftIcon,
  DumbbellIcon,
  CalendarDaysIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid'

// Helper component for displaying plan details
const DetailCard: React.FC<{ label: string; value: string; color: string; icon: React.ElementType }> = ({ label, value, color, icon: Icon }) => (
  <div className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700/50">
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`h-6 w-6 ${color}`} />
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
    <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
  </div>
)

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-white text-lg">Generating your personalized workout plan...</p>
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
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center mx-auto gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <DumbbellIcon className="h-7 w-7 text-orange-400" />
            {workoutPlan.name}
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
        {/* Plan Overview */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Program Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DetailCard
              label="Days Per Week"
              value={`${workoutPlan.daysPerWeek} Days`}
              color="text-blue-400"
              icon={CalendarDaysIcon}
            />
            <DetailCard
              label="Difficulty"
              value={getWorkoutIntensity(workoutPlan.difficulty)}
              color="text-red-400"
              icon={TrophyIcon}
            />
            <DetailCard
              label="Duration"
              value={`${workoutPlan.duration} Weeks`}
              color="text-green-400"
              icon={ClockIcon}
            />
            <DetailCard
              label="Location"
              value={workoutPlan.sessions[0]?.exercises[0]?.equipment.includes('Gym') ? 'Gym' : 'Home'}
              color="text-yellow-400"
              icon={MapPinIcon}
            />
          </div>
        </div>

        {/* Plan Description */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 mb-10">
          <p className="text-gray-300 mb-4">{workoutPlan.description}</p>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-orange-400">💡 Tip:</span> This plan is tailored to your goals and experience. Focus on form over weight, especially in the first few weeks.
            </p>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Weekly Schedule</h2>
          <div className="space-y-4">
            {workoutPlan.sessions.map((session, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
                {/* Day Header */}
                <button
                  onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">{session.day}</h3>
                    <p className="text-gray-400 text-sm">
                      Focus: {session.focusMuscles.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-medium">{session.exercises.length} exercises</span>
                    <ChevronDownIcon
                      className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${expandedDay === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedDay === index && (
                  <div className="border-t border-gray-700 px-6 py-6 bg-gray-700/50">
                    {/* Notes */}
                    <div className="mb-6 pb-6 border-b border-gray-600">
                      <p className="text-gray-300 text-sm">
                        <span className="font-semibold text-orange-300">📝 Session Note:</span> {session.notes}
                      </p>
                    </div>

                    {/* Exercises */}
                    <div className="space-y-4">
                      {session.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-bold text-lg">{exIndex + 1}. {exercise.name}</h4>
                              <p className="text-gray-400 text-sm">{exercise.description}</p>
                            </div>
                            <span className="text-xs px-3 py-1 bg-red-600 text-white rounded-full font-semibold">
                              {exercise.difficulty}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-600">
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
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-bold text-white mb-6">Progression Strategy</h2>
          <div className="space-y-4">
            {progressionTips.map((tip, index) => (
              <div key={index} className="flex gap-4 p-3 bg-gray-700 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
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

