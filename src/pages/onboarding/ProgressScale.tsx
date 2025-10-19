import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

const ProgressScale: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const progressGoals = [
    {
      id: 'lose_weight',
      label: 'Lose Weight',
      icon: '⬇️',
      description: 'How many kg per week do you want to lose?',
      range: { min: 0.25, max: 1.5, step: 0.25 },
    },
    {
      id: 'gain_weight',
      label: 'Gain Weight',
      icon: '⬆️',
      description: 'How many kg per week do you want to gain?',
      range: { min: 0.25, max: 1.5, step: 0.25 },
    },
    {
      id: 'gain_muscle',
      label: 'Gain Muscle',
      icon: '💪',
      description: 'How many kg of muscle per week do you want to gain?',
      range: { min: 0.25, max: 1, step: 0.25 },
    },
  ]

  const selectedGoal = progressGoals.find((g) => g.id === data.weeklyProgressGoal)

  const handleGoalSelect = (goal: string) => {
    updateData({ weeklyProgressGoal: goal as any, progressAmount: '' })
    if (errors.weeklyProgressGoal) {
      setErrors({ ...errors, weeklyProgressGoal: '' })
    }
  }

  const handleAmountChange = (amount: number) => {
    updateData({ progressAmount: amount })
    if (errors.progressAmount) {
      setErrors({ ...errors, progressAmount: '' })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!data.weeklyProgressGoal) newErrors.weeklyProgressGoal = 'Please select a progress goal'
    if (!data.progressAmount) newErrors.progressAmount = 'Please select the amount'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/summary')
    }
  }

  return (
    <OnboardingLayout
      step={7}
      totalSteps={7}
      title="Progress Scale"
      subtitle="Set your weekly progress goals"
      onNext={handleNext}
      onBack={() => navigate('/onboarding/dietary-restrictions')}
      nextButtonText="Review Summary"
    >
      <div className="space-y-8">
        {/* Goal Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">What's your main progress goal?</h3>
          <div className="space-y-3">
            {progressGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  data.weeklyProgressGoal === goal.id
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <h4 className="font-semibold text-white">{goal.label}</h4>
                  </div>
                  {data.weeklyProgressGoal === goal.id && (
                    <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.weeklyProgressGoal && <p className="text-red-400 text-sm mt-2">{errors.weeklyProgressGoal}</p>}
        </div>

        {/* Amount Selection */}
        {selectedGoal && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{selectedGoal.description}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {data.progressAmount ? `You selected: ${data.progressAmount} kg/week` : 'Slide to select'}
            </p>

            <div className="space-y-4">
              {/* Slider */}
              <input
                type="range"
                min={selectedGoal.range.min}
                max={selectedGoal.range.max}
                step={selectedGoal.range.step}
                value={data.progressAmount || selectedGoal.range.min}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from(
                  { length: Math.floor((selectedGoal.range.max - selectedGoal.range.min) / selectedGoal.range.step) + 1 },
                  (_, i) => selectedGoal.range.min + i * selectedGoal.range.step
                ).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountChange(amount)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                      data.progressAmount === amount
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10 text-blue-400'
                        : 'border-slate-600 text-gray-300 hover:border-slate-500'
                    }`}
                  >
                    {amount} kg
                  </button>
                ))}
              </div>
            </div>

            {errors.progressAmount && <p className="text-red-400 text-sm mt-2">{errors.progressAmount}</p>}
          </div>
        )}
      </div>
    </OnboardingLayout>
  )
}

export default ProgressScale

