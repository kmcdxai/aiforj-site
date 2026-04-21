"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "../lib/analytics";

export default function LeadMagnetCapture({
  title,
  description,
  source,
  pdfPath,
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_address: email,
          source,
          lead_magnet: title,
          pdf_path: pdfPath,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Try again.");
      }

      track("email_signup_submitted", { source });
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError.message || "Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <section
      style={{
        margin: "28px 0",
        padding: "28px 24px",
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(125,155,130,0.14), rgba(196,149,106,0.12))",
        border: "1px solid rgba(125,155,130,0.24)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {submitted ? (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--sage-deep)", fontWeight: 800 }}>
            Check your inbox
          </p>
          <h2 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 26 }}>
            Your panic interrupt guide is on the way.
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Buttondown will deliver the PDF link by email. If it lands in spam, mark it safe so future AIForj techniques arrive cleanly.
          </p>
          <Link
            href="/start?emotion=anxious"
            className="btn-primary"
            style={{ justifySelf: "start", textDecoration: "none", marginTop: 4 }}
          >
            Try a guided panic intervention now →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--sage-deep)", fontWeight: 800 }}>
              Free panic interrupt guide
            </p>
            <h2 style={{ margin: "0 0 10px", fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 32px)", lineHeight: 1.15 }}>
              {title}
            </h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="your@email.com"
              aria-label="Email address"
              style={{
                flex: "1 1 280px",
                padding: "17px 18px",
                fontSize: 17,
                borderRadius: 14,
                border: "1px solid rgba(125,155,130,0.38)",
                background: "rgba(255,255,255,0.72)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                border: "none",
                padding: "17px 24px",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send me the guide"}
            </button>
          </form>

          {error && (
            <p style={{ margin: 0, color: "var(--crisis)", fontSize: 14 }}>{error}</p>
          )}
        </div>
      )}
    </section>
  );
}
