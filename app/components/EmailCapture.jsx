"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <section style={{
      width: "100%",
      maxWidth: 560,
      margin: "60px auto 0",
      padding: "40px 24px",
      textAlign: "center",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(125,155,130,0.35)",
        borderRadius: 20,
        padding: "40px 28px",
      }}>
        {submitted ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 12, color: "#7D9B82" }}>✓</div>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#2D2A26",
              margin: "0 0 6px",
            }}>
              You're in.
            </p>
            <p style={{
              fontSize: 15,
              color: "rgba(45,42,38,0.78)",
              margin: 0,
            }}>
              Check your inbox (and spam folder) for a confirmation.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(22px, 4vw, 28px)",
              fontWeight: 400,
              color: "#2D2A26",
              margin: "0 0 10px",
              lineHeight: 1.3,
            }}>
              Get one 60-second technique every week
            </h3>
            <p style={{
              fontSize: 16,
              color: "rgba(45,42,38,0.88)",
              margin: "0 0 28px",
              fontWeight: 400,
              lineHeight: 1.5,
            }}>
              Free. No spam. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} style={{
              display: "flex",
              gap: 10,
              maxWidth: 420,
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="your@email.com"
                aria-label="Email address"
                style={{
                  flex: "1 1 220px",
                  padding: "14px 18px",
                  fontSize: 17,
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(125,155,130,0.4)",
                  borderRadius: 12,
                  color: "#2D2A26",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#7D9B82"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(125,155,130,0.35)"; }}
              />
              <button type="submit" disabled={loading} style={{
                padding: "14px 32px",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Fraunces', serif",
                background: "linear-gradient(135deg, #7D9B82, #6B8C6B)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: loading ? "wait" : "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 20px rgba(125,155,130,0.4)"; }}}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
            {error && (
              <p style={{ fontSize: 14, color: "#e07070", marginTop: 12, marginBottom: 0 }}>{error}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
