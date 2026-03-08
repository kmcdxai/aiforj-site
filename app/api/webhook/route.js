import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable Next.js body parsing so we can verify the Stripe signature
export const config = {
  api: { bodyParser: false },
};

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ New subscriber:', session.customer_email || session.customer);
      // For a database-backed app, you'd save the customer ID and mark them as premium
      // For now, premium status is managed client-side via localStorage
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.customer);
      // Remove premium access for this customer
      break;

    case 'invoice.payment_failed':
      const invoice = event.data.object;
      console.log('⚠️ Payment failed:', invoice.customer);
      // Notify customer of payment failure
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
