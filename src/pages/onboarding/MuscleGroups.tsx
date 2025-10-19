import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

const MuscleGroups: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [error, setError] = useState('')

  const muscleGroupsList = [
    { id: 'chest', label: 'Chest', icon: '🫀' },
    { id: 'back', label: 'Back', icon: '🔙' },
    { id: 'shoulders', label: 'Shoulders', icon: '💪' },
    { id: 'biceps', label: 'Biceps', icon: '💪' },
    { id: 'triceps', label: 'Triceps', icon: '💪' },
    { id: 'forearms', label: 'Forearms', icon: '🦾' },
    { id: 'legs', label: 'Legs', icon: '🦵' },
    { id: 'glutes', label: 'Glutes', icon: '🍑' },
    { id: 'abs', label: 'Abs', icon: '⬜' },
    { id: 'calves', label: 'Calves', icon: '🦵' },
  ]

  const intensities = [
    { id: 'none', label: 'Not Training', color: 'gray' },
    { id: 'normal', label: 'Normal', color: 'blue' },
    { id: 'intense', label: 'Intense', color: 'red' },
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
      setError('Please select at least one muscle group to train')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/dietary-restrictions')
    }
  }

  return (
    <OnboardingLayout
      step={5}
      totalSteps={7}
      title="Muscle Groups"
      subtitle="Select which muscle groups you want to train and at what intensity"
      onNext={handleNext}
      onBack={() => navigate('/onboarding/training-preferences')}
    >
      <div className="space-y-4">
        {muscleGroupsList.map((muscle) => (
          <div key={muscle.id} className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{muscle.icon}</span>
                <h4 className="font-semibold text-white">{muscle.label}</h4>
              </div>
            </div>
            <div className="flex gap-2">
              {intensities.map((intensity) => (
                <button
                  key={intensity.id}
                  onClick={() => handleIntensityChange(muscle.id, intensity.id)}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    data.muscleGroups[muscle.id] === intensity.id
                      ? intensity.id === 'none'
                        ? 'bg-gray-600 text-white'
                        : intensity.id === 'normal'
                          ? 'bg-blue-600 text-white'
                          : 'bg-red-600 text-white'
                      : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                  }`}
                >
                  {intensity.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </OnboardingLayout>
  )
}

export default MuscleGroups

