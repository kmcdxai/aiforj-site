import Stripe from "stripe";
import { NextResponse } from "next/server";
import {
  buildFamilySeatLinks,
  FAMILY_SEAT_COUNT,
  parseFamilyCodes,
  sanitizeFamilySessionId,
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

export async function GET(request) {
  const stripe = createStripeClient();
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || "https://aiforj.com").trim();
  const { searchParams } = new URL(request.url);
  const sessionId = sanitizeFamilySessionId(searchParams.get("session_id"));

  if (!stripe) {
    return NextResponse.json(
      { error: "Family plan details are temporarily unavailable." },
      { status: 503 }
    );
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session?.metadata?.checkout_kind !== "family_plan") {
      return NextResponse.json({ error: "Family plan not found" }, { status: 404 });
    }

    const seatCodes = parseFamilyCodes(session.metadata?.family_seat_codes);
    const redeemedCodes = parseFamilyCodes(session.metadata?.family_redeemed_codes);

    return NextResponse.json({
      sessionId,
      paymentStatus: session.payment_status,
      householdName: session.metadata?.household_name || "",
      seatCount: seatCodes.length || FAMILY_SEAT_COUNT,
      seats: buildFamilySeatLinks({
        domain,
        sessionId,
        seatCodes,
        redeemedCodes,
      }),
    });
  } catch (error) {
    console.error("Unable to read family plan session:", error);
    return NextResponse.json(
      { error: "Family plan details unavailable" },
      { status: 500 }
    );
  }
}
