import Stripe from "stripe";
import { NextResponse } from "next/server";
import {
  createFamilySeatCodes,
  FAMILY_PLAN_PRICE_CENTS,
  FAMILY_SEAT_COUNT,
  sanitizeHouseholdName,
  serializeFamilyCodes,
} from "../../../lib/familyPlan";

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
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || "https://aiforj.com").trim();

  if (!stripe) {
    return NextResponse.json(
      { error: "Family plans are temporarily unavailable." },
      { status: 503 }
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const householdName = sanitizeHouseholdName(payload?.householdName);
  const seatCodes = createFamilySeatCodes();
  const serializedSeatCodes = serializeFamilyCodes(seatCodes);

  try {
    const familyPriceId = process.env.STRIPE_PRICE_FAMILY_MONTHLY || process.env.STRIPE_FAMILY_PRICE_ID;
    const lineItems = familyPriceId
      ? [
          {
            price: familyPriceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "AIForj Premium Family Plan",
                description:
                  "Monthly household plan with 4 private Premium invite links.",
              },
              recurring: {
                interval: "month",
              },
              unit_amount: FAMILY_PLAN_PRICE_CENTS,
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "subscription",
      success_url: `${domain}/success?kind=family&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/family`,
      allow_promotion_codes: true,
      metadata: {
        checkout_kind: "family_plan",
        plan_type: "family",
        acquisition_source: "internal",
        household_name: householdName,
        family_seat_count: String(FAMILY_SEAT_COUNT),
        family_seat_codes: serializedSeatCodes,
        family_redeemed_codes: "",
      },
      subscription_data: {
        metadata: {
          checkout_kind: "family_plan",
          plan_type: "family",
          acquisition_source: "internal",
          household_name: householdName,
          family_seat_count: String(FAMILY_SEAT_COUNT),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe family plan checkout error:", error);
    return NextResponse.json(
      { error: "Family plans are temporarily unavailable." },
      { status: 503 }
    );
  }
}
