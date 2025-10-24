import React from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface OnboardingLayoutProps {
  step: number
  totalSteps: number
  title: string
  subtitle: string
  children: React.ReactNode
  onNext: () => void
  onBack: () => void
  nextButtonText?: string
  backButtonText?: string
  isLoading?: boolean
  isNextDisabled?: boolean
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextButtonText = 'Next',
  backButtonText = 'Back',
  isLoading = false,
  isNextDisabled = false,
}) => {
  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 animate-fade-in-up">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-blue-400">
              STEP {step} OF {totalSteps}
            </h2>
            <span className="text-sm font-semibold text-blue-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-700">
          <button
            onClick={onBack}
            disabled={step === 1 || isLoading}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            {backButtonText}
          </button>
          <button
            onClick={onNext}
            disabled={isLoading || isNextDisabled}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                {nextButtonText}
                <ArrowRightIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingLayout

