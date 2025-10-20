import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  SUBSCRIPTION_PLANS,
  TRIAL_DAYS,
  getPlanById,
  hasActiveSubscription,
  isInTrialPeriod,
  getRemainingTrialDays,
  getSubscriptionStatusMessage,
  formatPrice,
  UserSubscription,
} from '../lib/subscriptionPlans'

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // In a real app, this would fetch from Supabase
        // For now, we'll simulate a trial subscription
        const mockSubscription: UserSubscription = {
          id: 'sub_' + user.id,
          userId: user.id,
          planId: 'premium',
          status: 'trial',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setSubscription(mockSubscription)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching subscription:', err)
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setCancelling(true)

    try {
      // In a real app, this would call your backend to cancel the Stripe subscription
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setSubscription({
        ...subscription,
        status: 'cancelled',
        cancelAtPeriodEnd: true,
      })

      setShowCancelModal(false)
      alert('Subscription cancelled. Your access will continue until the end of the billing period.')
    } catch (err) {
      console.error('Error cancelling subscription:', err)
      alert('Failed to cancel subscription. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const handleUpgradePlan = (planId: string) => {
    // In a real app, this would redirect to Stripe checkout
    alert(`Upgrading to ${planId} plan...`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white">Loading subscription...</p>
        </div>
      </div>
    )
  }

  const currentPlan = subscription ? getPlanById(subscription.planId) : null
  const isActive = hasActiveSubscription(subscription)
  const isTrial = isInTrialPeriod(subscription)
  const remainingTrialDays = getRemainingTrialDays(subscription)
  const statusMessage = getSubscriptionStatusMessage(subscription)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
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
        {/* Current Subscription */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Current Subscription</h2>

          {subscription ? (
            <div className="space-y-6">
              {/* Status Badge */}
              <div>
                <div className={`inline-block px-4 py-2 rounded-full font-semibold ${
                  isTrial
                    ? 'bg-green-600 bg-opacity-20 text-green-400'
                    : isActive
                    ? 'bg-blue-600 bg-opacity-20 text-blue-400'
                    : 'bg-red-600 bg-opacity-20 text-red-400'
                }`}>
                  {statusMessage}
                </div>
              </div>

              {/* Plan Details */}
              {currentPlan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Plan Name</p>
                    <p className="text-2xl font-bold text-white">{currentPlan.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Price</p>
                    <p className="text-2xl font-bold text-white">{formatPrice(currentPlan.price)}/month</p>
                  </div>

                  {isTrial && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Trial Ends In</p>
                      <p className="text-2xl font-bold text-green-400">{remainingTrialDays} days</p>
                    </div>
                  )}

                  {isActive && !isTrial && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Next Billing Date</p>
                      <p className="text-2xl font-bold text-white">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              {currentPlan && (
                <div>
                  <p className="text-gray-400 text-sm mb-4 font-semibold">Included Features</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-700">
                {isTrial && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Upgrade Now
                  </button>
                )}

                {isActive && !subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}

                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 text-red-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 2.526a6 6 0 008.367 8.364z" clipRule="evenodd" />
                    </svg>
                    <span>Subscription will be cancelled on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-6">No active subscription</p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                View Pricing Plans
              </button>
            </div>
          )}
        </div>

        {/* Other Plans */}
        {subscription && (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Other Plans</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUBSCRIPTION_PLANS.filter((plan) => plan.id !== subscription.planId).map((plan) => (
                <div key={plan.id} className="border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-white">{formatPrice(plan.price)}/month</p>
                  </div>

                  <button
                    onClick={() => handleUpgradePlan(plan.id)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Switch to {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionManagement

