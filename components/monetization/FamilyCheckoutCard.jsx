"use client";

import { useState } from "react";
import { trackSafeMetric } from "../../lib/metrics";

export default function FamilyCheckoutCard() {
  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    trackSafeMetric({ event: "checkout_started", planType: "family", acquisitionSource: "internal" });

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: "family", householdName, acquisitionSource: "internal" }),
      });
      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data?.error || "Family checkout unavailable");
    } catch (checkoutError) {
      console.warn("Unable to start family checkout:", checkoutError);
      setError("Family checkout did not start. Please try again.");
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
        background:
          "linear-gradient(135deg, rgba(107,155,158,0.12), rgba(255,255,255,0.76))",
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: "var(--accent-teal)",
            fontWeight: 700,
          }}
        >
          Family plan
        </p>
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
          }}
        >
          Cover your household with four private Premium seats
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            maxWidth: 700,
          }}
        >
          One monthly plan. Four one-time invite links. Each person activates
          Premium on their own device, with no shared account and no family
          dashboard watching their emotional data.
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
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Household label
            <span style={{ fontWeight: 500, color: "var(--text-muted)" }}>
              {" "}
              (optional)
            </span>
          </span>
          <input
            type="text"
            value={householdName}
            onChange={(event) => setHouseholdName(event.target.value)}
            placeholder="e.g. Rivera household"
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

        <div
          style={{
            display: "grid",
            gap: 8,
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.75,
          }}
        >
          <div>Includes four private Premium invite links for one household.</div>
          <div>Each invite works once, on one device, and stays personal.</div>
          <div>No shared feed, no shared journal, no third-party trackers.</div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 28,
                color: "var(--text-primary)",
              }}
            >
              $19.99
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Monthly family plan · up to 4 people
            </div>
          </div>
          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="btn-primary"
            style={{ minWidth: 220, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Opening checkout..." : "Start family plan →"}
          </button>
        </div>

        {error ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--warning)" }}>
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
