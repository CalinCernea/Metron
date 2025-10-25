import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { HeartIcon, BoltIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, FireIcon, HandRaisedIcon, UserGroupIcon, AcademicCapIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const MuscleGroups: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [error, setError] = useState('')

  const muscleGroupsList = [
    { id: 'chest', label: 'Chest', icon: HeartIcon },
    { id: 'back', label: 'Back', icon: ArrowDownCircleIcon },
    { id: 'shoulders', label: 'Shoulders', icon: ArrowUpCircleIcon },
    { id: 'biceps', label: 'Biceps', icon: UserGroupIcon },
    { id: 'triceps', label: 'Triceps', icon: AcademicCapIcon },
    { id: 'legs', label: 'Legs', icon: BoltIcon },
    { id: 'abs', label: 'Abs', icon: FireIcon },
  ]

  const intensities = [
    { id: 'none', label: 'Skip', color: 'gray', description: 'Do not include exercises for this group.' },
    { id: 'normal', label: 'Normal', color: 'blue', description: 'Standard volume and frequency.' },
    { id: 'intense', label: 'Intense', color: 'red', description: 'High volume and priority for this group.' },
  ]

  const handleIntensityChange = (muscleId: string, intensity: string) => {
    const updatedMuscles = {
      ...data.muscleGroups,
      [muscleId]: intensity,
    }
    updateData({ muscleGroups: updatedMuscles })
    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    const selectedMuscles = Object.values(data.muscleGroups).filter((intensity) => intensity !== 'none')
    if (selectedMuscles.length === 0) {
      setError('Please select at least one muscle group to train with Normal or Intense focus.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/dietary-restrictions')
    }
  }
  
  const isNextDisabled = Object.values(data.muscleGroups).filter((intensity) => intensity !== 'none').length === 0

  return (
    <OnboardingLayout
      step={5}
      totalSteps={7}
      title="Muscle Group Focus"
      subtitle="Prioritize muscle groups for your workout plan."
      onNext={handleNext}
      onBack={() => navigate('/onboarding/training-preferences')}
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-4">
        {muscleGroupsList.map((muscle) => {
          const IconComponent = muscle.icon
          const currentIntensity = data.muscleGroups[muscle.id] || 'none'

          return (
            <div key={muscle.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <IconComponent className="h-6 w-6 text-blue-400" />
                <h4 className="font-bold text-white text-lg">{muscle.label}</h4>
              </div>
              <div className="flex gap-3">
                {intensities.map((intensity) => {
                  const isSelected = currentIntensity === intensity.id
                  const baseClass = 'flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200'
                  let selectedClass = ''

                  if (isSelected) {
                    if (intensity.id === 'none') selectedClass = 'bg-gray-600 text-white shadow-lg shadow-gray-600/30'
                    if (intensity.id === 'normal') selectedClass = 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    if (intensity.id === 'intense') selectedClass = 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  } else {
                    selectedClass = 'bg-gray-800 text-gray-300 hover:bg-gray-600'
                  }

                  return (
                    <button
                      key={intensity.id}
                      onClick={() => handleIntensityChange(muscle.id, intensity.id)}
                      className={`${baseClass} ${selectedClass}`}
                      title={intensity.description}
                    >
                      {intensity.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </OnboardingLayout>
  )
}

export default MuscleGroups

