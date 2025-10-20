import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              Welcome, <span className="text-blue-500">{user?.email?.split('@')[0]}</span>
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <p className="text-gray-400 text-sm mb-2">Profile Status</p>
              <p className="text-2xl font-bold text-green-400">✓ Complete</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <p className="text-gray-400 text-sm mb-2">Nutrition Plan</p>
              <p className="text-2xl font-bold text-blue-400">Ready</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <p className="text-gray-400 text-sm mb-2">Workout Plan</p>
              <p className="text-2xl font-bold text-orange-400">Coming Soon</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <p className="text-gray-400 text-sm mb-2">Subscription</p>
              <p className="text-2xl font-bold text-purple-400">Free Trial</p>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Nutrition Plan Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/nutrition-plan')}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Nutrition Plan</h2>
                <p className="text-blue-100">Personalized meal plan & macros</p>
              </div>
              <span className="text-5xl">🍽️</span>
            </div>
            <div className="bg-blue-500 bg-opacity-30 rounded-lg p-4 mb-4">
              <p className="text-blue-100 text-sm">Your nutrition plan has been calculated based on your profile. Click to view detailed macronutrient breakdown and daily targets.</p>
            </div>
            <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors">
              View Plan
            </button>
          </div>

          {/* Workout Plan Card */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/workout-plan')}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Workout Plan</h2>
                <p className="text-orange-100">Adaptive training program</p>
              </div>
              <span className="text-5xl">🏋️</span>
            </div>
            <div className="bg-orange-500 bg-opacity-30 rounded-lg p-4 mb-4">
              <p className="text-orange-100 text-sm">Your personalized workout plan has been generated. Click to view your weekly schedule and exercise details.</p>
            </div>
            <button className="w-full bg-white text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-50 transition-colors">
              View Plan
            </button>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Progress Tracking */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm mb-4">Monitor your weight, measurements, and progress photos.</p>
            <button disabled className="w-full bg-slate-700 text-gray-300 font-semibold py-2 rounded-lg opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Food Diary */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">Food Diary</h3>
            <p className="text-gray-400 text-sm mb-4">Log your meals and track daily nutrition intake.</p>
            <button disabled className="w-full bg-slate-700 text-gray-300 font-semibold py-2 rounded-lg opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Settings */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
            <p className="text-gray-400 text-sm mb-4">Manage your profile, preferences, and account settings.</p>
            <button disabled className="w-full bg-slate-700 text-gray-300 font-semibold py-2 rounded-lg opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

