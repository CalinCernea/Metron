import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

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
    if (customAllergy.trim() && !data.allergies.includes(customAllergy)) {
      updateData({ allergies: [...data.allergies, customAllergy] })
      setCustomAllergy('')
    }
  }

  const addCustomPreference = () => {
    if (customPreference.trim() && !data.dietaryPreferences.includes(customPreference)) {
      updateData({ dietaryPreferences: [...data.dietaryPreferences, customPreference] })
      setCustomPreference('')
    }
  }

  const handleNext = () => {
    navigate('/onboarding/progress-scale')
  }

  return (
    <OnboardingLayout
      step={6}
      totalSteps={7}
      title="Dietary Restrictions"
      subtitle="Tell us about your allergies and dietary preferences"
      onNext={handleNext}
      onBack={() => navigate('/onboarding/muscle-groups')}
    >
      <div className="space-y-8">
        {/* Allergies */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Do you have any allergies?</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {commonAllergies.map((allergy) => (
              <button
                key={allergy.id}
                onClick={() => toggleAllergy(allergy.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                  data.allergies.includes(allergy.id)
                    ? 'border-red-500 bg-red-500 bg-opacity-10 text-red-400'
                    : 'border-slate-600 text-gray-300 hover:border-slate-500'
                }`}
              >
                {allergy.label}
              </button>
            ))}
          </div>

          {/* Custom Allergy */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              placeholder="Add custom allergy..."
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomAllergy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>

          {/* Display custom allergies */}
          {data.allergies.filter((a) => !commonAllergies.find((ca) => ca.id === a)).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.allergies
                .filter((a) => !commonAllergies.find((ca) => ca.id === a))
                .map((allergy) => (
                  <div
                    key={allergy}
                    className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                  >
                    {allergy}
                    <button
                      onClick={() => toggleAllergy(allergy)}
                      className="hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Dietary Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Dietary preferences?</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {dietaryPreferences.map((pref) => (
              <button
                key={pref.id}
                onClick={() => togglePreference(pref.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                  data.dietaryPreferences.includes(pref.id)
                    ? 'border-green-500 bg-green-500 bg-opacity-10 text-green-400'
                    : 'border-slate-600 text-gray-300 hover:border-slate-500'
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>

          {/* Custom Preference */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customPreference}
              onChange={(e) => setCustomPreference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomPreference()}
              placeholder="Add custom preference..."
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomPreference}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>

          {/* Display custom preferences */}
          {data.dietaryPreferences.filter((p) => !dietaryPreferences.find((dp) => dp.id === p)).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.dietaryPreferences
                .filter((p) => !dietaryPreferences.find((dp) => dp.id === p))
                .map((pref) => (
                  <div
                    key={pref}
                    className="bg-green-500 bg-opacity-10 border border-green-500 text-green-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                  >
                    {pref}
                    <button
                      onClick={() => togglePreference(pref)}
                      className="hover:text-green-300"
                    >
                      ×
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

