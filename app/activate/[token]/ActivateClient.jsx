"use client";

import { useEffect, useState } from "react";
import { persistPremiumState } from "../../../utils/premiumAccess";

export default function ActivateClient({ token }) {
  const [status, setStatus] = useState("activating");
  const [message, setMessage] = useState("Checking your activation link...");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/stripe/redeem-activation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Activation failed.");
        persistPremiumState({
          active: true,
          source: data.planType || "premium",
          stripeSessionId: data.stripeSessionId,
          grantedAt: new Date().toISOString(),
          expiresAt: data.expiresAt || null,
        });
        if (active) {
          setStatus("success");
          setMessage("Premium is active on this device.");
        }
      } catch (error) {
        if (active) {
          setStatus("error");
          setMessage(error?.message || "Activation failed.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--parchment)" }}>
      <section style={{ maxWidth: 520, padding: 32, borderRadius: 24, background: "rgba(255,255,255,0.76)", border: "1px solid var(--border)", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
        <h1 style={{ margin: "0 0 12px" }}>{status === "success" ? "You're activated" : status === "error" ? "Activation needs attention" : "Activating Premium"}</h1>
        <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{message}</p>
        <a href="/companion" className="btn-primary" style={{ textDecoration: "none" }}>Open AIForj</a>
      </section>
    </main>
  );
}
