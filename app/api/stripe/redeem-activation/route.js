import { NextResponse } from "next/server";
import { verifyActivationToken } from "../../../../lib/licenseTokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const token = String(payload?.token || "");
  const activation = verifyActivationToken(token);
  if (!activation) {
    return NextResponse.json({ error: "Activation link is invalid or expired." }, { status: 400 });
  }

  return NextResponse.json({
    active: true,
    planType: activation.planType || "premium",
    stripeSessionId: activation.stripeSessionId || null,
    expiresAt: activation.expiresAt || null,
  });
}
