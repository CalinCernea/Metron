import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

const FitnessGoals: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const goals = [
    { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
    { id: 'gain_strength', label: 'Gain Strength', icon: '🏋️' },
    { id: 'lose_weight', label: 'Lose Weight', icon: '⚖️' },
    { id: 'get_leaner', label: 'Get Leaner', icon: '✨' },
    { id: 'get_active', label: 'Get Active', icon: '🚴' },
    { id: 'overall_health', label: 'Overall Health', icon: '❤️' },
    { id: 'gain_all', label: 'Gain Muscle, Strength & Get Leaner', icon: '🎯' },
    { id: 'other', label: 'Other', icon: '🤔' },
  ]

  const experiences = [
    { id: 'untrained', label: 'Untrained', description: 'Not training' },
    { id: 'beginner', label: 'Beginner', description: 'Training for 1 year continuously' },
    { id: 'intermediate', label: 'Intermediate', description: 'Training for more than 2 years' },
    { id: 'advanced', label: 'Advanced', description: '5+ years of training' },
  ]

  const toggleGoal = (goal: string) => {
    const updatedGoals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal]
    updateData({ goals: updatedGoals })
    if (errors.goals) {
      setErrors({ ...errors, goals: '' })
    }
  }

  const handleExperienceChange = (exp: string) => {
    updateData({ experience: exp as any })
    if (errors.experience) {
      setErrors({ ...errors, experience: '' })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (data.goals.length === 0) newErrors.goals = 'Please select at least one goal'
    if (!data.experience) newErrors.experience = 'Please select your experience level'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/training-preferences')
    }
  }

  return (
    <OnboardingLayout
      step={3}
      totalSteps={7}
      title="Fitness Goals & Experience"
      subtitle="What are your fitness goals and experience level?"
      onNext={handleNext}
      onBack={() => navigate('/onboarding/activity-level')}
    >
      <div className="space-y-8">
        {/* Goals */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">What are your main goals?</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  data.goals.includes(goal.id)
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-medium text-white text-sm">{goal.label}</span>
                  {data.goals.includes(goal.id) && (
                    <svg className="h-4 w-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.goals && <p className="text-red-400 text-sm mt-2">{errors.goals}</p>}
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">What's your training experience?</h3>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <button
                key={exp.id}
                onClick={() => handleExperienceChange(exp.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  data.experience === exp.id
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{exp.label}</h4>
                    <p className="text-gray-400 text-sm">{exp.description}</p>
                  </div>
                  {data.experience === exp.id && (
                    <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.experience && <p className="text-red-400 text-sm mt-2">{errors.experience}</p>}
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default FitnessGoals

