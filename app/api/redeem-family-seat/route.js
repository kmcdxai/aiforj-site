import Stripe from "stripe";
import { NextResponse } from "next/server";
import {
  parseFamilyCodes,
  sanitizeFamilySeatCode,
  sanitizeFamilySessionId,
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

  if (!stripe) {
    return NextResponse.json(
      { error: "Family seat redemption is temporarily unavailable." },
      { status: 503 }
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const sessionId = sanitizeFamilySessionId(payload?.sessionId);
  const code = sanitizeFamilySeatCode(payload?.code);

  if (!sessionId || !code) {
    return NextResponse.json(
      { error: "Missing family plan credentials" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session?.metadata?.checkout_kind !== "family_plan" ||
      !["paid", "no_payment_required"].includes(session?.payment_status || "")
    ) {
      return NextResponse.json(
        { error: "Family plan not available" },
        { status: 404 }
      );
    }

    const seatCodes = parseFamilyCodes(session.metadata?.family_seat_codes);
    const redeemedCodes = parseFamilyCodes(session.metadata?.family_redeemed_codes);

    if (!seatCodes.includes(code)) {
      return NextResponse.json(
        { error: "Family seat not found" },
        { status: 404 }
      );
    }

    if (redeemedCodes.includes(code)) {
      return NextResponse.json(
        { error: "This family plan seat has already been claimed." },
        { status: 409 }
      );
    }

    const nextRedeemedCodes = [...redeemedCodes, code];

    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        family_redeemed_codes: serializeFamilyCodes(nextRedeemedCodes),
      },
    });

    return NextResponse.json({
      success: true,
      householdName: session.metadata?.household_name || "",
      seatNumber: seatCodes.indexOf(code) + 1,
    });
  } catch (error) {
    console.error("Unable to redeem family seat:", error);
    return NextResponse.json(
      { error: "Unable to redeem this family seat right now" },
      { status: 500 }
    );
  }
}
