import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'
import { CheckCircleIcon, ClockIcon, HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid'

const TrainingPreferences: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const daysOfWeek = [
    { id: 0, label: 'Mon', full: 'Monday' },
    { id: 1, label: 'Tue', full: 'Tuesday' },
    { id: 2, label: 'Wed', full: 'Wednesday' },
    { id: 3, label: 'Thu', full: 'Thursday' },
    { id: 4, label: 'Fri', full: 'Friday' },
    { id: 5, label: 'Sat', full: 'Saturday' },
    { id: 6, label: 'Sun', full: 'Sunday' },
  ]

  const sessionDurations = [30, 45, 60, 75, 90, 120]

  const toggleDay = (day: number) => {
    const updatedDays = data.trainingDays.includes(day)
      ? data.trainingDays.filter((d) => d !== day)
      : [...data.trainingDays, day]
    updateData({ trainingDays: updatedDays })
    if (errors.trainingDays) {
      setErrors({ ...errors, trainingDays: '' })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (data.trainingDays.length === 0) newErrors.trainingDays = 'Please select at least one training day.'
    if (!data.sessionDuration) newErrors.sessionDuration = 'Please select session duration.'
    if (!data.trainingLocation) newErrors.trainingLocation = 'Please select training location.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/muscle-groups')
    }
  }

  const isNextDisabled = data.trainingDays.length === 0 || !data.sessionDuration || !data.trainingLocation

  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      title="Training Preferences"
      subtitle="Tell us when and where you plan to train."
      onNext={handleNext}
      onBack={() => navigate('/onboarding/fitness-goals')}
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-8">
        {/* Days of Week */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Which days will you train?</h3>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => {
              const isSelected = data.trainingDays.includes(day.id)
              return (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  title={day.full}
                  className={`p-3 rounded-full border-2 transition-all duration-200 font-bold text-sm h-12 w-12 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'border-gray-700 bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
          {errors.trainingDays && <p className="text-red-400 text-sm mt-4">{errors.trainingDays}</p>}
        </div>

        {/* Session Duration */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">How long per session? (min)</h3>
          <div className="grid grid-cols-3 gap-3">
            {sessionDurations.map((duration) => {
              const isSelected = data.sessionDuration === duration
              return (
                <button
                  key={duration}
                  onClick={() => {
                    updateData({ sessionDuration: duration })
                    if (errors.sessionDuration) {
                      setErrors({ ...errors, sessionDuration: '' })
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 font-bold text-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700 bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <ClockIcon className="h-6 w-6 mb-1" />
                    {duration} min
                  </div>
                </button>
              )
            })}
          </div>
          {errors.sessionDuration && <p className="text-red-400 text-sm mt-4">{errors.sessionDuration}</p>}
        </div>

        {/* Training Location */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Where will you train?</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'gym', label: 'Gym', icon: BuildingOfficeIcon },
              { id: 'home', label: 'Home', icon: HomeIcon },
            ].map((location) => {
              const isSelected = data.trainingLocation === location.id
              const IconComponent = location.icon
              return (
                <button
                  key={location.id}
                  onClick={() => {
                    updateData({ trainingLocation: location.id as any })
                    if (errors.trainingLocation) {
                      setErrors({ ...errors, trainingLocation: '' })
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-6 w-6 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span className="font-bold text-white">{location.label}</span>
                    {isSelected && <CheckCircleIcon className="h-5 w-5 text-blue-500 ml-auto" />}
                  </div>
                </button>
              )
            })}
          </div>
          {errors.trainingLocation && <p className="text-red-400 text-sm mt-4">{errors.trainingLocation}</p>}
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default TrainingPreferences

