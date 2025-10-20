import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

  if (!publicKey) {
    console.error('Stripe public key is not configured')
    return Promise.resolve(null)
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publicKey)
  }

  return stripePromise
}

export interface CheckoutSessionParams {
  priceId: string
  userId: string
  email: string
  successUrl: string
  cancelUrl: string
}

export const createCheckoutSession = async (params: CheckoutSessionParams) => {
  const { priceId, userId, email, successUrl, cancelUrl } = params

  try {
    // Call your backend API to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        email,
        successUrl,
        cancelUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()

    // Redirect to Stripe Checkout
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      throw new Error(error.message)
    }
  } catch (err) {
    console.error('Checkout error:', err)
    throw err
  }
}

// Handle redirect from Stripe Checkout
export const handleCheckoutReturn = async (sessionId: string) => {
  try {
    const response = await fetch(`/api/checkout-session/${sessionId}`)

    if (!response.ok) {
      throw new Error('Failed to retrieve checkout session')
    }

    const session = await response.json()
    return session
  } catch (err) {
    console.error('Error retrieving checkout session:', err)
    throw err
  }
}

