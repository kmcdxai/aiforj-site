import { NextResponse } from "next/server";

const SITE_URL = "https://aiforj.com";

function normalizeTag(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

function publicUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function sendConfiguredLeadMagnetEmail({ apiKey, email, source }) {
  if (source !== "panic_lead_magnet") return;
  const emailId = process.env.BUTTONDOWN_PANIC_LEAD_MAGNET_EMAIL_ID;
  if (!emailId) return;

  await fetch(`https://api.buttondown.email/v1/subscribers/${encodeURIComponent(email)}/emails/${emailId}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  });
}

export async function POST(request) {
  try {
    const {
      email_address,
      source = "newsletter",
      lead_magnet,
      pdf_path,
    } = await request.json();
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    const sourceTag = normalizeTag(source);
    const pdfUrl = publicUrl(pdf_path);

    if (!email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_address)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Email signups are temporarily unavailable." },
        { status: 503 }
      );
    }

    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address,
        tags: sourceTag ? [sourceTag] : undefined,
        metadata: {
          source,
          lead_magnet: lead_magnet || null,
          lead_magnet_pdf: pdfUrl || null,
        },
        notes: pdfUrl
          ? `AIForj signup source: ${source}. Lead magnet PDF: ${pdfUrl}`
          : `AIForj signup source: ${source}.`,
        referrer_url: SITE_URL,
        utm_source: "aiforj",
        utm_medium: source,
        utm_campaign: lead_magnet ? "lead_magnet" : "newsletter",
      }),
    });

    if (res.ok || res.status === 201) {
      await sendConfiguredLeadMagnetEmail({ apiKey, email: email_address, source }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    const data = await res.json().catch(() => ({}));

    // Buttondown returns 400 if already subscribed — treat as success
    if (res.status === 400 && JSON.stringify(data).includes("already")) {
      await sendConfiguredLeadMagnetEmail({ apiKey, email: email_address, source }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
