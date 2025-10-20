import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const Summary: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useOnboarding()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleComplete = async () => {
    if (!user) {
      setError('You must be logged in to save your profile')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Save onboarding data to Supabase
      const { error: insertError } = await supabase.from('onboarding_data').insert([
        {
          user_id: user.id,
          name: data.name,
          age: data.age,
          sex: data.sex,
          height: data.height,
          weight: data.weight,
          date_of_birth: data.dateOfBirth,
          activity_level: data.activityLevel,
          goals: data.goals,
          experience: data.experience,
          training_days: data.trainingDays,
          session_duration: data.sessionDuration,
          training_location: data.trainingLocation,
          muscle_groups: data.muscleGroups,
          allergies: data.allergies,
          dietary_preferences: data.dietaryPreferences,
          weekly_progress_goal: data.weeklyProgressGoal,
          progress_amount: data.progressAmount,
        },
      ])

      if (insertError) {
        console.error('Error saving onboarding data:', insertError)
        setError('Failed to save your profile. Please try again.')
        setIsLoading(false)
        return
      }

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Review Your Profile</h1>
          <p className="text-gray-400">Make sure everything looks correct before we create your plan</p>
        </div>

        {/* Summary Sections */}
        <div className="space-y-6 mb-8">
          {/* Personal Information */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>👤</span> Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white font-semibold">{data.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Age</p>
                <p className="text-white font-semibold">{data.age} years</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Sex</p>
                <p className="text-white font-semibold capitalize">{data.sex}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date of Birth</p>
                <p className="text-white font-semibold">{data.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Height</p>
                <p className="text-white font-semibold">{data.height} cm</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Weight</p>
                <p className="text-white font-semibold">{data.weight} kg</p>
              </div>
            </div>
          </div>

          {/* Activity & Goals */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Activity & Goals
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Activity Level</p>
                <p className="text-white font-semibold capitalize">{data.activityLevel?.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fitness Goals</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.goals.map((goal) => (
                    <span key={goal} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {goal.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Experience Level</p>
                <p className="text-white font-semibold capitalize">{data.experience}</p>
              </div>
            </div>
          </div>

          {/* Training Details */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏋️</span> Training Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Training Days</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.trainingDays.map((day) => (
                    <span key={day} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      {daysOfWeek[day]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Session Duration</p>
                  <p className="text-white font-semibold">{data.sessionDuration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Training Location</p>
                  <p className="text-white font-semibold capitalize">{data.trainingLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Muscle Groups */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💪</span> Muscle Groups
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.muscleGroups).map(([muscle, intensity]) => (
                intensity !== 'none' && (
                  <div key={muscle} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                    <p className="text-white capitalize font-medium">{muscle}</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        intensity === 'normal'
                          ? 'bg-blue-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {intensity === 'normal' ? 'Normal' : 'Intense'}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Dietary Info */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🍽️</span> Dietary Information
            </h2>
            <div className="space-y-4">
              {data.allergies.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">Allergies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.allergies.map((allergy) => (
                      <span key={allergy} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.dietaryPreferences.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">Dietary Preferences</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.dietaryPreferences.map((pref) => (
                      <span key={pref} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {pref.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Goals */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📈</span> Weekly Progress Goal
            </h2>
            <div className="space-y-2">
              <p className="text-white font-semibold capitalize">{data.weeklyProgressGoal?.replace(/_/g, ' ')}</p>
              <p className="text-gray-400">
                Target: <span className="text-white font-semibold">{data.progressAmount} kg per week</span>
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-8">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/onboarding/progress-scale')}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Your Plan...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete Setup
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Summary

