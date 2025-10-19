import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

const TrainingPreferences: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const daysOfWeek = [
    { id: 0, label: 'Monday' },
    { id: 1, label: 'Tuesday' },
    { id: 2, label: 'Wednesday' },
    { id: 3, label: 'Thursday' },
    { id: 4, label: 'Friday' },
    { id: 5, label: 'Saturday' },
    { id: 6, label: 'Sunday' },
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

    if (data.trainingDays.length === 0) newErrors.trainingDays = 'Please select at least one training day'
    if (!data.sessionDuration) newErrors.sessionDuration = 'Please select session duration'
    if (!data.trainingLocation) newErrors.trainingLocation = 'Please select training location'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/muscle-groups')
    }
  }

  return (
    <OnboardingLayout
      step={4}
      totalSteps={7}
      title="Training Preferences"
      subtitle="Customize your training schedule and location"
      onNext={handleNext}
      onBack={() => navigate('/onboarding/fitness-goals')}
    >
      <div className="space-y-8">
        {/* Days of Week */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Which days will you train?</h3>
          <div className="grid grid-cols-4 gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                  data.trainingDays.includes(day.id)
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10 text-blue-400'
                    : 'border-slate-600 text-gray-300 hover:border-slate-500'
                }`}
              >
                {day.label.slice(0, 3)}
              </button>
            ))}
          </div>
          {errors.trainingDays && <p className="text-red-400 text-sm mt-2">{errors.trainingDays}</p>}
        </div>

        {/* Session Duration */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">How long per session?</h3>
          <div className="grid grid-cols-3 gap-3">
            {sessionDurations.map((duration) => (
              <button
                key={duration}
                onClick={() => {
                  updateData({ sessionDuration: duration })
                  if (errors.sessionDuration) {
                    setErrors({ ...errors, sessionDuration: '' })
                  }
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                  data.sessionDuration === duration
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10 text-blue-400'
                    : 'border-slate-600 text-gray-300 hover:border-slate-500'
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>
          {errors.sessionDuration && <p className="text-red-400 text-sm mt-2">{errors.sessionDuration}</p>}
        </div>

        {/* Training Location */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Where will you train?</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'gym', label: 'Gym', icon: '🏋️' },
              { id: 'home', label: 'Home', icon: '🏠' },
            ].map((location) => (
              <button
                key={location.id}
                onClick={() => {
                  updateData({ trainingLocation: location.id as any })
                  if (errors.trainingLocation) {
                    setErrors({ ...errors, trainingLocation: '' })
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  data.trainingLocation === location.id
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{location.icon}</span>
                  <span className="font-semibold text-white">{location.label}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.trainingLocation && <p className="text-red-400 text-sm mt-2">{errors.trainingLocation}</p>}
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default TrainingPreferences

