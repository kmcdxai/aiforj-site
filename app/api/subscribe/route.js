import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email_address } = await request.json();
    const apiKey = process.env.BUTTONDOWN_API_KEY;

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
      body: JSON.stringify({ email_address }),
    });

    if (res.ok || res.status === 201) {
      return NextResponse.json({ success: true });
    }

    const data = await res.json().catch(() => ({}));

    // Buttondown returns 400 if already subscribed — treat as success
    if (res.status === 400 && JSON.stringify(data).includes("already")) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
