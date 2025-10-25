import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'
import { CheckCircleIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon, LeafIcon } from '@heroicons/react/24/outline'

const DietaryRestrictions: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [customAllergy, setCustomAllergy] = useState('')
  const [customPreference, setCustomPreference] = useState('')

  const commonAllergies = [
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'tree_nuts', label: 'Tree Nuts' },
    { id: 'milk', label: 'Milk' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'fish', label: 'Fish' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'soy', label: 'Soy' },
    { id: 'wheat', label: 'Wheat' },
  ]

  const dietaryPreferences = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'gluten_free', label: 'Gluten Free' },
    { id: 'dairy_free', label: 'Dairy Free' },
    { id: 'low_carb', label: 'Low Carb' },
    { id: 'high_protein', label: 'High Protein' },
  ]

  const toggleAllergy = (allergy: string) => {
    const updatedAllergies = data.allergies.includes(allergy)
      ? data.allergies.filter((a) => a !== allergy)
      : [...data.allergies, allergy]
    updateData({ allergies: updatedAllergies })
  }

  const togglePreference = (preference: string) => {
    const updatedPreferences = data.dietaryPreferences.includes(preference)
      ? data.dietaryPreferences.filter((p) => p !== preference)
      : [...data.dietaryPreferences, preference]
    updateData({ dietaryPreferences: updatedPreferences })
  }

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim()
    if (trimmed && !data.allergies.includes(trimmed)) {
      updateData({ allergies: [...data.allergies, trimmed] })
      setCustomAllergy('')
    }
  }

  const addCustomPreference = () => {
    const trimmed = customPreference.trim()
    if (trimmed && !data.dietaryPreferences.includes(trimmed)) {
      updateData({ dietaryPreferences: [...data.dietaryPreferences, trimmed] })
      setCustomPreference('')
    }
  }

  const handleNext = () => {
    navigate('/onboarding/progress-scale')
  }

  const getCustomItems = (list: string[], commonList: { id: string, label: string }[]) =>
    list.filter((item) => !commonList.some((common) => common.id === item))

  return (
    <OnboardingLayout
      step={6}
      totalSteps={7}
      title="Dietary Restrictions & Preferences"
      subtitle="We will tailor your meal plan based on your needs and choices."
      onNext={handleNext}
      onBack={() => navigate('/onboarding/muscle-groups')}
    >
      <div className="space-y-8">
        {/* Allergies */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
            Food Allergies
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {commonAllergies.map((allergy) => {
              const isSelected = data.allergies.includes(allergy.id)
              return (
                <button
                  key={allergy.id}
                  onClick={() => toggleAllergy(allergy.id)}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium text-sm flex items-center gap-2 ${
                    isSelected
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-gray-700 bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                  }`}
                >
                  {allergy.label}
                  {isSelected && <CheckCircleIcon className="h-4 w-4 text-red-400" />}
                </button>
              )
            })}
          </div>

          {/* Custom Allergy Input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              placeholder="Add custom allergy (e.g., 'Mustard')"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomAllergy}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <PlusIcon className="h-5 w-5" />
              Add
            </button>
          </div>

          {/* Display custom allergies */}
          {getCustomItems(data.allergies, commonAllergies).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {getCustomItems(data.allergies, commonAllergies).map((allergy) => (
                <div
                  key={allergy}
                  className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {allergy}
                  <button
                    onClick={() => toggleAllergy(allergy)}
                    className="hover:text-red-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dietary Preferences */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <LeafIcon className="h-6 w-6 text-green-400" />
            Dietary Preferences
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {dietaryPreferences.map((pref) => {
              const isSelected = data.dietaryPreferences.includes(pref.id)
              return (
                <button
                  key={pref.id}
                  onClick={() => togglePreference(pref.id)}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium text-sm flex items-center gap-2 ${
                    isSelected
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-700 bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                  }`}
                >
                  {pref.label}
                  {isSelected && <CheckCircleIcon className="h-4 w-4 text-green-400" />}
                </button>
              )
            })}
          </div>

          {/* Custom Preference Input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={customPreference}
              onChange={(e) => setCustomPreference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomPreference()}
              placeholder="Add custom preference (e.g., 'Mediterranean')"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomPreference}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <PlusIcon className="h-5 w-5" />
              Add
            </button>
          </div>

          {/* Display custom preferences */}
          {getCustomItems(data.dietaryPreferences, dietaryPreferences).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {getCustomItems(data.dietaryPreferences, dietaryPreferences).map((pref) => (
                <div
                  key={pref}
                  className="bg-green-500/10 border border-green-500 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {pref}
                  <button
                    onClick={() => togglePreference(pref)}
                    className="hover:text-green-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default DietaryRestrictions

