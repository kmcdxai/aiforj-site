import { NextResponse } from "next/server";
import { createActivationToken } from "../../../../lib/licenseTokens";
import { createStripeClient, sanitizePlanType } from "../../../../lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeSessionId(value) {
  return String(value || "").trim().replace(/[^a-zA-Z0-9_]/g, "");
}

export async function GET(request) {
  const stripe = createStripeClient();
  const domain = (process.env.NEXT_PUBLIC_DOMAIN || "https://aiforj.com").trim();
  const { searchParams } = new URL(request.url);
  const sessionId = sanitizeSessionId(searchParams.get("session_id"));

  if (!stripe) {
    return NextResponse.json({ error: "Activation is temporarily unavailable." }, { status: 503 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete") {
      return NextResponse.json({ error: "Checkout is not complete yet." }, { status: 409 });
    }

    const planType = sanitizePlanType(session.metadata?.plan_type || "premium");
    const token = createActivationToken({
      planType,
      stripeSessionId: sessionId,
      expiresAt: null,
    });

    return NextResponse.json({
      token,
      activationUrl: `${domain}/activate/${encodeURIComponent(token)}`,
      planType,
    });
  } catch (error) {
    console.error("Unable to create activation token:", error);
    return NextResponse.json({ error: "Activation is temporarily unavailable." }, { status: 500 });
  }
}
