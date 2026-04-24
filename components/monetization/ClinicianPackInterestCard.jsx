"use client";

import { useState } from "react";
import { trackSafeMetric } from "../../lib/metrics";

export default function ClinicianPackInterestCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");

  const startCheckout = async () => {
    setCheckoutLoading(true);
    setMessage("");
    trackSafeMetric({ event: "checkout_started", planType: "clinician", acquisitionSource: "internal" });

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: "clinician", acquisitionSource: "internal" }),
      });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data?.error || "Clinician checkout unavailable.");
    } catch (error) {
      setMessage(error?.message || "Clinician checkout unavailable.");
      setStatus("error");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email, source: "clinician_pack" }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to request clinician rollout help.");
      }

      setStatus("success");
      setMessage("We’ve got your clinician-pack request and can follow up with rollout help.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Unable to request clinician rollout help.");
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
          "linear-gradient(135deg, rgba(196,149,106,0.12), rgba(255,255,255,0.78))",
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
            color: "var(--amber-deep)",
            fontWeight: 700,
          }}
        >
          Clinician support
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
          Bring AIForj into private practice without compromising patient trust
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
          Want help rolling this out in your practice? Leave your work email and
          we can follow up about clinician setup, branded assets, and safer
          between-visit implementation.
        </p>
      </div>

      <form
        onSubmit={submit}
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
            Work email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@practice.com"
            autoComplete="email"
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
          <div>Handout-ready technique links for between-visit support.</div>
          <div>Branded calm cards and shareable psychoeducation assets.</div>
          <div>Patient-safe disclaimers and privacy-first implementation guidance.</div>
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
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: "var(--text-primary)" }}>$49/mo</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Private-practice setup help and rollout follow-up.
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="btn-primary"
              style={{ minWidth: 190, opacity: checkoutLoading ? 0.7 : 1 }}
            >
              {checkoutLoading ? "Opening..." : "Start clinician pack"}
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-secondary"
              style={{ minWidth: 190, opacity: status === "loading" ? 0.7 : 1 }}
            >
              {status === "loading" ? "Sending..." : "Request setup help"}
            </button>
          </div>
        </div>

        {message ? (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: status === "success" ? "var(--accent-teal)" : "var(--warning)",
            }}
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
