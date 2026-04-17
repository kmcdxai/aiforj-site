import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeSessionId(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, "");
}

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
  const sessionId = sanitizeSessionId(searchParams.get("session_id"));

  if (!stripe) {
    return NextResponse.json(
      { error: "Gift details are temporarily unavailable." },
      { status: 503 }
    );
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session?.metadata?.checkout_kind !== "sponsor_friend") {
      return NextResponse.json({ error: "Gift session not found" }, { status: 404 });
    }

    return NextResponse.json({
      sessionId,
      paymentStatus: session.payment_status,
      recipientName: session.metadata?.recipient_name || "",
      redeemedAt: session.metadata?.gift_redeemed_at || null,
      redeemUrl: `${domain}/redeem-gift?session_id=${encodeURIComponent(sessionId)}&code=${encodeURIComponent(session.metadata?.gift_code || "")}`,
    });
  } catch (error) {
    console.error("Unable to read sponsor gift session:", error);
    return NextResponse.json({ error: "Gift session unavailable" }, { status: 500 });
  }
}
