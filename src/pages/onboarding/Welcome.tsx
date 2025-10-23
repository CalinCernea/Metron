import React from 'react'
import { useNavigate } from 'react-router-dom'

const Welcome: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="max-w-4xl w-full text-center space-y-10">
        {/* Hero Section */}
        <div className="animate-fade-in-down">
          <h1 className="text-6xl font-extrabold mb-4 leading-tight">
            Your Journey to a Healthier You Starts with <span className="text-blue-500">Metron</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock personalized fitness and nutrition plans powered by AI. Achieve your goals faster, smarter, and with lasting results.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 animate-fade-in-up">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Personalized Plans</h3>
            <p className="text-gray-300">
              Get custom workout routines and meal plans tailored to your unique body and goals.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 delay-100">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Smart Progress Tracking</h3>
            <p className="text-gray-300">
              Monitor your achievements with intuitive trackers and see your hard work pay off.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 delay-200">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">AI-Powered Adaptation</h3>
            <p className="text-gray-300">
              Your plans evolve with you, adjusting based on your performance and feedback for optimal results.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 animate-fade-in-up delay-300">
          <p className="text-gray-300 text-xl mb-6">
            Ready to transform your body and mind? Start your free 7-day trial today!
          </p>
          <button
            onClick={() => navigate('/onboarding/personal-info')}
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Start Your Free Trial
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome

