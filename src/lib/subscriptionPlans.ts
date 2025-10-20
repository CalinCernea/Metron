export interface SubscriptionPlan {
  id: string
  name: string
  price: number // monthly price in USD
  stripePriceId: string
  description: string
  features: string[]
  color: string
  popular: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEndDate?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    stripePriceId: 'price_1SKIyJHNlNFnkDkWVoo83FNs',
    description: 'Perfect for serious fitness enthusiasts',
    features: [
      'Personalized nutrition plans',
      'Adaptive workout programs',
      'Food diary with 100+ foods',
      'Progress tracking',
      'Weekly progress reports',
      'Email support',
      'Mobile app access',
    ],
    color: 'blue',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    stripePriceId: 'price_1SKIzhHNlNFnkDkWAnR5BQhD',
    description: 'For athletes and fitness professionals',
    features: [
      'Everything in Premium',
      'AI-powered meal planning',
      'Advanced analytics & insights',
      'Custom workout modifications',
      'Unlimited progress photos',
      'Priority support (24/7)',
      'Integration with fitness trackers',
      'Nutrition coaching tips',
      'Advanced body metrics tracking',
    ],
    color: 'purple',
    popular: false,
  },
]

export const TRIAL_DAYS = 7

// Get plan by ID
export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}

// Check if user has active subscription
export const hasActiveSubscription = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false
  if (subscription.status === 'trial') {
    const trialEnd = new Date(subscription.trialEndDate || '')
    return trialEnd > new Date()
  }
  return subscription.status === 'active'
}

// Check if user is in trial period
export const isInTrialPeriod = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false
  return subscription.status === 'trial'
}

// Get remaining trial days
export const getRemainingTrialDays = (subscription: UserSubscription | null): number => {
  if (!subscription || !subscription.trialEndDate) return 0
  const trialEnd = new Date(subscription.trialEndDate)
  const now = new Date()
  const diffTime = trialEnd.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// Get subscription status message
export const getSubscriptionStatusMessage = (subscription: UserSubscription | null): string => {
  if (!subscription) {
    return 'No active subscription'
  }

  if (subscription.status === 'trial') {
    const remainingDays = getRemainingTrialDays(subscription)
    return `Free trial - ${remainingDays} days remaining`
  }

  if (subscription.status === 'active') {
    const plan = getPlanById(subscription.planId)
    return `${plan?.name || 'Active'} subscription`
  }

  if (subscription.status === 'cancelled') {
    return 'Subscription cancelled'
  }

  return 'Subscription expired'
}

// Format price
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

