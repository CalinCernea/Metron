import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { BoltIcon, ScaleIcon, HeartIcon, FireIcon, HandRaisedIcon, UserGroupIcon, AcademicCapIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const FitnessGoals: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const goals = [
    { id: 'gain_muscle', label: 'Gain Muscle', icon: BoltIcon, description: 'Increase muscle mass and definition.' },
    { id: 'gain_strength', label: 'Gain Strength', icon: ScaleIcon, description: 'Improve maximal lifting capacity.' },
    { id: 'lose_weight', label: 'Lose Weight', icon: FireIcon, description: 'Reduce overall body mass.' },
    { id: 'get_leaner', label: 'Get Leaner', icon: HeartIcon, description: 'Reduce body fat percentage.' },
    { id: 'get_active', label: 'Get Active', icon: HandRaisedIcon, description: 'Start a regular exercise routine.' },
    { id: 'overall_health', label: 'Overall Health', icon: UserGroupIcon, description: 'Improve energy and well-being.' },
    { id: 'gain_all', label: 'Muscle, Strength & Leaner', icon: AcademicCapIcon, description: 'A balanced approach to physique and performance.' },
    { id: 'other', label: 'Other', icon: QuestionMarkCircleIcon, description: 'Something else not listed here.' },
  ]

  const experiences = [
    { id: 'untrained', label: 'Untrained', description: 'Not currently training or just starting out.' },
    { id: 'beginner', label: 'Beginner', description: 'Training for less than 1 year continuously.' },
    { id: 'intermediate', label: 'Intermediate', description: 'Training for 1-3 years continuously.' },
    { id: 'advanced', label: 'Advanced', description: 'More than 3 years of continuous training.' },
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

    if (data.goals.length === 0) newErrors.goals = 'Please select at least one goal.'
    if (!data.experience) newErrors.experience = 'Please select your experience level.'

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
      title="Goals & Experience"
      subtitle="Select your primary fitness goals and tell us about your training background."
      onNext={handleNext}
      onBack={() => navigate('/onboarding/activity-level')}
      isNextDisabled={data.goals.length === 0 || !data.experience}
    >
      <div className="space-y-8">
        {/* Goals */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">What are your main goals? (Select all that apply)</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => {
              const isSelected = data.goals.includes(goal.id)
              const IconComponent = goal.icon
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left h-full flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`h-6 w-6 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span className="font-bold text-white text-base">{goal.label}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{goal.description}</p>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {errors.goals && <p className="text-red-400 text-sm mt-4">{errors.goals}</p>}
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">What's your training experience? (Select one)</h3>
          <div className="space-y-3">
            {experiences.map((exp) => {
              const isSelected = data.experience === exp.id
              return (
                <button
                  key={exp.id}
                  onClick={() => handleExperienceChange(exp.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{exp.label}</h4>
                      <p className="text-gray-400 text-sm mt-1">{exp.description}</p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-7 w-7 text-blue-500" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {errors.experience && <p className="text-red-400 text-sm mt-4">{errors.experience}</p>}
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default FitnessGoals

