import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

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
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || "https://aiforj.com").trim();

  if (!stripe) {
    return NextResponse.json(
      { error: "Premium gifting is temporarily unavailable." },
      { status: 503 }
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const recipientName = sanitizeName(payload?.recipientName);
  const giftCode = crypto.randomUUID();

  try {
    const giftPriceId = process.env.STRIPE_PRICE_GIFT_MONTH || process.env.STRIPE_SPONSOR_PRICE_ID;
    const lineItems = giftPriceId
      ? [
          {
            price: giftPriceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "AIForj Premium Gift",
                description: "One month of AIForj Premium for someone you care about.",
              },
              unit_amount: 999,
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${domain}/success?kind=sponsor&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/sponsor`,
      allow_promotion_codes: true,
      metadata: {
        checkout_kind: "sponsor_friend",
        plan_type: "gift",
        acquisition_source: "internal",
        gift_code: giftCode,
        recipient_name: recipientName,
        gift_length_days: "30",
        gift_redeemed_at: "",
        gift_redeemed_expires_at: "",
      },
      payment_intent_data: {
        metadata: {
          checkout_kind: "sponsor_friend",
          plan_type: "gift",
          acquisition_source: "internal",
          gift_code: giftCode,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe sponsor checkout error:", err);
    return NextResponse.json(
      { error: "Premium gifting is temporarily unavailable." },
      { status: 503 }
    );
  }
}
