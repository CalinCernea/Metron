import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../context/OnboardingContext'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useOnboarding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              Welcome, <span className="text-blue-500">{data.name}</span>
            </h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Weight</p>
                <p className="text-3xl font-bold text-white mt-2">{data.weight} kg</p>
              </div>
              <span className="text-4xl">⚖️</span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Goal</p>
                <p className="text-2xl font-bold text-white mt-2 capitalize">{data.weeklyProgressGoal?.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-400 mt-1">{data.progressAmount} kg/week</p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Activity Level</p>
                <p className="text-2xl font-bold text-white mt-2 capitalize">{data.activityLevel?.replace(/_/g, ' ')}</p>
              </div>
              <span className="text-4xl">⚡</span>
            </div>
          </div>
        </div>

        {/* Coming Soon Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Nutrition Plan</h2>
            <p className="text-gray-400 mb-4">Your personalized meal plan and macro tracking</p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50" disabled>
              Coming Soon
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">🏋️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Workout Plan</h2>
            <p className="text-gray-400 mb-4">Your adaptive training program</p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50" disabled>
              Coming Soon
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-2">Progress Tracking</h2>
            <p className="text-gray-400 mb-4">Monitor your fitness journey</p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50" disabled>
              Coming Soon
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
            <p className="text-gray-400 mb-4">Manage your profile and preferences</p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

