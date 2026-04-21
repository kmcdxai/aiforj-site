import Link from "next/link";

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 5;
  return Math.max(1, Math.min(10, Math.round(number)));
}

function titleCase(value = "emotion") {
  return String(value || "emotion")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildReceiptParams(searchParams = {}) {
  const emotion = titleCase(searchParams.e || "anxious");
  const from = clampScore(searchParams.from);
  const to = clampScore(searchParams.to);
  const modality = titleCase(searchParams.mod || "ACT defusion");
  const duration = Math.max(1, Math.min(60, Number(searchParams.d || 3) || 3));
  return { emotion, from, to, modality, duration };
}

function buildOgUrl(params) {
  const query = new URLSearchParams({
    e: params.emotion.toLowerCase().replace(/\s+/g, "-"),
    from: String(params.from),
    to: String(params.to),
    mod: params.modality.toLowerCase().replace(/\s+/g, "-"),
    d: String(params.duration),
  });
  return `/api/og/receipt?${query.toString()}`;
}

export function generateMetadata({ searchParams }) {
  const receipt = buildReceiptParams(searchParams);
  const imageUrl = buildOgUrl(receipt);
  return {
    title: `${receipt.emotion} mood shift receipt | AIForj`,
    description: `A private AIForj mood shift receipt: ${receipt.from}/10 to ${receipt.to}/10 using ${receipt.modality}.`,
    alternates: {
      canonical: "https://aiforj.com/receipt",
    },
    openGraph: {
      title: `${receipt.emotion} mood shift receipt | AIForj`,
      description: "See a shareable, anonymous emotional first-aid receipt from AIForj.",
      url: "https://aiforj.com/receipt",
      siteName: "AIForj",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "AIForj mood shift receipt" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${receipt.emotion} mood shift receipt | AIForj`,
      description: "A private, anonymous mood shift receipt from AIForj.",
      images: [imageUrl],
    },
  };
}

export default function ReceiptPage({ searchParams }) {
  const receipt = buildReceiptParams(searchParams);
  const imageUrl = buildOgUrl(receipt);
  const delta = receipt.to - receipt.from;
  const beforeWidth = `${receipt.from * 10}%`;
  const afterWidth = `${receipt.to * 10}%`;

  return (
    <main style={{ minHeight: "100vh", padding: "96px 24px 72px", background: "linear-gradient(180deg, var(--parchment), var(--surface))", color: "var(--text-primary)" }}>
      <section style={{ maxWidth: 920, margin: "0 auto", display: "grid", gap: 28 }}>
        <div style={{ textAlign: "center" }}>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 12px" }}>Mood Shift Receipt</p>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(36px, 6vw, 62px)" }}>{receipt.emotion} → {receipt.to < receipt.from ? "Calmer" : receipt.to > receipt.from ? "Steadier" : "Noticed"}</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 18, lineHeight: 1.7 }}>
            An anonymous receipt from one AIForj emotional first-aid session.
          </p>
        </div>

        <article style={{ borderRadius: 32, padding: "clamp(24px, 5vw, 44px)", background: "rgba(255,255,255,0.78)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", display: "grid", gap: 28 }}>
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "92px 1fr 70px", gap: 16, alignItems: "center" }}>
              <strong>Before</strong>
              <div style={{ height: 18, borderRadius: 999, background: "rgba(45,42,38,0.08)", overflow: "hidden" }}>
                <div style={{ width: beforeWidth, height: "100%", background: "var(--amber-deep)", borderRadius: 999 }} />
              </div>
              <strong style={{ textAlign: "right" }}>{receipt.from}/10</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "92px 1fr 70px", gap: 16, alignItems: "center" }}>
              <strong>After</strong>
              <div style={{ height: 18, borderRadius: 999, background: "rgba(45,42,38,0.08)", overflow: "hidden" }}>
                <div style={{ width: afterWidth, height: "100%", background: "var(--sage-deep)", borderRadius: 999 }} />
              </div>
              <strong style={{ textAlign: "right" }}>{receipt.to}/10</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="text-label" style={{ margin: "0 0 8px", color: "var(--text-muted)" }}>Technique</p>
              <h2 style={{ margin: 0 }}>{receipt.modality} · {receipt.duration} min</h2>
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, color: delta >= 0 ? "var(--sage-deep)" : "var(--amber-deep)" }}>
              {delta > 0 ? "+" : ""}{delta} points
            </div>
          </div>

          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
            Built by Kevin · Licensed clinician · Psychiatric NP candidate · aiforj.com
          </p>
        </article>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/start" className="btn-primary" style={{ textDecoration: "none" }}>
            Get your own emotional first-aid tool →
          </Link>
          <a href={imageUrl} className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>
            View share image
          </a>
        </div>
      </section>
    </main>
  );
}
