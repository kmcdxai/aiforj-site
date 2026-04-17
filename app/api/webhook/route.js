import Stripe from 'stripe';
import { NextResponse } from 'next/server';

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
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook handling is not configured.' },
      { status: 503 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      if (session.metadata?.checkout_kind === 'sponsor_friend') {
        console.log('🎁 New sponsor gift purchased:', session.id);
      } else if (session.metadata?.checkout_kind === 'family_plan') {
        console.log('🏠 New family plan purchased:', session.id);
      } else {
        console.log('✅ New subscriber:', session.customer_email || session.customer);
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.customer);
      break;

    case 'invoice.payment_failed':
      const invoice = event.data.object;
      console.log('⚠️ Payment failed:', invoice.customer);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
