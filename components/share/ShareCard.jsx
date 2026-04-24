import { getShareCardView } from "../../lib/shareToken";

export default function ShareCard({ payload, variant = "preview" }) {
  const view = getShareCardView(payload);
  const tall = variant === "story";

  return (
    <article
      style={{
        width: "100%",
        maxWidth: tall ? 360 : 520,
        aspectRatio: tall ? "9 / 16" : "1.91 / 1",
        borderRadius: 22,
        padding: tall ? 28 : 24,
        background: `linear-gradient(145deg, rgba(255,255,255,0.94), color-mix(in srgb, ${view.color} 18%, #F6EFE5))`,
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-md)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -50,
          top: -60,
          width: tall ? 190 : 170,
          height: tall ? 190 : 170,
          borderRadius: 999,
          background: `color-mix(in srgb, ${view.color} 22%, transparent)`,
        }}
      />
      <div style={{ position: "relative", display: "grid", gap: tall ? 18 : 12 }}>
        <div style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(45,42,38,0.08)" }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: view.color }} />
          <span className="text-label" style={{ color: "var(--text-secondary)" }}>{view.eyebrow}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: tall ? "clamp(34px, 9vw, 52px)" : "clamp(26px, 5vw, 40px)", lineHeight: 1.05 }}>
          {view.title}
        </h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: tall ? 18 : 16 }}>
          {view.body}
        </p>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(45,42,38,0.08)", paddingTop: 14 }}>
        <div>
          <strong style={{ display: "block", color: view.color }}>AIForj</strong>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Wellness companion, not therapy</span>
        </div>
        <span style={{ borderRadius: 999, padding: "8px 12px", background: "rgba(255,255,255,0.78)", color: "var(--text-primary)", fontSize: 13, fontWeight: 700 }}>
          {view.cta}
        </span>
      </div>
    </article>
  );
}
