import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import OnboardingLayout from '../../components/OnboardingLayout'

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate()
  const { data, updateData } = useOnboarding()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (field: string, value: any) => {
    updateData({ [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!data.name.trim()) newErrors.name = 'Name is required'
    if (!data.age || data.age < 13 || data.age > 120) newErrors.age = 'Please enter a valid age (13-120)'
    if (!data.sex) newErrors.sex = 'Please select your sex'
    if (!data.height || data.height < 100 || data.height > 250) newErrors.height = 'Please enter a valid height (100-250 cm)'
    if (!data.weight || data.weight < 30 || data.weight > 300) newErrors.weight = 'Please enter a valid weight (30-300 kg)'
    if (!data.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      navigate('/onboarding/activity-level')
    }
  }

  return (
    <OnboardingLayout
      step={1}
      totalSteps={7}
      title="Personal Information"
      subtitle="Let's start with your basic information"
      onNext={handleNext}
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Age
            </label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : '')}
              placeholder="25"
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.age ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Sex
            </label>
            <select
              value={data.sex}
              onChange={(e) => handleChange('sex', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.sex ? 'border-red-500' : 'border-slate-600'
              }`}
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.sex && <p className="text-red-400 text-sm mt-1">{errors.sex}</p>}
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={data.height}
              onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : '')}
              placeholder="180"
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.height ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={data.weight}
              onChange={(e) => handleChange('weight', e.target.value ? parseInt(e.target.value) : '')}
              placeholder="75"
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.weight ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.dateOfBirth ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default PersonalInfo

