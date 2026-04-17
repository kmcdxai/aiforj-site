"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { activateGiftPremium } from "../../utils/premiumAccess";

export default function RedeemGiftClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [recipientName, setRecipientName] = useState("");

  const sessionId = searchParams.get("session_id") || "";
  const code = searchParams.get("code") || "";
  const hasGiftCredentials = Boolean(sessionId && code);

  const formattedExpiry = useMemo(() => {
    if (!expiresAt) return null;
    return new Date(expiresAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [expiresAt]);

  const redeem = async () => {
    if (!hasGiftCredentials || status === "redeeming") return;

    setStatus("redeeming");
    setError("");

    try {
      const response = await fetch("/api/redeem-sponsored-gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gift unavailable");
      }

      activateGiftPremium({ sessionId, expiresAt: data.expiresAt });
      setRecipientName(data.recipientName || "");
      setExpiresAt(data.expiresAt);
      setStatus("redeemed");
    } catch (redeemError) {
      setError(redeemError.message || "Unable to redeem this gift.");
      setStatus("error");
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: "84px auto 40px", padding: "0 20px" }}>
      <section
        style={{
          display: "grid",
          gap: 20,
          padding: "clamp(24px, 5vw, 36px)",
          borderRadius: 26,
          background: "rgba(255,255,255,0.68)",
          border: "1px solid rgba(45,42,38,0.08)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <p style={{ margin: 0, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent-sage)", fontWeight: 700 }}>
          Premium gift
        </p>
        <h1 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, color: "var(--text-primary)" }}>
          Redeem your month of AIForj Premium
        </h1>

        {!hasGiftCredentials ? (
          <div style={{ display: "grid", gap: 12 }}>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              This gift link is missing the information needed to redeem. Ask the sender to copy the full redeem link again.
            </p>
            <Link href="/sponsor" style={{ color: "var(--interactive)", fontWeight: 700, textDecoration: "none" }}>
              Learn about gifting Premium →
            </Link>
          </div>
        ) : status === "redeemed" ? (
          <div style={{ display: "grid", gap: 14 }}>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              {recipientName ? `${recipientName}, your` : "Your"} Premium gift is active on this device.
              {formattedExpiry ? ` It is available through ${formattedExpiry}.` : ""}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="/companion" className="btn-primary" style={{ textDecoration: "none" }}>
                Open Talk to Forj →
              </a>
              <a href="/garden" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>
                See Mood Garden →
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              This redeem link activates one month of Premium on this device. It works once, so only continue if you want to use the gift here.
            </p>
            <button
              type="button"
              onClick={redeem}
              disabled={status === "redeeming"}
              className="btn-primary"
              style={{ width: "fit-content", opacity: status === "redeeming" ? 0.7 : 1 }}
            >
              {status === "redeeming" ? "Activating gift..." : "Redeem gift →"}
            </button>
            {error ? (
              <p style={{ margin: 0, color: "var(--warning)", lineHeight: 1.7 }}>{error}</p>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
