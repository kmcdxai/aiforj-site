"use client";

import { useState } from "react";
import { track } from "../../lib/analytics";

export default function SponsorCheckoutCard() {
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    track("sponsor_click", { source: "sponsor_checkout" });
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-sponsor-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName }),
      });
      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data?.error || "Gift checkout unavailable");
    } catch (checkoutError) {
      console.warn("Unable to start sponsor checkout:", checkoutError);
      setError("Gift checkout did not start. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        display: "grid",
        gap: 18,
        padding: "clamp(24px, 4vw, 32px)",
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(125,155,130,0.12), rgba(255,255,255,0.76))",
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--accent-sage)", fontWeight: 700 }}>
          Sponsor a friend
        </p>
        <h1 style={{ margin: "0 0 10px", fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.15, color: "var(--text-primary)" }}>
          Gift one month of Premium to someone who needs steadier support
        </h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", maxWidth: 680 }}>
          This keeps first aid free while letting you cover a month of deeper support for someone else. No account is required. After checkout, you get a single redeem link you can send personally.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 14,
          padding: "20px 18px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(45,42,38,0.08)",
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            Recipient first name
            <span style={{ fontWeight: 500, color: "var(--text-muted)" }}> (optional)</span>
          </span>
          <input
            type="text"
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            placeholder="Who is this for?"
            maxLength={80}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid rgba(45,42,38,0.12)",
              background: "#fff",
              color: "var(--text-primary)",
              fontSize: 15,
            }}
          />
        </label>

        <div style={{ display: "grid", gap: 8, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75 }}>
          <div>Includes one month of Premium access for one person.</div>
          <div>The redeem link works once, on one device.</div>
          <div>Gift links are meant for personal sharing, not mass promotion.</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: "var(--text-primary)" }}>$9.99</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>One-time gift · one month of Premium</div>
          </div>
          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="btn-primary"
            style={{ minWidth: 220, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Opening checkout..." : "Buy the gift →"}
          </button>
        </div>

        {error ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--warning)" }}>{error}</p>
        ) : null}
      </div>
    </section>
  );
}
