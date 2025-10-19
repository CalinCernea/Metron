import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

const ActivityLevel: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [error, setError] = useState('')

  const activityLevels = [
    {
      id: 'sedentary',
      label: 'Sedentary',
      description: 'Little or no exercise, mostly desk work',
      icon: '🪑',
    },
    {
      id: 'lightly_active',
      label: 'Lightly Active',
      description: 'Light exercise 1-3 days per week',
      icon: '🚶',
    },
    {
      id: 'active',
      label: 'Active',
      description: 'Moderate exercise 3-5 days per week',
      icon: '🏃',
    },
    {
      id: 'very_active',
      label: 'Very Active',
      description: 'Intense exercise 6-7 days per week',
      icon: '⚡',
    },
  ]

  const handleSelect = (level: string) => {
    updateData({ activityLevel: level as any })
    setError('')
  }

  const handleNext = () => {
    if (!data.activityLevel) {
      setError('Please select your activity level')
      return
    }
    navigate('/onboarding/fitness-goals')
  }

  return (
    <OnboardingLayout
      step={2}
      totalSteps={7}
      title="Activity Level"
      subtitle="How active are you in your daily life?"
      onNext={handleNext}
      onBack={() => navigate('/onboarding/personal-info')}
    >
      <div className="space-y-4">
        {activityLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => handleSelect(level.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              data.activityLevel === level.id
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{level.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">{level.label}</h3>
                <p className="text-gray-400 text-sm mt-1">{level.description}</p>
              </div>
              {data.activityLevel === level.id && (
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </OnboardingLayout>
  )
}

export default ActivityLevel

