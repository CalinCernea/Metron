import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  UserIcon,
  BoltIcon,
  CalendarDaysIcon,
  DumbbellIcon,
  UtensilsIcon,
  ChartBarIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import { format } from 'date-fns'

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

  const SummarySection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; editRoute: string }> = ({ title, icon: Icon, children, editRoute }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <Icon className="h-6 w-6 text-blue-400" />
          {title}
        </h2>
        <button
          onClick={() => navigate(editRoute)}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Edit
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )

  const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-semibold text-base">{value}</p>
    </div>
  )

  const formatGoal = (goal: string) => goal.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Final Review</h1>
          <p className="text-gray-400 text-lg">Your personalized plan is ready to be created. Please review your details.</p>
        </div>

        {/* Summary Sections */}
        <div className="space-y-8 mb-10">
          
          {/* Personal Information */}
          <SummarySection title="Personal Information" icon={UserIcon} editRoute="/onboarding/personal-info">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem label="Name" value={data.name} />
              <DetailItem label="Age" value={`${data.age} years`} />
              <DetailItem label="Sex" value={data.sex ? data.sex.charAt(0).toUpperCase() + data.sex.slice(1) : 'N/A'} />
              <DetailItem label="Date of Birth" value={data.dateOfBirth ? format(new Date(data.dateOfBirth), 'MMM dd, yyyy') : 'N/A'} />
              <DetailItem label="Height" value={`${data.height} cm`} />
              <DetailItem label="Weight" value={`${data.weight} kg`} />
            </div>
          </SummarySection>

          {/* Activity & Goals */}
          <SummarySection title="Activity & Goals" icon={BoltIcon} editRoute="/onboarding/fitness-goals">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem label="Activity Level" value={formatGoal(data.activityLevel || 'N/A')} />
              <DetailItem label="Experience Level" value={formatGoal(data.experience || 'N/A')} />
              <div className="md:col-span-3">
                <p className="text-gray-400 text-sm">Fitness Goals</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.goals.map((goal) => (
                    <span key={goal} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-600">
                      {formatGoal(goal)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SummarySection>

          {/* Training Details */}
          <SummarySection title="Training Details" icon={DumbbellIcon} editRoute="/onboarding/training-preferences">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem label="Session Duration" value={`${data.sessionDuration} minutes`} />
              <DetailItem label="Training Location" value={data.trainingLocation ? data.trainingLocation.charAt(0).toUpperCase() + data.trainingLocation.slice(1) : 'N/A'} />
              <div className="md:col-span-3">
                <p className="text-gray-400 text-sm">Training Days</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.trainingDays.map((day) => (
                    <span key={day} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-600">
                      {daysOfWeek[day]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SummarySection>
          
          {/* Muscle Groups */}
          <SummarySection title="Muscle Group Focus" icon={DumbbellIcon} editRoute="/onboarding/muscle-groups">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(data.muscleGroups).map(([muscle, intensity]) => (
                intensity !== 'none' && (
                  <div key={muscle} className="flex flex-col bg-gray-700 p-3 rounded-lg border border-gray-600">
                    <p className="text-white capitalize font-medium">{muscle}</p>
                    <span
                      className={`text-xs font-semibold mt-1 ${
                        intensity === 'normal' ? 'text-blue-400' : 'text-red-400'
                      }`}
                    >
                      {intensity === 'normal' ? 'Normal Focus' : 'Intense Focus'}
                    </span>
                  </div>
                )
              ))}
            </div>
          </SummarySection>

          {/* Dietary Info */}
          <SummarySection title="Dietary Information" icon={UtensilsIcon} editRoute="/onboarding/dietary-restrictions">
            <div className="space-y-4">
              {data.allergies.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">Allergies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.allergies.map((allergy) => (
                      <span key={allergy} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-600">
                        {allergy.charAt(0).toUpperCase() + allergy.slice(1).replace(/_/g, ' ')}
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
                      <span key={pref} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-600">
                        {pref.charAt(0).toUpperCase() + pref.slice(1).replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SummarySection>

          {/* Progress Goals */}
          <SummarySection title="Weekly Progress Goal" icon={ChartBarIcon} editRoute="/onboarding/progress-scale">
            <DetailItem label={formatGoal(data.weeklyProgressGoal || 'N/A')} value={<span className="text-blue-400">{data.progressAmount} kg per week</span>} />
          </SummarySection>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-8 font-medium">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/onboarding/progress-scale')}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Go Back & Edit
          </button>
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5" />
                Creating Your Plan...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Complete Setup & Go to Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Summary

