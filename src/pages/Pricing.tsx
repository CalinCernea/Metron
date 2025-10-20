import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SUBSCRIPTION_PLANS, TRIAL_DAYS, formatPrice } from '../lib/subscriptionPlans'

const Pricing: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/login')
      return
    }

    setSelectedPlan(planId)
    setLoading(true)

    // In a real app, this would create a Stripe checkout session
    // For now, we'll simulate the trial period
    try {
      // Simulate API call to create subscription
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, you would:
      // 1. Call your backend to create a Stripe checkout session
      // 2. Redirect to Stripe Checkout
      // 3. After payment, create the subscription in Supabase

      // For demo purposes, we'll just show a message
      alert(`Redirecting to payment for ${planId} plan...`)
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Pricing Plans</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 mb-8">
            Start with a free 7-day trial. No credit card required.
          </p>

          {/* Trial Badge */}
          <div className="inline-block bg-green-600 bg-opacity-20 border border-green-500 rounded-full px-6 py-2 mb-8">
            <p className="text-green-400 font-semibold">✓ Free {TRIAL_DAYS}-Day Trial</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? 'ring-2 ring-blue-500 md:scale-105'
                  : 'border border-slate-700'
              } ${
                plan.color === 'blue'
                  ? 'bg-gradient-to-br from-slate-800 to-slate-700'
                  : 'bg-gradient-to-br from-slate-800 to-slate-700'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{formatPrice(plan.price)}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Billed monthly. Cancel anytime.
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-8 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Free Trial
                    </>
                  )}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Features</p>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: 'Do I need a credit card for the free trial?',
                answer: 'No, you can start your 7-day free trial without providing a credit card. You\'ll only be charged when the trial period ends.',
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
              },
              {
                question: 'What\'s the difference between Premium and Pro?',
                answer: 'Premium includes personalized nutrition and workout plans, while Pro adds AI-powered meal planning, advanced analytics, and 24/7 priority support.',
              },
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing date.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 7-day free trial so you can test the service. If you\'re not satisfied, you can cancel before being charged.',
              },
            ].map((item, index) => (
              <div key={index} className="border-b border-slate-700 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-white mb-2">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">100% Satisfaction Guarantee</h3>
          <p className="text-blue-100 mb-6">
            Try Metron free for 7 days. If you\'re not satisfied, cancel anytime with no questions asked.
          </p>
          <div className="flex justify-center gap-4">
            <svg className="h-6 w-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-100">No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

