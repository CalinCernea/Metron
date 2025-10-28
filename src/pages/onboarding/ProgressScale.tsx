import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'
import { CheckCircleIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, BoltIcon } from '@heroicons/react/24/solid'

const ProgressScale: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const progressGoals = [
    {
      id: 'lose_weight',
      label: 'Lose Weight',
      icon: ArrowDownCircleIcon,
      description: 'How many kg per week do you want to lose?',
      range: { min: 0.25, max: 1.5, step: 0.25 },
      unit: 'kg',
    },
    {
      id: 'gain_weight',
      label: 'Gain Weight',
      icon: ArrowUpCircleIcon,
      description: 'How many kg per week do you want to gain?',
      range: { min: 0.25, max: 1.5, step: 0.25 },
      unit: 'kg',
    },
    {
      id: 'gain_muscle',
      label: 'Gain Muscle',
      icon: BoltIcon,
      description: 'How many kg of muscle per week do you want to gain?',
      range: { min: 0.1, max: 0.5, step: 0.1 }, // Adjusted range for muscle gain
      unit: 'kg',
    },
  ]

  const selectedGoal = progressGoals.find((g) => g.id === data.weeklyProgressGoal)

  const handleGoalSelect = (goal: string) => {
    // Reset amount when goal changes, setting it to the minimum of the new range
    const newGoal = progressGoals.find(g => g.id === goal)
    const newAmount = newGoal ? newGoal.range.min : 0
    updateData({ weeklyProgressGoal: goal as any, progressAmount: newAmount })
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

    if (!data.weeklyProgressGoal) newErrors.weeklyProgressGoal = 'Please select a progress goal.'
    if (!data.progressAmount || data.progressAmount <= 0) newErrors.progressAmount = 'Please select the amount.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/summary')
    }
  }

  const isNextDisabled = !data.weeklyProgressGoal || !data.progressAmount || data.progressAmount <= 0

  // Utility function to generate quick-select amounts
  const getQuickSelectAmounts = (range: { min: number, max: number, step: number }) => {
    const amounts: number[] = []
    for (let i = range.min; i <= range.max; i += range.step) {
      amounts.push(parseFloat(i.toFixed(2))) // Fix floating point issues
    }
    return amounts
  }

  return (
    <OnboardingLayout
      step={7}
      totalSteps={7}
      title="Progress Scale"
      subtitle="Set your weekly progress goals. We will adjust your plan accordingly."
      onNext={handleNext}
      onBack={() => navigate('/onboarding/dietary-restrictions')}
      nextButtonText="Review Summary"
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-8">
        {/* Goal Selection */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">What's your main progress goal?</h3>
          <div className="grid grid-cols-3 gap-3">
            {progressGoals.map((goal) => {
              const isSelected = data.weeklyProgressGoal === goal.id
              const IconComponent = goal.icon
              return (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left flex flex-col items-center justify-center h-full ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700/80'
                  }`}
                >
                  <IconComponent className={`h-8 w-8 mb-2 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                  <h4 className="font-bold text-white text-sm text-center">{goal.label}</h4>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {errors.weeklyProgressGoal && <p className="text-red-400 text-sm mt-4">{errors.weeklyProgressGoal}</p>}
        </div>

        {/* Amount Selection */}
        {selectedGoal && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">{selectedGoal.description}</h3>
            
            <div className="mb-6 p-4 bg-gray-700/50 rounded-xl border border-gray-700">
              <p className="text-3xl font-extrabold text-center text-blue-400 mb-4">
                {data.progressAmount ? `${data.progressAmount} ${selectedGoal.unit}/week` : 'Select Amount'}
              </p>

              {/* Slider */}
              <input
                type="range"
                min={selectedGoal.range.min}
                max={selectedGoal.range.max}
                step={selectedGoal.range.step}
                value={data.progressAmount || selectedGoal.range.min}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{selectedGoal.range.min} {selectedGoal.unit}</span>
                <span>{selectedGoal.range.max} {selectedGoal.unit}</span>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {getQuickSelectAmounts(selectedGoal.range).map((amount) => {
                const isSelected = data.progressAmount === amount
                return (
                  <button
                    key={amount}
                    onClick={() => handleAmountChange(amount)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20'
                        : 'border-gray-700 bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                    }`}
                  >
                    {amount} {selectedGoal.unit}
                  </button>
                )
              })}
            </div>

            {errors.progressAmount && <p className="text-red-400 text-sm mt-4">{errors.progressAmount}</p>}
          </div>
        )}
      </div>
    </OnboardingLayout>
  )
}

export default ProgressScale

