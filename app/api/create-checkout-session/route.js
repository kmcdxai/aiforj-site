import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { normalizeMedium, premiumAttribution } from '../../../lib/links';

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

export async function POST(request) {
  const stripe = createStripeClient();
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || 'https://aiforj.com').trim();

  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const medium = normalizeMedium(payload?.medium || 'site');
  const attribution = premiumAttribution(medium);
  const attributionQuery = new URLSearchParams(attribution).toString();

  if (!stripe) {
    return NextResponse.json(
      { error: 'Premium checkout is temporarily unavailable.' },
      { status: 503 }
    );
  }

  try {
    const premiumPriceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY || process.env.STRIPE_PRICE_ID;
    const lineItems = premiumPriceId
      ? [
          {
            price: premiumPriceId,
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
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}&${attributionQuery}`,
      cancel_url: `${domain}/?${attributionQuery}`,
      allow_promotion_codes: true,
      metadata: {
        ...attribution,
        checkout_kind: "premium",
        plan_type: "premium",
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          ...attribution,
          checkout_kind: "premium",
          plan_type: "premium",
        },
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
