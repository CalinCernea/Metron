import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { HomeIcon, BoltIcon, FireIcon, SunIcon } from '@heroicons/react/24/outline'

const ActivityLevel: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [error, setError] = useState('')

  const activityLevels = [
    {
      id: 'sedentary',
      label: 'Sedentary',
      description: 'Little or no exercise, mostly desk work.',
      icon: HomeIcon,
    },
    {
      id: 'lightly_active',
      label: 'Lightly Active',
      description: 'Light exercise or sports 1-3 days per week.',
      icon: SunIcon,
    },
    {
      id: 'active',
      label: 'Active',
      description: 'Moderate exercise or sports 3-5 days per week.',
      icon: FireIcon,
    },
    {
      id: 'very_active',
      label: 'Very Active',
      description: 'Intense exercise 6-7 days per week, or physical job.',
      icon: BoltIcon,
    },
  ]

  const handleSelect = (level: string) => {
    updateData({ activityLevel: level as any })
    setError('')
  }

  const handleNext = () => {
    if (!data.activityLevel) {
      setError('Please select your activity level to continue.')
      return
    }
    navigate('/onboarding/fitness-goals')
  }

  return (
    <OnboardingLayout
      step={2}
      totalSteps={7}
      title="Your Activity Level"
      subtitle="How active are you on a typical week? This helps us calculate your calorie needs."
      onNext={handleNext}
      onBack={() => navigate('/onboarding/personal-info')}
      isNextDisabled={!data.activityLevel}
    >
      <div className="space-y-4">
        {activityLevels.map((level) => {
          const isSelected = data.activityLevel === level.id
          const IconComponent = level.icon
          return (
            <button
              key={level.id}
              onClick={() => handleSelect(level.id)}
              className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700/80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{level.label}</h3>
                  <p className="text-gray-400 text-sm mt-1">{level.description}</p>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircleIcon className="h-7 w-7 text-blue-500" />
                  </div>
                )}
              </div>
            </button>
          )
        })}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </OnboardingLayout>
  )
}

export default ActivityLevel

