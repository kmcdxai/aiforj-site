import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GIFT_LENGTH_MS = 30 * 24 * 60 * 60 * 1000;

function sanitize(value, maxLength = 120) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, maxLength);
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

  if (!stripe) {
    return NextResponse.json(
      { error: "Gift redemption is temporarily unavailable." },
      { status: 503 }
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const sessionId = sanitize(payload?.sessionId);
  const code = sanitize(payload?.code);

  if (!sessionId || !code) {
    return NextResponse.json({ error: "Missing gift credentials" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session?.metadata?.checkout_kind !== "sponsor_friend" ||
      session?.payment_status !== "paid" ||
      session?.metadata?.gift_code !== code
    ) {
      return NextResponse.json({ error: "Gift not available" }, { status: 404 });
    }

    if (session.metadata?.gift_redeemed_at) {
      return NextResponse.json(
        {
          error: "This gift has already been redeemed.",
          redeemedAt: session.metadata.gift_redeemed_at,
        },
        { status: 409 }
      );
    }

    const redeemedAt = new Date();
    const expiresAt = new Date(redeemedAt.getTime() + GIFT_LENGTH_MS);

    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        gift_redeemed_at: redeemedAt.toISOString(),
        gift_redeemed_expires_at: expiresAt.toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
      recipientName: session.metadata?.recipient_name || "",
    });
  } catch (error) {
    console.error("Unable to redeem sponsored gift:", error);
    return NextResponse.json({ error: "Unable to redeem gift right now" }, { status: 500 });
  }
}
