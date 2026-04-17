import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeText(value, maxLength = 120) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

export async function POST(request) {
  let payload = {};
  try {
    payload = await request.json();
  } catch {}

  const emailAddress = sanitizeText(payload?.email_address, 160);
  const organizationName = sanitizeText(payload?.organization_name, 120);
  const role = sanitizeText(payload?.role, 80);
  const teamSize = sanitizeText(payload?.team_size, 40);

  if (!isValidEmail(emailAddress)) {
    return NextResponse.json(
      { error: "Invalid work email address" },
      { status: 400 }
    );
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Organization requests are temporarily unavailable." },
      { status: 503 }
    );
  }

  const notes = [
    organizationName ? `organization=${organizationName}` : null,
    role ? `role=${role}` : null,
    teamSize ? `team_size=${teamSize}` : null,
    "surface=organizations",
  ]
    .filter(Boolean)
    .join(" | ");

  try {
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: emailAddress,
        tags: ["organization-interest"],
        metadata: {
          organization_name: organizationName,
          role,
          team_size: teamSize,
          surface: "organizations",
        },
        notes,
        referrer_url: "https://aiforj.com/organizations",
      }),
    });

    if (response.ok || response.status === 201) {
      return NextResponse.json({ success: true });
    }

    const data = await response.json().catch(() => ({}));

    if (response.status === 400 && JSON.stringify(data).includes("already")) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
