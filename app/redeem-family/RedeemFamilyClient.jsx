"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { activateFamilyPremium } from "../../utils/premiumAccess";

export default function RedeemFamilyClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [seatNumber, setSeatNumber] = useState(null);

  const sessionId = searchParams.get("session_id") || "";
  const code = searchParams.get("code") || "";
  const hasFamilyCredentials = Boolean(sessionId && code);

  const redeem = async () => {
    if (!hasFamilyCredentials || status === "redeeming") return;

    setStatus("redeeming");
    setError("");

    try {
      const response = await fetch("/api/redeem-family-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Family plan seat unavailable");
      }

      activateFamilyPremium({ sessionId, seatCode: code });
      setHouseholdName(data.householdName || "");
      setSeatNumber(data.seatNumber || null);
      setStatus("redeemed");
    } catch (redeemError) {
      setError(redeemError.message || "Unable to redeem this family seat.");
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
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--accent-teal)",
            fontWeight: 700,
          }}
        >
          Family plan
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
          }}
        >
          Redeem your AIForj household seat
        </h1>

        {!hasFamilyCredentials ? (
          <div style={{ display: "grid", gap: 12 }}>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              This family-plan invite is missing the information needed to redeem.
              Ask the sender to copy the full invite link again.
            </p>
            <Link
              href="/family"
              style={{ color: "var(--interactive)", fontWeight: 700, textDecoration: "none" }}
            >
              Learn about the family plan →
            </Link>
          </div>
        ) : status === "redeemed" ? (
          <div style={{ display: "grid", gap: 14 }}>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              Premium is active on this device through
              {householdName ? ` the ${householdName} household plan` : " your family plan"}.
              {seatNumber ? ` You claimed seat ${seatNumber}.` : ""}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="/companion" className="btn-primary" style={{ textDecoration: "none" }}>
                Open Talk to Forj →
              </a>
              <a
                href="/garden"
                className="btn-secondary"
                style={{ textDecoration: "none", color: "var(--sage-deep)" }}
              >
                See Mood Garden →
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              This invite link activates one family-plan Premium seat on this
              device. It works once, so only continue if you want to use your
              household seat here.
            </p>
            <button
              type="button"
              onClick={redeem}
              disabled={status === "redeeming"}
              className="btn-primary"
              style={{ width: "fit-content", opacity: status === "redeeming" ? 0.7 : 1 }}
            >
              {status === "redeeming" ? "Activating family seat..." : "Redeem family seat →"}
            </button>
            {error ? (
              <p style={{ margin: 0, color: "var(--warning)", lineHeight: 1.7 }}>
                {error}
              </p>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
