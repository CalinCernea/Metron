import React, { createContext, useContext, useState } from 'react'

export interface OnboardingData {
  // Personal Information
  name: string
  age: number | ''
  sex: 'male' | 'female' | 'other' | ''
  height: number | '' // in cm
  weight: number | '' // in kg
  dateOfBirth: string

  // Activity Level
  activityLevel: 'sedentary' | 'lightly_active' | 'active' | 'very_active' | ''

  // Fitness Goals & Experience
  goals: string[] // array of selected goals
  experience: 'untrained' | 'beginner' | 'intermediate' | 'advanced' | ''

  // Training Preferences
  trainingDays: number[] // 0-6 representing days of week
  sessionDuration: number | '' // in minutes
  trainingLocation: 'gym' | 'home' | ''

  // Muscle Groups
  muscleGroups: {
    [key: string]: 'none' | 'normal' | 'intense'
  }

  // Dietary Restrictions
  allergies: string[]
  dietaryPreferences: string[]

  // Progress Scale
  weeklyProgressGoal: 'lose_weight' | 'gain_weight' | 'gain_muscle' | ''
  progressAmount: number | '' // kg per week
}

interface OnboardingContextType {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  resetData: () => void
}

const defaultData: OnboardingData = {
  name: '',
  age: '',
  sex: '',
  height: '',
  weight: '',
  dateOfBirth: '',
  activityLevel: '',
  goals: [],
  experience: '',
  trainingDays: [],
  sessionDuration: '',
  trainingLocation: '',
  muscleGroups: {},
  allergies: [],
  dietaryPreferences: [],
  weeklyProgressGoal: '',
  progressAmount: '',
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>(defaultData)

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const resetData = () => {
    setData(defaultData)
  }

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

