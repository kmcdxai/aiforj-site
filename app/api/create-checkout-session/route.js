import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return null;

  return new Stripe(apiKey, {
    timeout: 8000,
    maxNetworkRetries: 0,
  });
}

export async function POST() {
  const stripe = createStripeClient();
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || 'https://aiforj.com').trim();

  if (!stripe) {
    return NextResponse.json(
      { error: 'Premium checkout is temporarily unavailable.' },
      { status: 503 }
    );
  }

  try {
    const lineItems = process.env.STRIPE_PRICE_ID
      ? [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AIForj Premium',
                description: 'Monthly AIForj Premium subscription.',
              },
              recurring: {
                interval: 'month',
              },
              unit_amount: 999,
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/`,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Premium checkout is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
