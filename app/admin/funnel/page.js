import crypto from "crypto";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const COOKIE_NAME = "aiforj_admin_funnel";

const funnelStages = [
  ["Pageview", "automatic"],
  ["Emotion selected", "start_emotion_selected"],
  ["Intervention began", "start_intervention_began"],
  ["Intervention completed", "start_intervention_completed"],
  ["Receipt generated", "mood_shift_receipt_generated"],
  ["Receipt shared", "mood_shift_receipt_shared"],
];

const monetizationEvents = [
  "cbt_workbook_click",
  "premium_click",
  "sponsor_click",
  "email_signup_submitted",
];

const safetyEvents = ["sos_button_opened"];

function sessionToken() {
  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || password;
  return crypto.createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

function isUnlocked() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return cookies().get(COOKIE_NAME)?.value === sessionToken();
}

async function unlockFunnel(formData) {
  "use server";

  const password = String(formData.get("password") || "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/funnel?error=1");
  }

  cookies().set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin/funnel",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin/funnel");
}

function Shell({ children }) {
  return (
    <main style={{ minHeight: "100vh", padding: "120px 24px 72px", background: "var(--parchment)", color: "var(--text-primary)" }}>
      <section style={{ maxWidth: 960, margin: "0 auto", display: "grid", gap: 24 }}>
        {children}
      </section>
    </main>
  );
}

function Card({ children }) {
  return (
    <section style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 28, padding: "clamp(22px, 4vw, 36px)", boxShadow: "var(--shadow-md)" }}>
      {children}
    </section>
  );
}

function EventList({ title, events }) {
  return (
    <Card>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {events.map((event, index) => {
          const label = Array.isArray(event) ? event[0] : event;
          const name = Array.isArray(event) ? event[1] : event;
          return (
            <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 1fr) minmax(180px, 1.2fr)", gap: 14, alignItems: "center", padding: "12px 0", borderTop: index === 0 ? "none" : "1px solid var(--border)" }}>
              <strong>{label}</strong>
              <code style={{ overflowWrap: "anywhere", color: "var(--sage-deep)" }}>{name}</code>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Gate({ error }) {
  return (
    <Shell>
      <Card>
        <p className="text-label" style={{ margin: "0 0 12px", color: "var(--sage-deep)" }}>Internal reference</p>
        <h1 style={{ margin: "0 0 12px" }}>AIForj funnel reference</h1>
        {!process.env.ADMIN_PASSWORD ? (
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Set <code>ADMIN_PASSWORD</code> in Vercel to unlock this internal GA4 reference page.
          </p>
        ) : (
          <form action={unlockFunnel} style={{ display: "grid", gap: 14, maxWidth: 420 }}>
            <label htmlFor="password" style={{ color: "var(--text-secondary)" }}>Admin password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={{ minHeight: 52, borderRadius: 16, border: "1px solid var(--border)", padding: "0 16px", fontSize: 16 }}
            />
            <button type="submit" className="btn-primary">Open funnel reference</button>
            {error ? <p style={{ margin: 0, color: "var(--crisis)" }}>That password did not match ADMIN_PASSWORD.</p> : null}
          </form>
        )}
      </Card>
    </Shell>
  );
}

export default function FunnelReferencePage({ searchParams }) {
  if (!isUnlocked()) {
    return <Gate error={searchParams?.error === "1"} />;
  }

  return (
    <Shell>
      <Card>
        <p className="text-label" style={{ margin: "0 0 12px", color: "var(--sage-deep)" }}>GA4 setup reference</p>
        <h1 style={{ margin: "0 0 14px" }}>AIForj funnel reference</h1>
        <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          In GA4, use Explore → Funnel exploration and add these events as steps to see drop-off. Monetization events are the ones to watch most closely until MRR &gt; 0.
        </p>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          GA4 dashboard: <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">open Google Analytics</a>. Kevin can paste the exact project property URL here later if he wants a one-click shortcut.
        </p>
      </Card>

      <EventList title="Funnel stages" events={funnelStages} />
      <EventList title="Monetization events" events={monetizationEvents} />
      <EventList title="Safety events" events={safetyEvents} />

      <Card>
        <h2 style={{ marginTop: 0 }}>Conversion reminder</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          In GA4 Admin → Events, mark <code>cbt_workbook_click</code>, <code>premium_click</code>, and <code>email_signup_submitted</code> as conversions so they appear in conversion reports.
        </p>
        <p style={{ margin: "18px 0 0" }}>
          <Link href="/" style={{ color: "var(--sage-deep)", fontWeight: 700 }}>Return to AIForj →</Link>
        </p>
      </Card>
    </Shell>
  );
}
