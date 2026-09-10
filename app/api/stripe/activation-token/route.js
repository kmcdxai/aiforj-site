import { NextResponse } from "next/server";
import { createActivationToken } from "../../../../lib/licenseTokens";
import { resolveSubscriptionAccess } from "../../../../lib/subscriptionAccess.mjs";
import { createStripeClient } from "../../../../lib/stripe";

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
    const access = await resolveSubscriptionAccess(stripe, sessionId);
    if (!access) return NextResponse.json({ error: "An active subscription or trial could not be verified." }, { status: 403 });
    const { planType } = access;
    const token = createActivationToken({
      planType,
      stripeSessionId: sessionId,
      expiresAt: null,
    });

    return NextResponse.json({
      token,
      activationUrl: `${domain}/activate/${encodeURIComponent(token)}`,
      planType,
      expiresAt: access.expiresAt,
      stripeSessionId: sessionId,
    });
  } catch (error) {
    console.error("Unable to create activation token:", error);
    return NextResponse.json({ error: "Activation is temporarily unavailable." }, { status: 500 });
  }
}
