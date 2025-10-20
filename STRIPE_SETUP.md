# Stripe Integration Setup Guide

This guide explains how to complete the Stripe integration for Metron.

## Prerequisites

- Stripe account with live keys
- Supabase project with Edge Functions enabled
- Environment variables configured

## Environment Variables

The following environment variables need to be configured in `.env`:

```
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

Get these from your Stripe Dashboard → Developers → API Keys

## Supabase Edge Functions Setup

### 1. Deploy Edge Functions

The following Edge Functions need to be deployed to Supabase:

- `supabase/functions/create-checkout-session/index.ts` - Creates Stripe checkout sessions
- `supabase/functions/stripe-webhook/index.ts` - Handles Stripe webhooks

To deploy:

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### 2. Configure Stripe Webhook Secret

In Supabase, set the `STRIPE_WEBHOOK_SECRET` environment variable in your Edge Functions:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Create a new endpoint pointing to your Supabase Edge Function URL
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
4. Copy the signing secret
5. In Supabase, go to Settings → Edge Functions → Environment Variables
6. Add `STRIPE_WEBHOOK_SECRET` with the value from Stripe

### 3. Database Setup

The `subscriptions` table has been created in Supabase with the following structure:

```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end_date TIMESTAMP,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Subscription Plans

Two subscription plans are configured:

### Premium - $9.99/month
- Price ID: `price_1SKIyJHNlNFnkDkWVoo83FNs`
- Features:
  - Personalized nutrition plans
  - Adaptive workout programs
  - Food diary with 100+ foods
  - Progress tracking
  - Weekly progress reports
  - Email support
  - Mobile app access

### Pro - $19.99/month
- Price ID: `price_1SKIzhHNlNFnkDkWAnR5BQhD`
- Features:
  - Everything in Premium
  - AI-powered meal planning
  - Advanced analytics & insights
  - Custom workout modifications
  - Unlimited progress photos
  - Priority support (24/7)
  - Integration with fitness trackers
  - Nutrition coaching tips
  - Advanced body metrics tracking

## Trial Period

All new users get a 7-day free trial before being charged. The trial is configured in the Edge Function:

```typescript
subscription_data: {
  trial_period_days: 7,
  metadata: {
    userId: userId,
  },
}
```

## Checkout Flow

1. User clicks "Start Free Trial" on pricing page
2. Frontend calls `createCheckoutSession()` with plan details
3. Edge Function creates Stripe checkout session with 7-day trial
4. User is redirected to Stripe Checkout
5. After payment (or trial start), Stripe sends webhook event
6. Webhook handler creates/updates subscription in Supabase
7. User is redirected back to app

## Webhook Events Handled

- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

## Testing

To test the integration locally:

1. Use Stripe test keys instead of live keys
2. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
3. Use any future expiration date and any CVC

## Troubleshooting

### Webhook not receiving events
- Verify webhook endpoint URL is correct
- Check `STRIPE_WEBHOOK_SECRET` is set correctly
- Ensure Edge Function is deployed and accessible

### Checkout session not creating
- Verify `STRIPE_SECRET_KEY` is set in Edge Functions
- Check browser console for errors
- Verify price IDs are correct

### Subscription not saving
- Check Supabase logs for Edge Function errors
- Verify `subscriptions` table exists and RLS policies are correct
- Check webhook payload format

## Next Steps

1. Deploy Edge Functions to Supabase
2. Configure Stripe webhook endpoint
3. Set environment variables in Supabase
4. Test checkout flow with test cards
5. Deploy to production with live keys

